# Step 1 — Design Tokens

## Color Tokens

### Neutral

| Token      | Light   | Dark    |
| ---------- | ------- | ------- |
| Background | #FFFFFF | #09090B |
| Surface    | #FAFAFA | #18181B |
| Elevated   | #FFFFFF | #27272A |
| Border     | #E4E4E7 | #3F3F46 |
| Muted      | #71717A | #A1A1AA |

### Brand

| Token              | Value   |
| ------------------ | ------- |
| Primary            | #4F46E5 |
| Primary Hover      | #4338CA |
| Primary Active     | #3730A3 |
| Primary Foreground | #FFFFFF |

### Semantic

| Token   | Value   |
| ------- | ------- |
| Success | #22C55E |
| Warning | #F59E0B |
| Error   | #EF4444 |
| Info    | #3B82F6 |

### Quiz

| Token       | Value   |
| ----------- | ------- |
| Correct     | #16A34A |
| Wrong       | #DC2626 |
| Skipped     | #D97706 |
| XP          | #EAB308 |
| Achievement | #7C3AED |

---

## Typography

### Font Family

Geist

Fallback:

Geist, Inter, system-ui, sans-serif

### Font Weights

* 400
* 500
* 600
* 700

### Font Scale

| Token   | Size |
| ------- | ---- |
| Display | 56px |
| H1      | 40px |
| H2      | 32px |
| H3      | 28px |
| H4      | 24px |
| H5      | 20px |
| H6      | 18px |
| Body    | 16px |
| Small   | 14px |
| Caption | 12px |

---

## Radius

4 • 6 • 8 • 12 • 16 • 24 • 9999

Usage:

* Buttons → 8px
* Inputs → 8px
* Cards → 12px
* Dialogs → 16px
* Badges → Full

---

## Spacing

4 • 8 • 12 • 16 • 24 • 32 • 40 • 48 • 64 • 80 • 96 • 128

Never invent new spacing values unless absolutely necessary.

---

## Shadows

Scale:

* xs
* sm
* md
* lg
* xl

Usage:

* Card → xs
* Dropdown → md
* Dialog → lg
* Modal → xl

Use borders before shadows.

---

## Motion

Duration:

* Fast → 150ms
* Medium → 200ms
* Slow → 300ms

Easing:

* ease-out

---

## Containers

| Container | Width  |
| --------- | ------ |
| Reading   | 768px  |
| Quiz      | 900px  |
| Dashboard | 1280px |
| Full      | 1440px |

---

## Breakpoints

* sm → 640px
* md → 768px
* lg → 1024px
* xl → 1280px
* 2xl → 1536px

---

## Z-Index

| Element  | Value |
| -------- | ----: |
| Header   |    40 |
| Dropdown |    50 |
| Popover  |    60 |
| Dialog   |    70 |
| Toast    |    80 |

---

## Component Sizes

### Button

* xs → 32px
* sm → 36px
* md → 40px
* lg → 44px
* xl → 48px

### Input

40px

### Navbar

64px

### Sidebar

280px

### Card Padding

* Small → 16px
* Default → 24px
* Large → 32px
