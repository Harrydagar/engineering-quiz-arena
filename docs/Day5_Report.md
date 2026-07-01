# Engineering Quiz Arena - Day 5 Report

**Date:** 02 June 2026

## Objective

Implement the first set of quiz content retrieval APIs, allowing authenticated users to fetch subjects, topics, and questions from the database.

---

# Work Completed

## 1. Serializer Implementation

Created serializers inside the `quizzes` application:

* `SubjectSerializer`
* `TopicSerializer`
* `OptionSerializer`
* `QuestionSerializer`

### Features

* Nested option serialization implemented.
* Question responses include available options.
* Correct-answer information (`is_correct`) is hidden from users for security and fair gameplay.

---

## 2. Subject Retrieval API

### Endpoint

```http
GET /api/quizzes/subjects/
```

### Functionality

* Returns all available subjects.
* Accessible only to authenticated users.

### Sample Response

```json
[
    {
        "id": 1,
        "name": "Mathematics"
    },
    {
        "id": 2,
        "name": "Physics"
    }
]
```

### Status

✅ Implemented and Tested

---

## 3. Topics by Subject API

### Endpoint

```http
GET /api/quizzes/topics/<subject_id>/
```

### Functionality

* Returns all topics associated with a selected subject.
* Supports dynamic filtering using subject IDs.
* Protected using JWT authentication.

### Status

✅ Implemented and Tested

---

## 4. Questions by Topic API

### Endpoint

```http
GET /api/quizzes/questions/<topic_id>/
```

### Functionality

* Returns questions belonging to a selected topic.
* Includes nested option data.
* Hides correct-answer information.

### Sample Response Structure

```json
[
    {
        "id": 1,
        "question_text": "Sample Question",
        "difficulty": "easy",
        "options": [
            {
                "id": 1,
                "option_text": "Option A"
            },
            {
                "id": 2,
                "option_text": "Option B"
            }
        ]
    }
]
```

### Status

✅ Implemented and Tested

---

## 5. JWT Authentication Verification

Verified complete authentication flow:

### Token Generation

```http
POST /api/accounts/token/
```

### Protected Endpoint Access

```http
Authorization: Bearer <access_token>
```

### Verification Results

* Access token generation successful.
* Protected APIs accessible only after authentication.
* Unauthorized requests correctly return HTTP 401 responses.

### Status

✅ Verified

---

## 6. URL Routing Configuration

Configured API routes:

```http
/api/quizzes/subjects/
/api/quizzes/topics/<subject_id>/
/api/quizzes/questions/<topic_id>/
```

### Status

✅ Verified

---

# Issues Encountered

## 1. Temporary Questions App Misconfiguration

Initially attempted to create a separate `questions` application.

### Resolution

Integrated all quiz-related functionality into the existing `quizzes` application.

---

## 2. Missing Serializer Import

Encountered:

```python
NameError: name 'QuestionSerializer' is not defined
```

### Resolution

Imported `QuestionSerializer` in `quizzes/views.py`.

---

## 3. Incorrect Endpoint Usage During Testing

Several API requests were made using incorrect URLs.

### Resolution

Verified URL patterns and retested using correct routes.

---

# Testing Summary

| Feature            | Status   |
| ------------------ | -------- |
| Subject API        | ✅ Passed |
| Topic API          | ✅ Passed |
| Question API       | ✅ Passed |
| JWT Authentication | ✅ Passed |
| Nested Options     | ✅ Passed |
| Answer Hiding      | ✅ Passed |
| URL Routing        | ✅ Passed |

---

# Current System Flow

```text
User Login
     ↓
Fetch Subjects
     ↓
Fetch Topics
     ↓
Fetch Questions
     ↓
Display Quiz Content
```

---

# Day 5 Deliverables

* Subject Retrieval API
* Topic Retrieval API
* Question Retrieval API
* Nested Option Serialization
* JWT-Protected Endpoints
* Postman Testing
* Secure Answer Hiding

---

# Next Steps (Day 6)

## Quiz Engine Foundation

### Planned Models

#### QuizAttempt

Track:

* User
* Subject
* Topic
* Score
* Total Questions
* Start Time
* End Time

#### UserAnswer

Track:

* Quiz Attempt
* Question
* Selected Option
* Correct / Incorrect Status

### Planned Tasks

1. Create QuizAttempt model.
2. Create UserAnswer model.
3. Generate migrations.
4. Register models in Django Admin.
5. Verify database relationships.
6. Test model creation and storage.

### Expected Outcome

```text
User
  ↓
Quiz Attempt
  ↓
Answers
  ↓
Score Tracking
```

This will establish the foundation for scoring, quiz submissions, analytics, adaptive difficulty, and leaderboard functionality.
