# Homerwork4:Web APIs: Code Quiz
Build a timed code quiz with multiple-choice questions.

## Details to consider
1. Webpage should be clean and responsive.
2. While [Start Quiz] button is clicked, go to questions and start timing.
3. Display feedbacks depending on user's answer. Feedbacks should time out automatically.
4. If answer is wrong, timer should cut out 15s.
5. End quiz in 3 circumistances:
    * All questions are done
    * Run out of time while user is answering questions
    * Run out of time after 15s penalty for a wrong answer
6. Once quiz is ended, stop timer, display final result, and collect user's info.(Capitalize users initial if it is lowercase)
7. Display high scores
    * High scores are sorted in desending order
    * Display [No scores available yet] if local storage is empty or user clear out the record.
    * Display only top 5 high scores just in case there is too many to list
    * Stop the timer if user go to highscores list in the middle of the quiz
8. Reset timer and highscores list(otherwise list would pile up) if user decided to retake the quiz without refreshing the website.
9. I accept negative numbers as user score(run out of time + wrong answers). It is not a bug if you see a negative score.(personal choice)
  
## Final result 
Link to final result:https://mila-mamat.github.io/homerwork4/index.html

## Demo
### Normal Quiz Flow
![](/gif/quizflow.gif)

### Alert if time is up
![](/gif/timeUp.gif)

## Extra work
I rewrote the script using jQuery instead of JavaScript as a practice.
