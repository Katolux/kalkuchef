# KalkuChef Roadmap

## v1.0 — Initial Version

Status: Completed

Features:
- Add and remove ingredient rows
- Unit conversion for g/kg and ml/dl/L
- Recipe cost calculation
- Cost per portion calculation
- Selling price based on target food cost percentage
- Selling price based on factor
- VAT option
- Rounding options
- Reset button
- Responsive layout

## v1.1 — Save and Load Recipes

Status: Planned

Goal:
Allow users to save recipes locally in the browser and load them again later.

Planned features:
- Save current recipe to localStorage
- Load saved recipe
- Delete saved recipe
- Display saved recipe list
- Keep the app frontend-only with no backend or database

Learning focus:
- JavaScript objects
- Arrays
- localStorage
- JSON stringify / parse
- UI state management

## v1.2 — Pricing Scenarios

Status: Planned

Goal:
Help compare different pricing strategies.

Planned features:
- Pricing presets:
  - Simple dish
  - Standard dish
  - Labor-heavy dish
  - Premium/high-margin dish
- Show equivalent factor for each food cost %
- Compare net and gross selling prices

Learning focus:
- Business logic
- Data presentation
- Dynamic rendering

## v1.3 — Mobile Layout Improvement

Status: Planned

Goal:
Improve mobile usability.

Planned features:
- Ingredient cards on mobile
- Desktop table preserved
- Better touch-friendly input layout

Learning focus:
- Responsive CSS
- Mobile-first design
- UX improvement

## v1.4 — Recipe Text Import

Status: Future idea

Goal:
Allow users to paste recipe ingredient text and convert it into ingredient rows.

Example:
300 g onion
1.5 kg beef
750 ml stock

Learning focus:
- String parsing
- Input validation
- Data cleaning