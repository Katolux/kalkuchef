# KalkuChef V2 — Database Architecture Plan

## Goal

Transform KalkuChef from a frontend-only calculator into a small full-stack application with persistent storage, relational data modeling, and real-world gastronomic logic.

This version focuses on:

* backend architecture
* relational database design
* structured business data
* extensibility toward ERP-style systems

---

## Technology Stack

Frontend:

* HTML / CSS / JavaScript (existing)

Backend:

* Python (Flask)

Database:

* SQLite

---

## Core Concept

Instead of calculating values only in memory or localStorage, the system will store:

* recipes
* ingredients
* quantities
* pricing logic

in a structured relational database.

---

## Database Design

### recipes

Stores general recipe information.

* id (PRIMARY KEY)
* name
* portions
* food_cost_percent
* factor
* created_at

---

### ingredients

Reusable ingredient definitions.

* id (PRIMARY KEY)
* name
* unit_price
* price_basis (kg / L)

---

### recipe_ingredients

Links recipes and ingredients.

* id (PRIMARY KEY)
* recipe_id (FOREIGN KEY → recipes.id)
* ingredient_id (FOREIGN KEY → ingredients.id)
* quantity
* quantity_unit

---

## Relationships

* One recipe has many ingredients
* One ingredient can belong to many recipes

This is implemented through the `recipe_ingredients` table.

---

## Backend Endpoints (Planned)

GET /recipes
→ list all recipes

GET /recipes/<id>
→ get full recipe with ingredients

POST /recipes
→ create new recipe

DELETE /recipes/<id>
→ delete recipe

---

## Version Scope (v2.0)

Included:

* Flask backend
* SQLite database
* Save recipes to database
* Load recipes from database
* Ingredient linking via foreign keys

Not included:

* allergens (v2.1)
* export (v2.2)
* authentication
* cloud deployment

---

## Future Extensions

### v2.1 — Allergen Management

Add tables:

* allergens
* ingredient_allergens

Allow:

* tagging ingredients with allergens
* calculating allergen presence per recipe

---

### v2.2 — Data Export

* JSON export (API-ready)
* CSV export (reporting)

---

## Learning Focus

* relational database design
* foreign keys and data integrity
* backend API structure
* separation of frontend and backend
* real-world business logic

---

## Reasoning

This architecture reflects how larger ERP systems structure data:

* normalized tables
* clear relationships
* reusable entities
* structured business logic

The goal is not complexity, but correctness and scalability.
