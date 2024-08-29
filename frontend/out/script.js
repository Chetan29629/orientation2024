const mainLoader = document.getElementById('mainLoader');
const bodyContainer = document.getElementById('bodyContainer');


const WEBSOCKET_URL = "ws://localhost:3000"
let socket;
let connected = false;
let id = "";
let self_name = "";

let current_question = -1;
let all_filled = false;

let completed = false;

// establishWebSocketConnection();
showMainLoader(false);
addListeners()

let details_container = `<div class="container">
 <div class="quizDetailsContainer">
            <div class="welcome">
                <h1>Welcome to Orientation Quiz</h1>
               
            </div>
            <div class="quizDetails">
                <input type="text" id="nameInput" placeholder="Enter your name" required>
            </div>

            <div class="quizDetails">
                <input type="number" id="nameInput" placeholder="Enter Quiz Code" required>
            </div>
            <div class="start-button">
                <button type="button" id="startButton">Start Quiz</button>
        
        </div>
        </div>`

let question_container = `
<div class="container">
<div class="questionContainer">
            <div class="timer" id="quiz_timer">
                00:00
             </div>
             <div class="question" id="question_holder">
                 What is the capital of France?
             </div>
             <div class="options">
                 <label id="option1"></label>
                 <label id="option2"><input type="radio"  name="option" value="1"></label>
                 <label id="option3"><input type="radio"  name="option" value="2"></label>
                 <label id="option4"><input type="radio"  name="option" value="3"></label>
             </div>
             <div class="next-button">
                 <button type="button" onclick="validateAnswer()">Next</button>
             </div>
        </div>
        </div>`

let leaderboard_body_container = `
<div class="timer" id="quiz_timer2">
             </div><div class="leaderBoardContainer">
            <div class="leaderBoardSubContainer">
                <h1>Leaderboard</h1>
                <div class="leaderboard">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score</th>
                                <th>Time (sec)</th>
                            </tr>
                        </thead>
                        <tbody id="table_body">
                        
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
`

let winner_body_container = `<div class="winner-section">
            <h1 id="congrats">Congratulations to Our First Position Holder!</h1>
            <p>As a token of appreciation, here is a special coupon code just for you:</p>
            <p id="clipboardCopyStatus">Click Given Code to copy it.</p>
                <button type="button" id="prizeBtn"onclick="copyCode()" class="couponcode">CODE1234</button>
            <p>Use this code at Zomato to enjoy your reward!</p>
        </div>`



