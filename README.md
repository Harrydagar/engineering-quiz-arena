# Engineering Quiz Arena

A gamified quiz platform built with Django REST Framework that helps engineering students practice subjects, track performance, and improve through analytics-driven learning.

## Features

### Authentication

* JWT Authentication
* User Registration
* User Login
* Profile Management

### Quiz Engine

* Subject-wise Quizzes
* Adaptive Question Distribution
* Score Calculation
* Percentage Tracking

### Analytics

* Dashboard Analytics
* Subject Performance Analysis
* Difficulty Analysis
* Progress Tracking
* Performance Summary

### Learning System

* Quiz History
* Quiz Review
* Mistake Tracking
* Performance Insights

### Gamification

* Leaderboard
* Rating System
* Daily Challenges
* Streak Tracking

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SQLite
* JWT Authentication
* Swagger / ReDoc

### Tools

* Postman
* Git
* GitHub

## Project Structure

```text
backend/
frontend/
docs/
README.md
```

## API Documentation

Swagger:

```text
http://127.0.0.1:8000/swagger/
```

ReDoc:

```text
http://127.0.0.1:8000/redoc/
```

## Installation

```bash
git clone <repository-url>

cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

## Current Status

* Backend Completion: ~90%
* APIs Implemented: 25+
* Automated Tests Added
* Swagger Documentation Added
* Frontend Development: Upcoming

## Future Improvements

* React Frontend
* Charts & Visual Analytics
* Deployment
* Docker Support
* Advanced Recommendation System
