# Step 4 — Interaction Patterns

## Purpose

This document defines common interaction patterns used throughout QuizArena to ensure a consistent user experience.

---

# Quiz Flow

```text
Subject
    ↓
Start Quiz
    ↓
Question
    ↓
Answer
    ↓
Next Question
    ↓
Results
    ↓
Review
```

Rules:

* Show progress continuously.
* Prevent accidental submission.
* Disable answer changes after submission when required.
* Clearly distinguish correct and incorrect answers during review.

---

# Authentication Flow

```text
Register
    ↓
Verify Email
    ↓
Login
    ↓
Dashboard
```

---

# Loading States

Use loading indicators whenever content is being fetched.

Components:

* Spinner
* Skeleton
* Progress Bar
* Button Loading

Avoid layout shifts during loading.

---

# Empty States

Provide meaningful empty states for:

* No Quiz History
* No Achievements
* No Notifications
* No Subjects
* No Analytics Data
* No Daily Challenge

Each empty state should include:

* Title
* Description
* Primary Action (when applicable)

---

# Error States

Standardize:

* Validation Error
* Network Error
* Server Error
* Unauthorized
* Forbidden
* Not Found

Errors should explain the problem and suggest the next action where possible.

---

# Notifications

Toast variants:

* Success
* Error
* Warning
* Info

Rules:

* Top-right placement
* Auto-dismiss after approximately 3 seconds
* User-dismissible

---

# Forms

All forms should follow the same structure:

1. Label
2. Input
3. Helper Text
4. Error Message

Rules:

* Never rely on placeholders as labels.
* Validate inputs clearly.
* Preserve user input after validation failures where appropriate.

---

# Motion

Motion should communicate state changes rather than decorate the interface.

Durations:

* Hover: 150ms
* Press: 100ms
* Cards: 200ms
* Dialogs: 200ms
* Toasts: 250ms
* Page Transitions: 250ms

Use `ease-out` for standard interactions.

Respect `prefers-reduced-motion`.

---

# Accessibility

Requirements:

* WCAG 2.2 AA contrast
* Visible keyboard focus
* Minimum touch target: 44×44px
* Semantic HTML
* Keyboard navigation
* Focus trapping in dialogs
* Escape key closes overlays
* Do not rely on color alone to communicate meaning

---

# Responsive Behavior

## Mobile

* Single-column layouts
* Drawer navigation
* Large touch targets

## Tablet

* Two-column layouts
* Collapsible sidebar

## Desktop

* Persistent sidebar
* Multi-column dashboards

---

# Reusability Principles

* Reuse existing components before creating new ones.
* Use design tokens for all styling decisions.
* Maintain consistent spacing and typography.
* Avoid one-off component variants.
* Prefer composition over duplication.

---

# UX Principles

* The question is always the primary focus.
* Keep interfaces clean and predictable.
* Prioritize readability over decoration.
* Use semantic colors consistently.
* Motion should reinforce interactions.
* Maintain consistency across every screen.
