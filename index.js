// app.js

const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { start } = require('repl');
const port = 3000;

let questions=[

  {
      "q":"What is the basic unit of life?",
      "o1" : "Cell",
      "o2" : "Atom",
      "o3" : "Molecule",
      "o4" : "Organ",
      "c" : 0,
  },
  
  
  {
      "q":"Which organelle is responsible for protein synthesis in a cell?",
      "o1" : "Nucleus",
      "o2" : "Golgi apparatus",
      "o3" : "Ribosomes",
      "o4" : "Mitochondrion",
      "c" : 2,
  },
  
  
  {
      "q":"Photosynthesis primarily occurs in which part of a plant cell?",
      "o1" : "Nucleus",
      "o2" : "Vacuole",
      "o3" : "Mitochondria",
      "o4" : "Chloroplast",
      "c" : 3,
  },
  
  
  {
      "q":"Which molecule carries genetic information in a cell?",
      "o1" : "RNA",
      "o2" : "DNA",
      "o3" : "Protein",
      "o4" : "Lipid",
      "c" : 1,
  },
  
  
  {
      "q":"What is the chemical symbol for gold?",
      "o1" : "Au",
      "o2" : "Ag",
      "o3" : "Fe",
      "o4" : "Cu",
      "c" : 0,
  },
  
  
  {
      "q":"Which acid is found in citrus fruits?",
      "o1" : "Sulfuric acid",
      "o2" : "Nitric acid",
      "o3" : "Citric acid",
      "o4" : "Hydrochloric acid",
      "c" : 2,
  },
  
  
  
  {
      "q":"What is the SI unit of force?",
      "o1" : "Joule",
      "o2" : "Watt",
      "o3" : "Ohm",
      "o4" : "Newton",
      "c" : 3,
  },
  
  
  {
      "q":"What is the pH value of a neutral substance?",
      "o1" : "7",
      "o2" : "1",
      "o3" : "14",
      "o4" : "0",
      "c" : 0,
  },
  
  
  
  {
      "q":"What is the phenomenon where a wave bends as it passes from one medium to another?",
      "o1" : "Diffraction",
      "o2" : "Reflection",
      "o3" : "Refraction",
      "o4" : "Dispersion",
      "c" : 2,
  },
  
  
  
  
  {
      "q":"Which scientist is known for the laws of motion and universal gravitation?",
      "o1" : "Albert Einstein",
      "o2" : "Isaac Newton",
      "o3" : "Galileo Galilei",
      "o4" : "Nikola Tesla",
      "c" : 1,
  }
  
  ];
