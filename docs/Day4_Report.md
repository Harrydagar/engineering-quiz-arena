# Engineering Quiz Arena – Day 4 Report

## Objective

Build the core quiz database structure that will serve as the foundation for quiz management, question storage, and future quiz APIs.

## Work Completed

### 1. Quiz Application Setup

* Created a new Django app named `quizzes`.
* Added the app to `INSTALLED_APPS`.
* Verified successful integration using Django system checks.

### 2. Database Model Design

Implemented the following models:

#### Subject

Stores engineering subjects.

Fields:

* name
* description

Examples:

* Mathematics
* Physics

#### Topic

Stores topics within subjects.

Fields:

* subject (ForeignKey)
* name
* description

Examples:

* Algebra
* Calculus
* Mechanics

#### Question

Stores quiz questions.

Fields:

* topic (ForeignKey)
* question_text
* difficulty
* explanation

Difficulty Levels:

* Easy
* Medium
* Hard

#### Option

Stores answer choices for questions.

Fields:

* question (ForeignKey)
* option_text
* is_correct

### 3. Model Relationships

Implemented the hierarchy:

Subject
└── Topic
└── Question
└── Option

This structure allows organized storage of engineering subjects, topics, questions, and answers.

### 4. Django Admin Integration

Registered all quiz models in Django Admin:

* Subject
* Topic
* Question
* Option

Verified successful visibility and functionality through the admin panel.

### 5. Database Migrations

Generated and applied migrations:

* Created initial migration for quizzes app.
* Successfully migrated database schema.
* Verified migration status.

### 6. Sample Data Creation

Created sample records for testing.

Subjects:

* Mathematics
* Physics

Topics:

* Algebra
* Calculus
* Mechanics

Questions:

1. What is 2 + 2?
2. What is x if x + 5 = 10?
3. What is the derivative of x²?
4. What is the SI unit of force?
5. Which law states F = ma?

Options:

* Four answer choices per question.
* Correct answer marked using `is_correct=True`.

### 7. Testing and Verification

Verified:

* Django system checks passed.
* Models created successfully.
* Migrations executed successfully.
* Admin panel functioning correctly.
* Foreign key relationships working correctly.
* Question-to-option linkage verified.
* Sample data accessible through ORM queries.

Final Database Counts:

* Subjects: 2
* Topics: 3
* Questions: 5
* Options: 20

## Git Commit

Suggested Commit Message:

Day 4: Quiz models and question structure implemented

## Outcome

Day 4 successfully established the complete quiz data layer for Engineering Quiz Arena. The project now has a scalable structure capable of supporting quiz APIs, adaptive question delivery, difficulty-based filtering, leaderboard systems, and future quiz attempt tracking.

## Next Day Focus

Day 5: Quiz APIs

Planned tasks:

* Create serializers
* Build Subject API
* Build Topic API
* Build Question API
* Configure URLs
* Test endpoints using Postman
* Prepare API structure for frontend integration
