# Step 2 — Component Specifications

## Forms

### Button

Variants:

* Primary
* Secondary
* Outline
* Ghost
* Link
* Destructive

Rules:

* Radius: 8px
* Icon Gap: 8px
* Loading Spinner
* Disabled Opacity: 50%

Sizes:

* xs (32px)
* sm (36px)
* md (40px)
* lg (44px)
* xl (48px)

---

### Input

* Height: 40px
* Radius: 8px
* Label always visible
* Helper text below
* Error below helper
* Focus ring uses Primary color

---

### Textarea

* Minimum height: 120px
* Vertical resize only

---

### Select

* Same height as Input
* Right-aligned chevron
* Searchable when more than 10 options exist

---

### Checkbox

* Size: 20×20px
* Label gap: 8px

---

### Radio

* Size: 20×20px
* Single selection

---

### Switch

* Size: 40×24px
* 200ms transition

---

## Display Components

### Card

Variants:

* Default
* Interactive
* Analytics
* Quiz
* Achievement

Rules:

* Padding: 24px
* Radius: 12px
* Border
* Minimal shadow
* Hover lift: 2px

---

### Badge

Variants:

* Success
* Warning
* Error
* Info
* XP
* New

Height: 24px

---

### Alert

Variants:

* Info
* Success
* Warning
* Error

---

### Avatar

Sizes:

32px • 40px • 48px • 64px

---

### Progress

* Height: 8px
* Rounded
* Animated fill

---

### Tabs

* Underline active tab
* Equal spacing
* Keyboard accessible

---

### Dialog

* Radius: 16px
* Max width: 600px
* Close on Escape
* Focus trapped

---

### Drawer

* Mobile only
* Width: 280px
* Slides from screen edge

---

### Tooltip

* Max width: 240px
* 200ms fade

---

### Dropdown

* Minimum width: 220px
* Radius: 12px
* Keyboard accessible

---

### Table

* Sticky header
* Hover rows
* Optional zebra rows
* Pagination

---

## Quiz Components

* Question Card
* Option Card
* Quiz Progress
* Timer
* Result Card
* Review Card

---

## Dashboard Components

* Stat Card
* Analytics Card
* Subject Performance
* Accuracy Chart
* Streak Card
* Achievement Card
* Leaderboard
* Recent Activity
* Daily Challenge

---

## Layout Rules

* Navbar: 64px
* Sidebar: 280px
* Max Content Width: 1280px
* Reading Width: 768px
* Quiz Width: 900px

---

## Motion

* Hover: 150ms
* Press: 100ms
* Modal: 200ms
* Toast: 250ms
* Page: 250ms

---

## Icons

Library: Lucide

Sizes:

* 16px
* 20px
* 24px

Stroke Width:

* 2px

---

## Global Component Rules

* Use semantic design tokens only.
* Use the 8-point spacing system.
* Prefer borders over shadows.
* Limit accent colors to two per screen (excluding semantic states).
* Keep motion subtle and purposeful.
* Maintain a single source of truth for styles.
* Prioritize readability on quiz and review screens.
* Reuse components rather than creating near-duplicates.
