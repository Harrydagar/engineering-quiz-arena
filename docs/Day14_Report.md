# Day 14 Report – Quiz Review & Learning System

**Date:** 05 June 2026

## Objectives

Implement learning-focused features that allow users to review completed quizzes, analyze mistakes, and track past performance.

---

## Features Implemented

### 1. Quiz History API

**Endpoint**

```
GET /api/quizzes/history/
```

**Functionality**

* Returns all completed quiz attempts of the authenticated user.
* Displays:

  * Quiz ID
  * Subject
  * Score
  * Accuracy Percentage
  * Completion Time

**Status:** Completed & Tested

---

### 2. Quiz Review API

**Endpoint**

```
GET /api/quizzes/review/<attempt_id>/
```

**Functionality**

* Provides a detailed review of a completed quiz.
* Displays:

  * Question
  * Difficulty Level
  * User's Answer
  * Correct Answer
  * Correct/Incorrect Status

**Status:** Completed & Tested

---

### 3. Mistake History API

**Endpoint**

```
GET /api/quizzes/mistakes/
```

**Functionality**

* Retrieves all incorrectly answered questions across all quizzes.
* Helps users identify recurring weak areas.
* Displays:

  * Question
  * Difficulty
  * User Answer
  * Correct Answer

**Status:** Completed & Tested

---

## Issues Encountered

### Accuracy Field Error

Initially, the Quiz History API attempted to access:

```python
attempt.accuracy
```

However, the `QuizAttempt` model stores accuracy as:

```python
percentage
```

**Resolution**

* Replaced all references to `attempt.accuracy`
* Used `attempt.percentage` instead

---

### URL Routing Error

Initially tested:

```
/api/quizzes/history/<attempt_id>/
```

The correct route was:

```
/api/quizzes/review/<attempt_id>/
```

**Resolution**

* Verified URL configuration
* Updated testing endpoints

---

## APIs Successfully Tested

| API                  | Status |
| -------------------- | ------ |
| Quiz History         | ✅      |
| Quiz Review          | ✅      |
| Mistake History      | ✅      |
| User Stats           | ✅      |
| Dashboard            | ✅      |
| Difficulty Analytics | ✅      |
| Quiz Insights        | ✅      |

---

## Project Progress

### Backend Modules Completed

* Authentication & JWT
* Subjects & Topics
* Question Bank
* Quiz Engine
* Adaptive Question Selection
* Answer Submission
* Quiz Scoring
* Rating System
* Leaderboard
* User Statistics
* Dashboard Analytics
* Difficulty Analytics
* Difficulty Recommendations
* Quiz Insights
* Daily Challenges
* Streak Tracking
* Quiz History
* Quiz Review System
* Mistake Tracking

---

## Estimated Completion

| Component       | Progress |
| --------------- | -------- |
| Backend APIs    | 80%      |
| Core Features   | 90%      |
| Testing         | 75%      |
| Documentation   | 70%      |
| Overall Project | 80%      |

---

## Git Commit

```bash
git add .
git commit -m "Day 14: Added quiz history, review and mistake tracking APIs"
git push origin main
```

---

## Outcome

Day 14 successfully introduced quiz review and mistake analysis capabilities, transforming the platform from a quiz-taking application into a learning-focused system. Users can now review completed quizzes, analyze incorrect answers, and monitor their progress more effectively.