// let questions = [
//   {
//     "q": "Which Indian state is known as the “Land of the Gods” due to its numerous temples and shrines?",
//     "o1": "Uttarakhand",
//     "o2": "Himachal Pradesh",
//     "o3": "Odisha",
//     "o4": "Bihar",
//     "c": 0
//   },
//   {
//     "q": "Pakistan get  separated  from India  on which date?",
//     "o1": "August 14, 1947",
//     "o2": "August 15, 1947",
//     "o3": "January 26, 1950",
//     "o4": "May 1, 1946",
//     "c": 0
//   },
//   {
//     "q": "Who designed The national flag of india?",
//     "o1": "Sukhdev Thapar",
//     "o2": "Baba Ram chandra",
//     "o3": "Hema Malini",
//     "o4": "Pingali Venkayya",
//     "c": 3
//   },
//   {
//     "q": "The Indian national flag has three colors – saffron, white, and green. What do these colors represent?",
//     "o1": "Courage, peace, and fertility",
//     "o2": "Sacrifice, purity, and prosperity",
//     "o3": "Love, purity, and growth",
//     "o4": "Power, truth, and harmony",
//     "c": 1
//   },
//   {
//     "q": "Who was the leader of the Indian independence movement and inspired the philosophy of non-violence (ahimsa)?",
//     "o1": "Subhas Chandra Bose",
//     "o2": "Bhagat Singh",
//     "o3": "Mahatma Gandhi",
//     "o4": "Jawaharlal Nehru",
//     "c": 2
//   },
//   {
//     "q": "Who is known as the “Missile Man of India”?",
//     "o1": "Dr. A. P. J. Abdul Kalam",
//     "o2": "Dr. Homi J. Bhabha",
//     "o3": "Dr. C. V. Raman",
//     "o4": "Dr. Vikram Sarabhai",
//     "c": 0
//   },
//   {
//     "q": "The Kargil War was fought between India and which country?",
//     "o1": "Pakistan",
//     "o2": "China",
//     "o3": "Afghanistan",
//     "o4": "Bangladesh",
//     "c": 0
//   },
//   {
//     "q": "The Jallianwala Bagh massacre, a horrific event in Indian history, took place in which year?",
//     "o1": "1910",
//     "o2": "1916",
//     "o3": "1919",
//     "o4": "1915",
//     "c": 2
//   },
//   {
//     "q": "When was the Indian Constitution Legally Enforced?",
//     "o1": "26 January 1948",
//     "o2": "26 January 1951",
//     "o3": "15 August 1947",
//     "o4": "26 January 1950",
//     "c": 3
//   },
//   {
//     "q": "Which city in Rajasthan is known as the “Blue City” due to the color of its houses?",
//     "o1": "Udaipur",
//     "o2": "Jodhpur",
//     "o3": "Jaipur",
//     "o4": "Bikaner",
//     "c": 1
//   },
//   {
//     "q": "Which is the largest desert in India?",
//     "o1": "Thar Desert",
//     "o2": "Rann of Kutch",
//     "o3": "Ladakh Desert",
//     "o4": "Cold Desert",
//     "c": 0
//   }
// ] // an array for storing questions.


const CODE = 3469;
const QUIZ_CODE = 9591
let started = false // to start the quiz server.
let users = [] // and array for storing users.

let score = []


let clients = new Set(); // To keep track of connected clients

let total_quiz_time = 10 * 1000 * 60 // time in milliseconds.
let current_quiz_time = total_quiz_time


// Middleware to parse JSON bodies.
app.use(express.json());

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a WebSocket server attached to the same HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', ws => {
  if (started) {
    console.log('WebSocket connection established');
    clients.add(ws); // Add the new client to the set

    ws.on('message', message => {
      // console.log(`Received message: ${message}`);

      let obj = JSON.parse(message);

      switch (obj.function_name) {
        case "check_code":
          {
            var res = checkEntryCode(obj.name, obj.code, ws)
            // console.log(res)
            if (res.status === 0){
              ws.send(JSON.stringify(res))
            
            }else{
              ws.send(JSON.stringify(res))
            }
            break;
          }
          
        
        case "next_question":
          {
            let question = getNextQuestion(obj.data);
  
            if (question !== "done"){
              ws.send(JSON.stringify({"function_name": "next_question", "status": 0, question}));
            }
            else{
              setInterval(()=>{
                ws.send(JSON.stringify({"function_name": "next_question", "status": 1, score}));
              }, 3000)
              
            }
            break;
          }

          case "option_filled":
            {
              // let user = getUserObjById(obj.user_id)
              // console.log(obj.user_id)
              if(obj.user_id){
                checkFilledOption(obj)
                
                ws.send(JSON.stringify({"function_name": "question_answered"}))
              }
              break;
            }
          case "update_user_time": {
            updateUserTime(ws);
            break;
          }
      }
      // ws.send(JSON.stringify(users));
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      clients.delete(ws); // Remove the client from the set
      if (getUserObjBySocket(ws)){
        users = users.filter(item => item !== getUserObjBySocket(ws));
      }
      if (getScoreObjBySocket(ws)){
        score = score.filter(item => item !== getScoreObjBySocket(ws));
      }
   
    });
  }else{
    
  }

});


setInterval(() => {
  if (started) {
  
    for(user of users){
      // console.log(user)
      let socket = user.socket;
      socket.send(JSON.stringify({"function_name": "time_update", time: current_quiz_time}))
    }
    // updateUserTime()
    current_quiz_time -= 1000;
    checkTimeOver();
  }

}, 1000)

