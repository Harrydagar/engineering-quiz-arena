# Engineering Quiz Arena - Day 3 Report

## Date

01 June 2026

## Objective

Implement a complete authentication system for Engineering Quiz Arena using Django REST Framework, JWT authentication, PostgreSQL, and Postman testing.

---

## Tasks Completed

### 1. JWT Authentication Setup

Installed and configured JWT authentication using Django REST Framework Simple JWT.

#### Package Installed

* djangorestframework-simplejwt

#### Configuration Added

Configured JWT authentication as the default authentication mechanism in `core/settings.py`.

Implemented:

* JWT Access Tokens
* JWT Refresh Tokens
* Protected API Authentication

---

### 2. User Registration API

Created a registration system allowing users to create new accounts through API requests.

#### Files Created

* `accounts/serializers.py`

#### Files Modified

* `accounts/views.py`
* `accounts/urls.py`
* `core/urls.py`

#### Endpoint

```http
POST /api/accounts/register/
```

#### Functionality

* Accepts username, email, and password.
* Validates incoming data.
* Hashes passwords securely using Django's authentication system.
* Stores users in PostgreSQL database.

#### Testing

Successfully created multiple test users.

Duplicate username validation was verified successfully.

---

### 3. JWT Login System

Implemented login functionality using Simple JWT.

#### Endpoint

```http
POST /api/accounts/token/
```

#### Functionality

* Authenticates user credentials.
* Generates JWT Access Token.
* Generates JWT Refresh Token.

#### Testing

Successfully authenticated registered users and received valid JWT tokens.

Invalid login attempts correctly returned authentication errors.

---

### 4. Token Refresh Endpoint

Implemented token refresh functionality.

#### Endpoint

```http
POST /api/accounts/token/refresh/
```

#### Functionality

* Uses Refresh Token to generate a new Access Token.
* Supports session continuity without re-login.

---

### 5. Protected Profile API

Created a protected endpoint accessible only to authenticated users.

#### Endpoint

```http
GET /api/accounts/profile/
```

#### Functionality

Returns authenticated user's information:

* Username
* Email

#### Security

Protected using:

```python
permission_classes = [IsAuthenticated]
```

---

### 6. Postman API Testing

Learned and performed API testing using Postman.

#### Tested Scenarios

##### Registration

* Successful registration
* Duplicate username validation

##### Login

* Successful login
* Invalid credentials

##### Protected Route

* Access without token
* Access with valid token
* Expired token handling

All tests passed successfully.

---

### 7. Admin Panel Verification

Verified user creation through Django Admin.

#### Verified

* Registered users appear in Admin Panel.
* Authentication data stored correctly.
* PostgreSQL integration functioning properly.

---

### 8. System Verification

Verified:

* Django project health
* URL routing
* JWT authentication flow
* PostgreSQL connectivity
* API endpoints
* Git repository status

No critical issues found.

---

## Authentication Flow Implemented

User Registration
↓
User Login
↓
JWT Token Generation
↓
Authenticated Requests
↓
Protected Endpoint Access

---

## Files Created

```text
accounts/
└── serializers.py

accounts/
└── urls.py
```

## Files Modified

```text
accounts/views.py
core/settings.py
core/urls.py
```

---

## Git Operations

### Commit

```bash
git commit -m "Day 3: Implement JWT authentication system"
```

### Push

Successfully pushed to GitHub.

#### Commit Hash

```text
62de1e4
```

---

## Key Concepts Learned

* Django REST Framework Serializers
* APIView and Generic Views
* JWT Authentication
* Access Tokens
* Refresh Tokens
* Authorization Headers
* Protected APIs
* Postman API Testing
* User Authentication Workflow
* Django Authentication System

---

## Outcome

Successfully built and tested a production-style authentication system for Engineering Quiz Arena.

The backend now supports:

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* PostgreSQL User Storage

This completes the authentication foundation required for future quiz, leaderboard, and ranking features.

---

## Next Day Goal (Day 4)

Build the Quiz Management System:

* Subject Model
* Topic Model
* Question Model
* Question Database Structure
* Django Admin Integration
* Quiz CRUD APIs
* PostgreSQL Quiz Storage