// add a few crucial event listeners.
function addListeners() {
    window.addEventListener('beforeunload', (event) => {
        // Set the message to be shown in the confirmation dialog
        const message = 'Are you sure you want to leave? Your changes might not be saved.';
        // Standard for most browsers
        event.preventDefault();
        // Chrome requires returnValue to be set
        event.returnValue = message;
        // For other browsers
        return message;
    });
}
// copy to clipboard.
function copyCode() {
    navigator.clipboard.writeText(document.getElementById("prizeBtn").innerHTML).then(() => {
        console.log('Text copied to clipboard');
        let status = document.getElementById("clipboardCopyStatus");
        status.innerHTML = "Copied to clipboard!";
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// function to validate the name and code input.
function validateDetails() {
    showMainLoader(true)
    let name = document.getElementById("nameInput").value;
    let code = document.getElementById("codeInput").value;

    if (name !== "" && code !== "") {
        self_name = name
        establishWebSocketConnection(name, code);
    } else {
        alert("No entries are allowed to be empty!");
    }
}

// validate answers.
function validateAnswer() {
    showMainLoader(true)
    let selected = -1;
    const radios = document.querySelectorAll('input[name="option"]');

    // Iterate over the radio buttons
    for (const radio of radios) {
        if (radio.checked) {
            // If the radio button is checked, log its value
            console.log('Selected value:', radio.value);
            selected = radio.value;

        }
    }
    // console.log(selected)
    if (selected != -1) {
        onOptionSelected(selected);
    } else {
        alert("Please select one option!")
        showMainLoader(false)
    }

}

// makes a websocket connection.
function establishWebSocketConnection(name, code) {
    socket = new WebSocket(WEBSOCKET_URL)
    socket.addEventListener('open', (event) => {
        console.log("connected to the server!");
        socket.send(JSON.stringify({ function_name: "check_code", name, code }));
        socket.addEventListener('message', (event) => {
            let response = JSON.parse(event.data);
            // console.log(response.status)
            switch (response.function_name) {
                case "code_checked":
                    {
                        switch (response.status) {
                            case 1: {
                                let name = document.getElementById("nameInput");
                                let code = document.getElementById("codeInput");
                                name.value = "";
                                code.value = "";
                                alert("Incorrect code!")
                                showMainLoader(false)
                                if (socket) {
                                    socket.close()
                                }
                                connected = false
                                break;
                            }
                            case 0: {
                                onCodeCorrect(response.id);
                                break;
                            }
                        }
                        break;
                    }
                case "time_update":
                    {

                        let time = response.time / 1000.0;
                        let timer_container = document.getElementById("quiz_timer");
                        let timer_container2 = document.getElementById("quiz_timer2")

                        let minutes = Math.floor(time / 60)
                        let seconds = Math.floor(time % 60)

                        let time_string = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);

                        if (timer_container) {
                            timer_container.innerHTML = time_string;
                        }
                        if (timer_container2) {
                            timer_container2.innerHTML = time_string;
                        }


                        break;

                    }
                case "next_question":
                    {
                        switch (response.status) {
                            case 0:
                                {
                                    onNewQuestion(response.question)
                                    break;
                                }
                            case 1:
                                {
                                    onQuestionsComplete(response.score)
                                    break;
                                }
                        }

                        break;
                    }
                case "question_answered":
                    {
                        onQuestionAnsweredSucessfully();
                        break;
                    }
                case "time_over":
                    {
                        onQuestionsComplete(response.score, true)
                        break;
                    }

            }

        })
    })
}

function onCodeCorrect(user_id) {
    // showMainLoader(false)
    id = user_id
    bodyContainer.innerHTML = question_container;
    fetchQuestion();
    connected = true
    startUserTime()
}

function startUserTime() {
    setInterval(() => {
        if (socket && !isMainLoaderVisible() && !all_filled) {
            socket.send(JSON.stringify({ function_name: "update_user_time" }))
        }
    }, 100)
}
// fetches next questions.
function fetchQuestion() {
    if (socket) {
        socket.send(JSON.stringify({ "function_name": "next_question", "data": current_question }))
        current_question++;
    }
}

// called when an option is selected and next button is pressed.
function onOptionSelected(option_value) {
    if (socket) {
        socket.send(JSON.stringify({ "function_name": "option_filled", "user_id": id, "name": self_name, "question_idx": current_question, "selected": option_value }));

    }
}

function onQuestionAnsweredSucessfully() {

    fetchQuestion();
}
// sets the new recieved question into the tags.
function onNewQuestion(question_obj) {
    showMainLoader(false)
    console.log(question_obj)
    let question_container = document.getElementById("question_holder");
    let option_1 = document.getElementById("option1");
    let option_2 = document.getElementById("option2");
    let option_3 = document.getElementById("option3");
    let option_4 = document.getElementById("option4");

    question_container.innerHTML = question_obj.q
    option_1.innerHTML = `<input type="radio"  name="option" value="0">` + question_obj.o1
    option_2.innerHTML = `<input type="radio"  name="option" value="1">` + question_obj.o2
    option_3.innerHTML = `<input type="radio"  name="option" value="2">` + question_obj.o3
    option_4.innerHTML = `<input type="radio"  name="option" value="3">` + question_obj.o4

}

// called when all the questions are completed.
function onQuestionsComplete(scores, is_quiz_completed = false) {
    if (!completed) {
        all_filled = true
        bodyContainer.innerHTML = leaderboard_body_container;
        let table_body = document.getElementById("table_body")
        let self_idx;
        scores.sort((a, b) => {
            // First, compare by score in descending order
            if (a.correct !== b.correct) {
                return b.correct - a.correct;
            }

            // If scores are equal, compare by time_taken in ascending order
            return a.time_taken - b.time_taken;
        });

        for (user of scores) {
            if (user.id === id) {
                self_idx = scores.findIndex(element => element.id === user.id) + 1;
            }
            let idx = scores.findIndex(element => element.id === user.id) + 1;
            let user_name = user.name;
            let score = user.correct;
            let time_taken = user.time / 1000.0;

            let tr = document.createElement("tr");
            let idx_td = document.createElement("td");
            let name_td = document.createElement("td");
            let score_td = document.createElement("td");
            let time_td = document.createElement("td");

            idx_td.innerHTML = idx;
            name_td.innerHTML = (user.id === id ? "You" : user_name);
            score_td.innerHTML = score;
            time_td.innerHTML = time_taken

            if (user.id === id) {
                idx_td.style.fontWeight = "bolder";
                name_td.style.fontWeight = "bolder";
                score_td.style.fontWeight = "bolder";
                time_td.style.fontWeight = "bolder";
            }


            tr.appendChild(idx_td);
            tr.appendChild(name_td);
            tr.appendChild(score_td);
            tr.appendChild(time_td);


            table_body.appendChild(tr)

        }
        if (is_quiz_completed) {
            completed = true
            if (self_idx === 1) {

                showPrize()
            }
        }
        showMainLoader(false)
    }


}

// function to toggle the display of the main loader.
function showMainLoader(show) {
    if (show) {
        mainLoader.style.display = 'block';
    } else {
        mainLoader.style.display = 'none';
    }
}

function showPrize() {
    bodyContainer.innerHTML = winner_body_container;

}

function isMainLoaderVisible() {
    let result;
    if (mainLoader.style.display === 'block') {
        result = true;
    } else {
        result = false;
    }
    return result;
}