// // Send a message to all connected clients every second
// setInterval(() => {
//   const message = 'Hello from the server';
//   clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }, 1000); // 1000 milliseconds = 1 second



// Route for the home page.
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});





app.get('/results', (req, res) => {
  res.send("This is a result route");
})
app.get('/next-question', (req, res) => {
  res.send("This is a next questoin route")
})

// route to start the quiz.
app.get('/start-quiz', (req, res) => {
  let code = req.query.code;
  // console.log(code)
  if(code == CODE){
    started = true;
    current_quiz_time = total_quiz_time
    res.status(200).send("success");
    return
  }
  res.status(200).send("incorrect code");
  
})

app.get('/stop-quiz', (req, res)=>{
  let code = req.query.code;
  // console.log(code)
  if(code == CODE){
    started = false;
    current_quiz_time = total_quiz_time
    showResults();
    res.status(200).send("success");
    return
  }
  res.status(200).send("incorrect code");
  
})

app.get('/reset-quiz', (req, res) =>{
  let code = req.query.code;
  // console.log(code)
  if(code == CODE){
    started = false;
    current_quiz_time = total_quiz_time
    users = []
    score = []
    clients = new Set();
    res.status(200).send("success");
    return
  }
  res.status(200).send("incorrect code");
})
// check if the quiz timer is finished.
function checkTimeOver(){
  if (current_quiz_time <= 0){
    showResults()
      started = false
  }
}

function showResults(){
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({"function_name": "time_over", score}));
    }
  });
}
// checks if the entry code is correct.
function checkEntryCode(name, code, socket){
  let response = {}
  if(code == QUIZ_CODE){
    var id = addUser(name, socket)
    response.id = id
    response.status = 0
  }else{
    response.status = 1
  }
  response.function_name = "code_checked";
  return response
}

// checks if the filled option is correct and increment the correct number.
function checkFilledOption(obj){
  
  let question = questions[obj.question_idx]
  // console.log(obj.question_idx)
  let sc;
  for(score_obj of score){
    if (score_obj.id === obj.user_id){
      sc = score_obj;
    }
  }
  if (!sc){
    sc = {
      id: obj.user_id,
      name: obj.name,
      socket: getUserObjById(obj.user_id).socket,
      correct: 0,
      time: 0
    }
    score.push(sc)
  }
  
  if(question["c"] == obj.selected){
    sc.correct++;
  }
}

// returns the next question as an object.
function getNextQuestion(current_question_idx) {
  if (current_question_idx === -1){
    return questions[0]
  }
  // console.log(current_question_idx)
  if (current_question_idx >= questions.length - 1){
    return "done";
  }
  
  return questions[current_question_idx + 1];
}

// adds a user to the users array.
function addUser(user_name, user_socket) {
  let name = user_name;
  let socket = user_socket;
  let id = generateRandomId();

  var user_obj = {
    name,
    socket,
    id
  }

  users.push(user_obj);
  return id
}


// updates the time for the user.
function updateUserTime(ws){
  let score_obj = getScoreObjBySocket(ws);

  if(score_obj){
    score_obj.time += 100;
  }
}
// helper function to generate a random id for a newly added user.
function generateRandomId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  let idExists = false;
  for (let i of users) {
    if ((i.id) === result) {
      idExists = true
    } else {
      idExists = false
    }

  }
  if (!idExists) {
    return result
  } else {
    return generateRandomId();
  }

}


// returns the user object from its id.
function getUserObjById(user_id){
  let result;
  for(user of users){
    if (user.id === user_id){
      result = user
    }
  }
  return result;
}

function getUserObjBySocket(socket){
  let result;
  for(user of users){
    if(user.socket === socket){
      result = user;
    }
  }
  return result
}


function getTimerObjBySocket(socket){
  let result;
  for(timer of time_taken){
    if(timer.socket === socket){
      result = timer;
    }
  }
  return result
}





function getScoreObjBySocket(socket){
  let result;
  for(user of score){
    if(user.socket === socket){
        result = user
    } 
  }
  return result;
}

function getMaxScoreUser(){
  
}
// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});