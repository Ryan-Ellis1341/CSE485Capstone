# Student Guide — FP&A Fullstack v3 (Headcount + Goal Seek)

## What’s new
- **Headcount/Roster → Payroll**: Add hires with start dates, FTE, raises, taxes/benefits. Bake to budget to generate monthly Labor/Taxes/Benefits lines.
- **Goal Seek Solver**: Choose a scenario, set **target EBITDA**, and let the solver suggest the % changes to Revenue / COGS / Labor that hit closest to target (optionally `apply` to the scenario).

## Run
Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:api --reload --port 8000
```
Frontend
```bash
cd frontend
npm install
npm run dev
```

## Quick start
1) Login as **Analyst** in the Auth bar.
2) Wizard → Create `2027:Base` (or any year).
3) Headcount → Upsert one or two employees (e.g., Ops hire in June with a September raise).
4) Click **Bake to Budget** → payroll rows are merged into the scenario.
5) Dashboard → see narrative/variance.
6) Solver → target EBITDA (e.g., 500,000) → **Suggest Levers** or **Apply**.

## Key APIs
- Headcount
  - `GET /headcount/list`
  - `POST /headcount/upsert` (Admin/Analyst)
  - `POST /headcount/bake_to_budget` (Admin/Analyst)
- Solver
  - `POST /solver/goal_seek` (Admin/Analyst) → returns suggested `revenue_pct`, `cogs_pct`, `labor_pct`

## Tests
Run `pytest` from `/backend`:
- `test_v3.py` covers headcount upsert/bake and solver basics.

## Stretch ideas
- Roster builder UI with roles/positions and vacancy planning
- Per-hour vs salaried payroll models; overtime rules
- Multi-entity consolidation; intercompany eliminations
- Non-linear solver with constraints (e.g., SciPy) for more precise goal seeking
- Narrative that references headcount changes (“Labor variance +$12k from 2 hires in June with 5% raises in Sep”).

Have fun — this version is purpose-built so teams can focus on **UI polish**, **testing**, and **creative AI** 🚀
