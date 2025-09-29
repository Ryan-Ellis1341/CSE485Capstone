from fastapi.testclient import TestClient
import app

client = TestClient(app.api)
ADMIN = {"Authorization": "Bearer admin-token"}
ANALYST = {"Authorization": "Bearer analyst-token"}
VIEWER = {"Authorization": "Bearer viewer-token"}

def ensure_base_year(year=2026):
    client.post("/preset/qsr", json={"fiscal_year":year}, headers=ANALYST)

def test_headcount_upsert_and_bake():
    ensure_base_year(2027)
    emp = {
        "emp_id":"E1","name":"Cook A","dept":"Ops","start_month":"2027-02",
        "annual_salary":48000,"fte":1.0,"raise_month":"2027-09","raise_pct":0.05,
        "benefits_pct":0.08,"taxes_pct":0.076,"currency":"USD"
    }
    r = client.post("/headcount/upsert", json=emp, headers=ANALYST)
    assert r.status_code==200
    r = client.post("/headcount/bake_to_budget", json={"fiscal_year":2027, "scenario":"2027:Base", "apply":True}, headers=ANALYST)
    assert r.status_code==200
    assert r.json()["applied_rows"]>0

def test_solver_goal_seek():
    ensure_base_year(2026)
    r = client.post("/solver/goal_seek", json={"scenario":"2026:Base","target_ebitda": 500000, "search_range":0.1}, headers=ANALYST)
    assert r.status_code==200
    js = r.json()
    assert "best_ebitda" in js and "revenue_pct" in js
