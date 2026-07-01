# Quiz Arena

Quiz Arena is a production-ready engineering quiz platform built with Django REST Framework and PostgreSQL. It helps students test their knowledge through adaptive quizzes, track performance analytics, compete on leaderboards, complete daily challenges, and unlock achievements.

## Features

### Authentication

* JWT Authentication
* User Registration & Login
* Protected API Endpoints

### Quiz Engine

* Subject-wise Quizzes
* Topic-based Questions
* Multiple Difficulty Levels
* Random Question Selection
* Automatic Scoring System

### Analytics

* Overall Performance Statistics
* Subject-wise Analysis
* Difficulty-wise Performance
* Recent Quiz Attempts
* Personalized Insights
* Performance Recommendations

### Leaderboards & Ratings

* Global Leaderboard
* User Ranking System
* Rating-based Competition

### Quiz History

* Complete Attempt History
* Quiz Review System
* Mistake Tracking
* Progress Analysis

### Daily Challenges

* Daily Question Challenges
* Completion Tracking
* Challenge Statistics

### Achievements

* Quiz Completion Achievements
* Streak Achievements
* Daily Challenge Achievements
* Rating Milestone Achievements

### API Documentation

* Swagger UI
* ReDoc Documentation

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework

### Database

* PostgreSQL

### Authentication

* JWT (SimpleJWT)

### Documentation

* drf-spectacular
* Swagger UI
* ReDoc

### Deployment

* Render

---

## Project Architecture

backend/
├── accounts/
├── quizzes/
│ ├── services/
│ │ ├── analytics_service.py
│ │ ├── history_service.py
│ │ ├── achievement_service.py
│ │ ├── quiz_service.py
│ │ └── daily_challenge_service.py
│ ├── models.py
│ ├── serializers.py
│ ├── views.py
│ └── urls.py
├── config/
└── manage.py

---

## Available APIs

### Authentication

* Register User
* Login User
* Refresh Token

### Quiz APIs

* Subjects
* Topics
* Start Quiz
* Submit Quiz
* Quiz Results

### Analytics APIs

* Overall Statistics
* Subject Performance
* Difficulty Statistics
* User Rank
* Insights

### History APIs

* Quiz History
* Quiz Review
* Mistake History
* Progress Analysis

### Daily Challenge APIs

* Get Daily Challenge
* Submit Daily Challenge

### Achievement APIs

* Achievement List
* Achievement Summary

### Leaderboard APIs

* Global Leaderboard

---

## Testing

Current Status:

* 30 Automated Tests Passing
* Service Layer Tested
* API Endpoints Tested
* Analytics Tested
* Quiz Engine Tested

---

## Deployment

Backend is deployed and running in production using Render with PostgreSQL.

---

## Current Status

### Completed

* Authentication
* Quiz Engine
* Analytics
* Quiz History
* Daily Challenges
* Achievements
* Leaderboard
* Rating System
* API Documentation
* PostgreSQL Deployment
* Automated Testing

### In Progress

* React Frontend

### Planned

* Achievement Badges UI
* Advanced ELO Rating
* Security Hardening
* Admin Analytics Dashboard

---

## Future Frontend Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Recharts

---

Built as an engineering-focused competitive learning platform for students.
