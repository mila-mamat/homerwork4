let startPage = $("#start-page");
let questionPage = $("#question-page");
let resultPage = $("#result-page");
let endPage = $("#end-page");


//header
let timerContainerDiv = $("#timer-container");
let timerContainerSpan = $("#time-left");
let timeLeft; // times left during the quiz, displayed in timerContainerDiv
//View Highscores will lead to end-page, all other pages will be hidden
$("#view-scores").on("click", function() {
  endPage.css("display","block")
  $("section:not(:last-child)").css("display","none")
  listRender();
  //stop timer if someone stopped in the middle of quiz and go to highscores
  clearInterval(interval);
});


// start page : onclick --> start timing and display first question
$("#start-btn").on("click", function() {
  startPage.css("display","none")
  questionPage.css("display","block")
  //display timer;reset timer to 80s and start counting down
  timerContainerDiv.css("display","block")
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
    timerContainerSpan.text(timeLeft);
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
    $("#question-text").text(questionSelected.question);
    //insert multiple choices
    for (i = 0; i < 4; i++) {
      $(`#${CSS.escape(i)}`).text (i + 1 + ". " + questionSelected.options[i]);
    }
    //increase index to push the question to next one next time
    questionIndex++;
  } else {
    //if no questions left, end quiz ?
    endQuiz();
  }
}

//alert correct / wrong after user's answer
$("#multiple-choices .btn").on("click", function(event) {
    //get the answer string of the clicked button
    if ($(this).prop("nodeName") === "BUTTON") {
      let usersAnswer = $(this).text().slice(3); 
      //if the answer is correct
      if (usersAnswer === questionSelected.correctAnswer) {
        alertCorrect();
      } else {
        // if the answer is wrong
        alertWrong();
        timeLeft = timeLeft - 15;
        timerContainerSpan.text(timeLeft);
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
  let state = $("#alert-correct");
  state.attr("data-state", "display");
  setTimeout(function() {
    state.attr("data-state", "hidden");
    getQuestions();
  }, 500);
}

function alertWrong() {
  let state = $("#alert-wrong");
  state.attr("data-state", "display");
  setTimeout(function() {
    state.attr("data-state", "hidden");
    getQuestions();
  }, 500);
}

//end quiz and display result page if time is up or all questions are done.
function endQuiz() {
  questionPage.css("display","none")
  resultPage.css("display","block")
  $("#final-score").text(timeLeft);
  //stop counting down
  clearInterval(interval);
}
//result page: display final score, get user info
//retrive stored scores from client

let storedScores;
$("#submit-btn").on("click", function(event) {
  //storage equals to an empty array if no previous scores
  storedScores = (JSON.parse(localStorage.getItem("storedScores"))||[])
  event.preventDefault();
  // get user info and add into stroed scores
  let userInfo = {
    userName: $("#initial").val().trim().toUpperCase(),
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
  resultPage.css("display","none")
  endPage.css("display","block")
  listRender(); 
});


// end-page: list top 5 scores stored. Direct to start-page or clear stored scores by click.
//list top 5 scores
function listRender() {
  let scoreList = $("#high-scores");
  //clean up the <ol> to aboid <li>s from stacking up if users retook the quiz without refreshing
  scoreList.html("");
  storedScores = JSON.parse(localStorage.getItem("storedScores"));
  if (!storedScores) {
    // display place-holder if no scores are stored(ie,routed by "View highscores" directly or user cleared scores)
    scoreList.append($("<div>").text("No scores available yet."));
  } else {
    //list the top 5 high scores stored
    for (i = 0; i < 5; i++) {
      scoreList.append($("<li>").text(storedScores[i].userName + " - " + storedScores[i].userScore));
    }
  }
}

//clear stored scores
$("#clear-btn").on("click", function() {
  localStorage.clear();
  listRender();
});

//direct to start-page
$("#go-back-btn").on("click", function() {
  endPage.css("display","none")
  startPage.css("display","block")
  timerContainerDiv.css("display","none")
});