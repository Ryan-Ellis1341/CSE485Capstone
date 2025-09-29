# Student Guide — FP&A Fullstack v2 (Auth/Roles + QB Stub + Tests)

## Overview
You’re starting with a complete budgeting/forecasting platform that already includes:
- **Auth & Roles**: Admin / Analyst / Viewer (Bearer tokens)
- **Budget Engine**: GDP-driven presets, auto-budget from actuals, scenarios & sensitivities
- **AI**: Forecasts (ARIMA/ML) and variance explanations
- **QuickBooks Import (stub)**: Map QB-like data to the standardized chart of accounts
- **Frontend**: Dashboard, Setup Wizard, Scenarios, QuickBooks importer
- **Tests**: Pytest suite for core endpoints

Your job: **UI polish, rock-solid tests, and creative AI experiments.**

---
## Run the backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:api --reload --port 8000
```
Open docs at http://127.0.0.1:8000/docs

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://127.0.0.1:5173

---
## Login (Auth & Roles)
Use the **Auth bar** at the top of the UI or call the API:
```
POST /auth/login { "username": "student", "role": "Viewer|Analyst|Admin" }
```
This returns a token. The app ships with three demo tokens:
- Admin → `admin-token`
- Analyst → `analyst-token`
- Viewer → `viewer-token`

**Permissions**
- Viewer: read-only (BvA, forecasting)
- Analyst: create presets, clone scenarios, sensitivity, QB import
- Admin: everything Analyst can do

---
## 5-Minute Setup
1) Login as **Analyst** or **Admin**.  
2) Go to **Setup Wizard** and create a **QSR budget** for 2026 (GDP growth optional).  
3) Open **Dashboard** to read the AI narrative and see variance drivers.  
4) Open **Scenarios** → Clone Best/Worst → Apply sensitivity: `Opex:Labor` +8% from `2026-06` to `2026-12`.  
5) Open **QuickBooks** page → paste the sample JSON and import.

---
## QuickBooks Import (stub)
- Endpoint: `POST /qb/import_json` with rows like:
```json
[
  {"Date":"2024-03-15","Account":"Sales - Food","Dept":"Sales","Amount":12345.67,"Currency":"USD"},
  {"Date":"2024-03-15","Account":"Wages","Dept":"Ops","Amount":3456.78,"Currency":"USD"}
]
```
- We map `Account` to standardized accounts (e.g., “Sales - Food” → “Revenue:Food”) and append to **actuals**.

---
## Testing
From `/backend`:
```bash
pytest -q
```
What’s covered:
- Health & login
- Role enforcement on preset creation
- BvA availability for viewers
- Forecast endpoint returns data
- QuickBooks import path

Add more tests:
- FX conversion math
- Scenario sensitivity correctness
- Narrative contains expected drivers

---
## Stretch ideas
- True waterfall & heatmap charts on the frontend
- Headcount module (roster, raises, benefits)
- NetSuite/QuickBooks **real** connectors (OAuth + webhooks)
- Better narratives (seasonality, change-point detection, pricing vs traffic split)
- Chat “budget copilot” that edits scenarios via natural language

Have fun — and aim for **usable, delightful, and trustworthy** FP&A! 🚀
