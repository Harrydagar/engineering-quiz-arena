# Day 10 Report – Engineering Quiz Arena

## Date

04 June 2026

## Objective

Implement analytics and dashboard functionality to provide users with detailed insights into their quiz performance, rankings, and history.

---

## Features Implemented

### 1. Subject Performance Analytics API

**Endpoint**

```
GET /api/quizzes/analytics/subjects/
```

**Features**

* Displays performance for each subject.
* Calculates:

  * Questions attempted
  * Correct answers
  * Accuracy percentage
* Handles subjects with no attempts gracefully.

**Example Response**

```json
[
    {
        "subject": "Mathematics",
        "attempted": 3,
        "correct": 3,
        "accuracy": 100.0
    }
]
```

---

### 2. Recent Quiz History API

**Endpoint**

```
GET /api/quizzes/analytics/history/
```

**Features**

* Returns recently completed quizzes.
* Includes:

  * Quiz ID
  * Subject
  * Score
  * Percentage
  * Completion timestamp

**Example Response**

```json
[
    {
        "quiz_id": 19,
        "subject": "Mathematics",
        "score": 20,
        "total_questions": 3,
        "percentage": 100.0
    }
]
```

---

### 3. Rank System Improvement

**Endpoint**

```
GET /api/quizzes/my-rank/
```

**Enhancements**

* Fixed ranking calculation.
* Rank is now based on total accumulated points.
* Eliminated duplicate user ranking issue caused by multiple quiz attempts.
* Consistent with leaderboard logic.

---

### 4. Dashboard API

**Endpoint**

```
GET /api/quizzes/dashboard/
```

**Features**

* Aggregates all user analytics into a single response.
* Returns:

  * User rank
  * Overall statistics
  * Subject-wise statistics
  * Recent quiz attempts

**Example Response**

```json
{
    "rank": 1,
    "overall_stats": {},
    "subject_stats": [],
    "recent_attempts": []
}
```

---

## Testing Performed

### Subject Analytics API

Status: PASSED

Verified:

* Correct subject mapping
* Attempt count
* Correct answer count
* Accuracy calculation

### Recent History API

Status: PASSED

Verified:

* Latest attempts retrieval
* Correct subject and score data
* Timestamp generation

### My Rank API

Status: PASSED

Verified:

* Correct user ranking
* Ranking based on total score aggregation

### Dashboard API

Status: PASSED

Verified:

* Combined analytics response
* Accurate aggregation of all modules

### Authentication Protection

Status: PASSED

Verified:

* Protected endpoints require JWT authentication
* Unauthorized requests are rejected

---

## Files Modified

### quizzes/views.py

Added:

* SubjectPerformanceView
* RecentAttemptsView
* DashboardView

Updated:

* MyRankView ranking logic

### quizzes/urls.py

Added routes:

* analytics/subjects/
* analytics/history/
* dashboard/

---

## APIs Added

| Method | Endpoint                         |
| ------ | -------------------------------- |
| GET    | /api/quizzes/analytics/subjects/ |
| GET    | /api/quizzes/analytics/history/  |
| GET    | /api/quizzes/dashboard/          |

---

## Issues Encountered

### Duplicate Import

Issue:

* MyRankView imported twice in urls.py

Resolution:

* Removed duplicate import.

### Ranking Logic

Issue:

* Ranking based on quiz attempts instead of users.

Resolution:

* Aggregated scores using total points per user.

---

## Outcome

Successfully completed the Analytics and Dashboard module.

The backend now supports:

* User Authentication
* Subject & Topic Management
* Quiz Attempts
* Answer Submission
* Scoring Engine
* Leaderboard System
* User Rankings
* Performance Analytics
* Quiz History
* Unified Dashboard API

---

## Project Status After Day 10

### Completed Modules

* Authentication System
* Quiz Engine
* Scoring System
* Statistics API
* Leaderboard
* Rank Tracking
* Analytics APIs
* Dashboard API

### Estimated MVP Progress

Backend Completion: ~70%

---

## Commit Hash

```
2123477
```

**Commit Message**

```
Day 10: Analytics and dashboard APIs
```
