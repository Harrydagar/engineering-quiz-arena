# Quiz Arena

Quiz Arena is an adaptive quiz platform built with Django REST Framework that allows users to take quizzes, track performance, compete on leaderboards, and receive personalized difficulty recommendations based on their quiz history.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected API Endpoints

### Quiz System

* Start Quiz Sessions
* Attempt Questions
* Submit Answers
* Automatic Score Calculation
* Quiz Completion Tracking

### Performance Analytics

* Dashboard Statistics
* Total Quizzes Attempted
* Average Score
* Best Score
* Recent Quiz Attempts

### Leaderboard System

* Global Rankings
* User Rank Tracking
* Score-Based Ordering

### Adaptive Learning

* Difficulty Recommendation Engine
* Performance-Based Suggestions

### API Documentation

* Swagger UI
* ReDoc Documentation

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework

### Authentication

* JWT (Simple JWT)

### Database

* SQLite

### API Documentation

* drf-spectacular
* Swagger UI
* ReDoc

---

## Project Structure

```text
QuizArena/
│
├── accounts/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── quiz/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── QuizArena/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── db.sqlite3
├── manage.py
├── requirements.txt
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd QuizArena
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / Mac

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Run Development Server

```bash
python manage.py runserver
```

---

## API Documentation

After starting the server:

### Swagger UI

```text
http://127.0.0.1:8000/swagger/
```

### ReDoc

```text
http://127.0.0.1:8000/redoc/
```

---

## Main API Endpoints

### Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/api/register/` | Register User |
| POST   | `/api/tokens/`    | User Login    |

### Quiz

| Method | Endpoint                   | Description   |
| ------ | -------------------------- | ------------- |
| POST   | `/api/quizzes/start/`         | Start Quiz    |
| POST   | `/api/quizzes/submit-answer/` | Submit Answer |
| GET    | `/api/quizzes/results/<id>/`  | View Results  |

### Analytics

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/api/quizzes/dashboard/`      | User Dashboard            |
| GET    | `/api/quizzes/leaderboard/`    | Global Leaderboard        |
| GET    | `/api/quizzes/my-rank/`        | User Rank                 |
| GET    | `/api/quizzes/recommendation/` | Difficulty Recommendation |

---

## Example Workflow

1. Register a new account.
2. Login and obtain JWT token.
3. Start a quiz session.
4. Submit answers.
5. Complete the quiz.
6. View quiz results.
7. Check leaderboard ranking.
8. View dashboard statistics.
9. Receive difficulty recommendations.

---

## Security

Current implementation includes:

* JWT Authentication
* Protected API Access
* User-Based Data Access

Planned improvements:

* Environment Variables for Secrets
* Rate Limiting
* HTTPS Enforcement
* Production Security Settings
* Permission Auditing
* Server-Side Validation Enhancements

---

## Future Enhancements

* ELO Rating System
* Daily Challenges
* Subject-Wise Quizzes
* Adaptive Difficulty Progression
* Leaderboard Rewards
* Advanced Analytics
* PostgreSQL Support
* Public Deployment

---

## Development Status

### Current Status

MVP Complete

### Implemented

* Authentication System
* Quiz Engine
* Dashboard Analytics
* Leaderboards
* Difficulty Recommendations
* API Documentation

### Upcoming

* Deployment
* Security Hardening
* Performance Optimization

---

## Author

Developed as a learning project using Django REST Framework.
