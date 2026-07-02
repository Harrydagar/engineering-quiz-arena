# Step 3 — Layout System

## Purpose

This document defines the layout structure used throughout QuizArena. It ensures every page follows consistent spacing, alignment, navigation, and responsive behavior.

---

# Global Layout

## Navbar

Height: **64px**

Rules:

* Fixed at the top
* Full width
* Contains logo, navigation, notifications, theme toggle, and user menu
* Visible on all authenticated pages

---

## Sidebar

Width: **280px**

Rules:

* Persistent on desktop
* Collapsible on tablet
* Replaced with a drawer on mobile

Primary navigation:

* Dashboard
* Subjects
* Quiz History
* Analytics
* Leaderboard
* Achievements
* Profile
* Settings

---

## Content Area

Maximum Width: **1280px**

Reading Width: **768px**

Quiz Width: **900px**

Page Padding:

| Screen  | Padding |
| ------- | ------- |
| Mobile  | 16px    |
| Tablet  | 24px    |
| Desktop | 32px    |

Section Gap:

**64px**

Card Gap:

**24px**

---

# Grid System

## Mobile

* Single-column layout
* Full-width cards
* Drawer navigation

---

## Tablet

* Two-column layout where appropriate
* Collapsible sidebar

---

## Desktop

* 12-column grid
* Persistent sidebar
* Multi-column analytics

---

# Authentication Layout

Pages:

* Login
* Register
* Forgot Password
* Reset Password
* Email Verification

Rules:

* Centered card
* Maximum width: 420px
* Minimal distractions
* Clear call-to-action

---

# Dashboard Layout

Recommended structure:

1. Welcome Section
2. Statistics Grid
3. Analytics Charts
4. Subject Performance
5. Daily Challenge
6. Leaderboard
7. Achievements
8. Recent Activity

Rules:

* Equal card heights where practical
* Consistent spacing
* Responsive grid

---

# Quiz Layout

The quiz interface is the highest-priority screen.

Visual hierarchy:

1. Navbar
2. Progress
3. Question
4. Options
5. Explanation (after submission)
6. Navigation

Rules:

* The question must always be the primary focus.
* Timer and progress should support the experience without competing visually.
* Large click targets for answer options.
* Stable layout between questions.

---

# Results Layout

Sections:

* Score Summary
* Accuracy
* XP Earned
* Rank
* Time Taken
* Performance Breakdown
* Action Buttons

---

# Review Layout

Each review card contains:

* Question
* User Answer
* Correct Answer
* Explanation

Navigation:

* Previous
* Next
* Finish Review

---

# Analytics Layout

Sections:

* Accuracy Trend
* Subject Performance
* Difficulty Breakdown
* Quiz History
* Rating Progress
* Streak

Charts should remain visually consistent and share spacing and sizing.

---

# Leaderboard Layout

Sections:

* Current Rank
* Top Rankings
* User Position
* Filters

Sticky header recommended.

---

# Profile Layout

Sections:

* User Information
* Statistics
* Achievements
* Preferences
* Security Settings

---

# Responsive Rules

## Mobile

* Single-column layouts
* Drawer navigation
* Full-width cards

## Tablet

* Two-column layouts
* Collapsible sidebar

## Desktop

* Persistent sidebar
* 12-column grid
* Wider analytics dashboards
