//View Highscores will lead to end-page, all other pages will be hidden
document.querySelector("#view-scores").addEventListener("click", function() {
  document.querySelector("#end-page").style.display = "block";
  document.querySelector("#start-page").style.display = "none";
  document.querySelector("#question-page").style.display = "none";
  document.querySelector("#result-page").style.display = "none";
  listRender();
  //just in case someone stopped in the middle of quiz and go to highscores
  clearInterval(interval)
});

// start page : onclick --> start timing and display first question
document.querySelector("#start-btn").addEventListener("click", function() {
  document.querySelector("#start-page").style.display = "none";
  document.querySelector("#question-page").style.display = "block";
  //display timer;reset timer to 80s and start counting down
  document.querySelector("#timer").style.display = "block";
  timeLeft = 80;
  timerRender();
  startTimer();
  //display the first question from question bank;reset question index if user retake the quiz
  questionIndex = 0;
  getQuestions();
});

function startTimer() {
  interval = setInterval(function() {
    timeLeft--;
    timerRender();
  }, 1000);
}

//render the time left, alert and end the quiz if time is up
function timerRender() {
  if (timeLeft < 0) {
    //adjusting timeleft from -1 to 0
    alert("Time up!")
    timeLeft++;
    endQuiz();
  } else {
    document.querySelector("#time-left").textContent = timeLeft;
  }
}

//question-page: iterate through question bank on click
questionBank = [
  {
    question: "Commonly used data types DO NOT include:",
    choices: ["Strings", "Booleans", "Alerts", "Numbers"],
    correctAnswer: "Alerts"
  },
  {
    question: "The condition in an if/else statement is closed with:",
    choices: ["Quotes", "Curley brackets", "Comma", "Square brackets"],
    correctAnswer: "Curley brackets"
  },
  {
    question: "Arrays in JavaScript can be used to store:",
    choices: [
      "Numbers and strings",
      "Booleans",
      "Other arrays",
      "All of the above"
    ],
    correctAnswer: "All of the above"
  },
  {
    question:
      "String values must  be enclosed within _____ when assigned to variables.",
    choices: ["Commas", "Quotes", "Curley brackets", "Parentheses"],
    correctAnswer: "Quotes"
  }
];

//get questions from question bank and display
function getQuestions() {
  //select a question from question bank and insert question text
  if (questionIndex < questionBank.length) {
    questionSelected = questionBank[questionIndex];
    document.querySelector("#question-text").textContent =
      questionSelected.question;
    //insert multiple choices
    for (i = 0; i < 4; i++) {
      document.querySelector(`#${CSS.escape(i)}`).textContent =
        i + 1 + ". " + questionSelected.choices[i];
    }
    //increase index to push the question to next one next time
    questionIndex++;
  } else {
    //if no questions left, end quiz ?
    endQuiz();
  }
}

//alert correct / wrong after user's choice
document.querySelector("#multiple-choices").addEventListener("click", function(event) {
    //get the answer string of the clicked button
    if(event.target.nodeName === "BUTTON"){
      let choice = event.target.textContent.slice(3);
      //if the answer is correct
      let correctAnswer = questionSelected.correctAnswer;
      if (choice === correctAnswer) {
        alertCorrect();
      } else { // if the answer is wrong
        alertWrong();
        timeLeft= timeLeft -15;
        document.querySelector("#time-left").textContent = timeLeft;
        //make sure there is enough time left after penalty
        if(timeLeft <= 0){
        alert("Opps! your time is below 0 already!")
        endQuiz()
        } 
      }
    }
  });

function alertCorrect() {
  let state = document.querySelector("#alert-correct");
  state.setAttribute("data-state", "display");
  setTimeout(function() {
    state.setAttribute("data-state", "hidden");
    getQuestions()
  }, 300);
}

function alertWrong() {
  let state = document.querySelector("#alert-wrong");
  state.setAttribute("data-state", "display");
  setTimeout(function() {
    state.setAttribute("data-state", "hidden");
    getQuestions()
  }, 300);

}

//end quiz and display result page if time is up or all questions are done. 
function endQuiz() {
  document.querySelector("#question-page").style.display = "none";
  document.querySelector("#result-page").style.display = "block";
  document.querySelector("#final-score").textContent = timeLeft;
  //stop counting down
  clearInterval(interval);
 
}

//result page: display final score, get user info
//retrive stored scores from client
let storedScores = JSON.parse(localStorage.getItem("storedScores"));
console.log(storedScores);
//storage equals to an empty array if no previous scores
let storage = storedScores || [];
document
  .querySelector("#submit-btn")
  .addEventListener("click", function(event) {
    event.preventDefault();
    // get user info and add into stroed scores
    let userInfo = {
      userName: document
        .querySelector("#initial")
        .value.trim()
        .toUpperCase(),
      userScore: timeLeft
    };
    console.log(userInfo);
    storage.push(userInfo);
    //sort stored scroes by score
    storage.sort(function(a, b) {
      return b.userScore - a.userScore;
    });
    //store updated scores
    localStorage.setItem("storedScores", JSON.stringify(storage));
    console.log(localStorage);
    //direct to forth page
    document.querySelector("#result-page").style.display = "none";
    document.querySelector("#end-page").style.display = "block";
    listRender();
  });

// end-page: list top 5 scores stored. Direct to start-page or clear stored scores by click.
//list top 5 scores
let scoreList = document.querySelector("#high-scores");
let placeHolder = document.createElement("div");
placeHolder.textContent = "No scores available yet.";

function listRender() {
  //clean up the lists if append earlier
  scoreList.innerHTML = "";
  // if no scores are stored(routed by "View highscores" directly), display place-holder
  storedScores = JSON.parse(localStorage.getItem("storedScores"));
  if (!storedScores) {
    scoreList.appendChild(placeHolder);
  } else {
    for (i = 0; i < 5; i++) {
      highScoreInfo = document.createElement("li");
      highScoreInfo.textContent =
        storedScores[i].userName + " - " + storedScores[i].userScore;
      scoreList.appendChild(highScoreInfo);
    }
  }
}

//clear stored scores
document.querySelector("#clear-btn").addEventListener("click", function() {
  localStorage.clear();
  listRender();
});

//direct to start-page
document.querySelector("#go-back-btn").addEventListener("click", function() {
  document.querySelector("#end-page").style.display = "none";
  document.querySelector("#start-page").style.display = "block";
  document.querySelector("#timer").style.display = "none";
});
