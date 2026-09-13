# Student Finance Tracker

## Features
- Add/edit/delete transactions with regex-validated form
- Live regex search across description/category with highlighting
- Sort by date, description, amount
- Dashboard: totals, top category, 7-day trend, spending cap alerts
- localStorage persistence + JSON import/export
- Manual currency conversion (USD → EUR/GBP)

## Regex Catalog
| Rule | Pattern | Example match |
|---|---|---|
| Description | `^\S(?:.*\S)?$` | "Lunch" valid, " Lunch" invalid |
| Amount | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | "12.50" valid, "12.5.0" invalid |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | "2025-09-25" |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | "Food", "Self-Care" |
| Advanced (back-reference) | `\b(\w+)\s+\1\b` | flags "the the cafeteria" |
| Search example | `(coffee\|tea)` | matches Food entries |

## Keyboard Map
- Tab / Shift+Tab: move between fields, buttons, links
- Enter: submit form / activate focused button
- Skip link (first Tab press): jump to main content

## Accessibility Notes
- Semantic landmarks: header, nav, main, section, footer
- All inputs have bound `<label>`s
- Errors and stats use `role="status"`/`aria-live` (assertive when over cap)
- Visible focus outline on all interactive elements
- Table converts to labeled cards under 480px

## Run locally
Open [index.html](./index.html) in a browser (or use the VS Code Live Server extension).

## Run tests
Open [tests.html](./tests.html) in a browser; results print to the page.

Live demo: https://kmaster-alt.github.io/finance-tracker/


Demo video: []