let startPage = document.querySelector("#start-page");
let questionPage = document.querySelector("#question-page");
let resultPage = document.querySelector("#result-page");
let endPage = document.querySelector("#end-page");


//header
let timerContainerDiv = document.querySelector("#timer-container");
let timerContainerSpan = document.querySelector("#time-left");
let timeLeft; // times left during the quiz, displayed in timerContainerDiv
//View Highscores will lead to end-page, all other pages will be hidden
document.querySelector("#view-scores").addEventListener("click", function() {
  endPage.style.display = "block";
  startPage.style.display = "none";
  questionPage.style.display = "none";
  resultPage.style.display = "none";
  listRender();
  //stop timer if someone stopped in the middle of quiz and go to highscores
  clearInterval(interval);
});


// start page : onclick --> start timing and display first question
document.querySelector("#start-btn").addEventListener("click", function() {
  startPage.style.display = "none";
  questionPage.style.display = "block";
  //display timer;reset timer to 80s and start counting down
  timerContainerDiv.style.display = "block";
  timeLeft = 80;
  timerRender();
  startTimer();
  //display the first question from question bank;reset question index if user retake the quiz without refreshing the website
  questionIndex = 0;
  getQuestions();
});

//timer counting down every second
function startTimer() {
  interval = setInterval(function() {
    timeLeft--;
    timerRender();
  }, 1000);
}

//display the time left, alert and end the quiz if time is up
function timerRender() {
  if (timeLeft < 0) {
    //adjusting timeleft from -1 to 0
    alert("Time up!");
    timeLeft++;
    endQuiz();
  } else {
    timerContainerSpan.textContent = timeLeft;
  }
}

//question-page: iterate through question bank on click
let questionBank = {};
let questionIndex;
let questionSelected; //question selected from question bank in squence using index

questionBank = [
  {
    question: "Commonly used data types DO NOT include:",
    options: ["Strings", "Booleans", "Alerts", "Numbers"],
    correctAnswer: "Alerts"
  },
  {
    question: "The condition in an if/else statement is closed with:",
    options: ["Quotes", "Curley brackets", "Comma", "Square brackets"],
    correctAnswer: "Curley brackets"
  },
  {
    question: "Arrays in JavaScript can be used to store:",
    options: [
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
    options: ["Commas", "Quotes", "Curley brackets", "Parentheses"],
    correctAnswer: "Quotes"
  }
];

function getQuestions() {
  //select a question from question bank and insert question text
  if (questionIndex < questionBank.length) {
    questionSelected = questionBank[questionIndex];
    document.querySelector("#question-text").textContent =
      questionSelected.question;
    //insert multiple choices
    for (i = 0; i < 4; i++) {
      document.querySelector(`#${CSS.escape(i)}`).textContent =
        i + 1 + ". " + questionSelected.options[i];
    }
    //increase index to push the question to next one next time
    questionIndex++;
  } else {
    //if no questions left, end quiz ?
    endQuiz();
  }
}

//alert correct / wrong after user's answer
document
  .querySelector("#multiple-choices")
  .addEventListener("click", function(event) {
    //get the answer string of the clicked button
    if (event.target.nodeName === "BUTTON") {
      let usersAnswer = event.target.textContent.slice(3);
      //if the answer is correct
      if (usersAnswer === questionSelected.correctAnswer) {
        alertCorrect();
      } else {
        // if the answer is wrong
        alertWrong();
        timeLeft = timeLeft - 15;
        timerContainerSpan.textContent = timeLeft;
        //make sure there is enough time left after penalty
        if (timeLeft <= 0) {
          setTimeout(function() {
            alert("Opps! No more time left after 15s penalty.");
            endQuiz();
          }, 500);
        }
      }
    }
  });

function alertCorrect() {
  let state = document.querySelector("#alert-correct");
  state.setAttribute("data-state", "display");
  setTimeout(function() {
    state.setAttribute("data-state", "hidden");
    getQuestions();
  }, 500);
}

function alertWrong() {
  let state = document.querySelector("#alert-wrong");
  state.setAttribute("data-state", "display");
  setTimeout(function() {
    state.setAttribute("data-state", "hidden");
    getQuestions();
  }, 500);
}

//end quiz and display result page if time is up or all questions are done.
function endQuiz() {
  questionPage.style.display = "none";
  resultPage.style.display = "block";
  document.querySelector("#final-score").textContent = timeLeft;
  //stop counting down
  clearInterval(interval);
}
//result page: display final score, get user info
//retrive stored scores from client

let storedScores;
document.querySelector("#submit-btn").addEventListener("click", function(event) {
  storedScores = JSON.parse(localStorage.getItem("storedScores"));
//storage equals to an empty array if no previous scores
storedScores = storedScores || [];
  event.preventDefault();
  // get user info and add into stroed scores
  let userInfo = {
    userName: document.querySelector("#initial").value.trim().toUpperCase(),
    userScore: timeLeft
  };
  storedScores.push(userInfo);
  //sort stored scroes by score
  storedScores.sort(function(a, b) {
    return b.userScore - a.userScore;
  });
  //store updated scores
  localStorage.setItem("storedScores", JSON.stringify(storedScores));
  //direct to forth page
  resultPage.style.display = "none";
  endPage.style.display = "block";
  listRender();
});


// end-page: list top 5 scores stored. Direct to start-page or clear stored scores by click.
//list top 5 scores
function listRender() {
  let scoreList = document.querySelector("#high-scores");
  //clean up the <ol> to aboid <li>s from stacking up if users retook the quiz without refreshing
  scoreList.innerHTML = "";
  storedScores = JSON.parse(localStorage.getItem("storedScores"));
  if (!storedScores) {
    // display place-holder if no scores are stored(ie,routed by "View highscores" directly or user cleared scores)
    let placeHolder = document.createElement("div");
    placeHolder.textContent = "No scores available yet.";// 
    scoreList.appendChild(placeHolder);
  } else {
    //list the top 5 high scores stored
    for (i = 0; i < 5; i++) {
      let highScoreInfo = document.createElement("li");
      highScoreInfo.textContent = storedScores[i].userName + " - " + storedScores[i].userScore;
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
  endPage.style.display = "none";
  startPage.style.display = "block";
  timerContainerDiv.style.display = "none";
});