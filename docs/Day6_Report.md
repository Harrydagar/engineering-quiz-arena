# Engineering Quiz Arena - Day 6 Report

**Date:** 02 June 2026

## Objective

Build the foundational quiz engine database structure required to track quiz attempts, user responses, and scoring information.

---

# Work Completed

## 1. QuizAttempt Model Implementation

Created the `QuizAttempt` model to store quiz session information.

### Fields Added

* User
* Subject
* Topic
* Score
* Total Questions
* Started At
* Completed At

### Purpose

The model serves as the primary record for every quiz session attempted by a user.

### Status

✅ Implemented

---

## 2. UserAnswer Model Implementation

Created the `UserAnswer` model to store responses submitted by users during quiz attempts.

### Fields Added

* Quiz Attempt
* Question
* Selected Option
* Is Correct

### Purpose

The model records each answer submitted by a user and enables future score calculation and performance analysis.

### Status

✅ Implemented

---

## 3. Database Relationships

Established relationships between quiz entities.

### Relationship Structure

```text
User
 │
 ├── QuizAttempt
 │      │
 │      ├── Subject
 │      ├── Topic
 │      ├── Score
 │      └── Total Questions
 │
 └── UserAnswer
        │
        ├── Question
        ├── Selected Option
        └── Is Correct
```

### Status

✅ Verified

---

## 4. Database Migration

Generated new migration:

```text
0003_quizattempt_useranswer.py
```

Applied migration successfully.

### Commands Executed

```bash
python manage.py makemigrations quizzes
python manage.py migrate
```

### Result

```text
Applying quizzes.0003_quizattempt_useranswer... OK
```

### Status

✅ Completed

---

## 5. Django Admin Registration

Registered new models in Django Admin.

### Models Registered

* QuizAttempt
* UserAnswer

### Status

✅ Completed

---

## 6. Admin Testing

Performed manual verification through Django Admin.

### Tests Conducted

#### Quiz Attempt Creation

Successfully created a quiz attempt by selecting:

* User
* Subject
* Topic
* Score
* Total Questions

#### User Answer Creation

Successfully linked:

* Quiz Attempt
* Question
* Selected Option
* Correctness Status

### Verification Results

* Foreign key relationships working correctly.
* Records saved successfully.
* Data accessible through Admin interface.

### Status

✅ Passed

---

# Issues Encountered

## 1. Models File Overwritten

During implementation, the original quiz models were accidentally overwritten.

### Impact

* Subject
* Topic
* Question
* Option

models temporarily disappeared.

### Resolution

Restored all existing models and integrated new models into the same file.

---

## 2. Model Order Error

Encountered:

```python
NameError: name 'Subject' is not defined
```

### Cause

QuizAttempt was declared before Subject, Topic, Question, and Option.

### Resolution

Reorganized model definitions and restored proper class order.

---

# Testing Summary

| Feature                   | Status   |
| ------------------------- | -------- |
| QuizAttempt Model         | ✅ Passed |
| UserAnswer Model          | ✅ Passed |
| Migration Creation        | ✅ Passed |
| Migration Application     | ✅ Passed |
| Admin Registration        | ✅ Passed |
| QuizAttempt Creation      | ✅ Passed |
| UserAnswer Creation       | ✅ Passed |
| Relationship Verification | ✅ Passed |

---

# Deliverables Completed

* QuizAttempt Model
* UserAnswer Model
* Database Migrations
* Admin Registration
* Relationship Verification
* Quiz Session Data Structure

---

# Current Project Status

### Completed Modules

* Project Setup
* Authentication System
* User Management
* Subject Management
* Topic Management
* Question Management
* Option Management
* Subject API
* Topic API
* Question API
* QuizAttempt Model
* UserAnswer Model

### Current Capability

```text
User Login
     ↓
Fetch Subjects
     ↓
Fetch Topics
     ↓
Fetch Questions
     ↓
Create Quiz Attempt
     ↓
Store User Answers
```

---

# Next Steps (Day 7)

## Quiz Engine APIs

### Planned Endpoints

#### Start Quiz

```http
POST /api/quizzes/start/
```

Create quiz attempt and return questions.

---

#### Submit Answer

```http
POST /api/quizzes/answer/
```

Store user answer and validate correctness.

---

#### Finish Quiz

```http
POST /api/quizzes/finish/
```

Calculate score and complete attempt.

---

#### Quiz Results

```http
GET /api/quizzes/results/<attempt_id>/
```

Return:

* Score
* Accuracy
* Questions Attempted
* Answer Summary

---

## Expected Outcome

```text
User Starts Quiz
       ↓
Questions Loaded
       ↓
Answers Submitted
       ↓
Score Calculated
       ↓
Results Generated
```

This will transform Engineering Quiz Arena from a content retrieval platform into a fully functional quiz system.
