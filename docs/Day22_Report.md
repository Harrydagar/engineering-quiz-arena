# Quiz Arena - Day 22 Report

## Analytics Service Extraction & Dashboard Refactor

### Date

June 2026

---

# Objectives

Refactor `views.py` by moving analytics and reusable business logic into service functions, reducing duplication and improving maintainability.

---

# Completed Work

## 1. Created Analytics Service Layer

Added reusable service functions:

```python
get_overall_stats(user)
get_subject_performance(user)
get_recent_attempts(user)
get_user_rank(user)
get_achievement_summary(user)
```

Location:

```text
quizzes/services/analytics_service.py
```

---

## 2. Refactored UserStatsView

Before:

* Contained aggregation queries
* Calculated accuracy
* Calculated answer statistics

After:

```python
return Response(
    get_overall_stats(request.user)
)
```

---

## 3. Refactored SubjectPerformanceView

Before:

* Annotate queries inside view
* Accuracy calculation inside view

After:

```python
return Response(
    get_subject_performance(request.user)
)
```

---

## 4. Refactored RecentAttemptsView

Before:

* Query construction
* Formatting logic

After:

```python
return Response(
    get_recent_attempts(request.user)
)
```

---

## 5. Refactored MyRankView

Before:

* Rank calculation duplicated

After:

```python
rank = get_user_rank(request.user)
```

---

## 6. Refactored DashboardView

Extracted:

### Overall Statistics

```python
get_overall_stats()
```

### Subject Performance

```python
get_subject_performance()
```

### Recent Attempts

```python
get_recent_attempts()
```

### User Rank

```python
get_user_rank()
```

### Achievement Summary

```python
get_achievement_summary()
```

---

## 7. Fixed Dashboard Performance Issue

Removed unnecessary repeated query execution:

Before:

```python
for subject in Subject.objects.all():
    subjects = Subject.objects.annotate(...)
```

After:

```python
subjects = Subject.objects.annotate(...)
```

Result:

* Fewer database queries
* Faster dashboard response

---

## 8. Fixed Subject Relationship Errors

Updated annotations to use correct related names:

```python
quiz_attempts__answers
```

instead of:

```python
quizattempt__useranswer
```

Resolved Dashboard FieldError.

---

# Current Architecture

```text
quizzes/
├── views.py
├── services/
│   ├── analytics_service.py
│   ├── achievement_service.py
│   └── quiz_service.py
├── serializers.py
├── models.py
└── urls.py
```

---

# Refactor Outcome

### Before

* Large views
* Duplicate analytics logic
* Dashboard contained most business logic

### After

* Thin views
* Shared analytics services
* Reduced duplication
* Easier testing and maintenance

---

# Project Status

Backend Core Features: ~90% Complete

Completed:

* Authentication
* JWT
* Subjects / Topics
* Quiz Engine
* Scoring
* Rating System
* Leaderboard
* Dashboard
* Analytics
* Daily Challenges
* Streak System
* Mistake Tracking
* Achievement System
* Quiz Review
* Progress Tracking
* Production Deployment

---

# Day 22 Result

Analytics and Dashboard refactor completed successfully.

Codebase is cleaner, more maintainable, and closer to production-grade architecture.
