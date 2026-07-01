# Engineering Quiz Arena – Day 7 Report

## Date

03 June 2026

## Objective

Implement the complete quiz-taking workflow, allowing authenticated users to start quizzes, fetch questions, submit answers, and receive final scores.

## Work Completed

### 1. Quiz Start API

Implemented endpoint:

POST /api/quizzes/start/

Features:

* Authenticated access only
* Creates QuizAttempt record
* Associates attempt with selected subject
* Tracks quiz status and start time

### 2. Question Retrieval API

Implemented endpoint:

GET /api/quizzes/<attempt_id>/questions/

Features:

* Retrieves all questions belonging to the selected subject
* Returns nested options for each question
* Hides correct-answer information from users

### 3. Answer Submission API

Implemented endpoint:

POST /api/quizzes/submit-answer/

Features:

* Accepts question and selected option
* Validates quiz attempt ownership
* Verifies option belongs to question
* Automatically determines correctness
* Stores responses in UserAnswer table

### 4. Quiz Completion API

Implemented endpoint:

POST /api/quizzes/finish/

Features:

* Calculates total correct answers
* Calculates total questions
* Computes percentage score
* Marks attempt as COMPLETED
* Stores completion timestamp

## Testing Performed

### Authentication Tests

* JWT login verified
* Protected endpoints verified
* Expired token handling verified

### Quiz Flow Tests

* Quiz creation successful
* Question retrieval successful
* Answer submission successful
* UserAnswer records created correctly
* Final score calculation verified

### Final Result

Score: 2/3

Percentage: 66.67%

Status: COMPLETED

## Outcome

The backend now supports a complete end-to-end quiz workflow.

Users can:

* Start quizzes
* Retrieve questions
* Submit answers
* Complete quizzes
* Receive calculated scores

This represents the first fully playable version of the Engineering Quiz Arena backend.
