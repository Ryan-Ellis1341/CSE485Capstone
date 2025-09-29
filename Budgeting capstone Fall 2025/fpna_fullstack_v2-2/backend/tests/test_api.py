import json
from fastapi.testclient import TestClient
import app

client = TestClient(app.api)
ADMIN = {"Authorization": "Bearer admin-token"}
ANALYST = {"Authorization": "Bearer analyst-token"}
VIEWER = {"Authorization": "Bearer viewer-token"}

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("ok") is True

def test_login():
    r = client.post("/auth/login", json={"username":"x","role":"Analyst"})
    assert r.status_code == 200
    assert "token" in r.json()

def test_preset_requires_role():
    r = client.post("/preset/qsr", json={"fiscal_year":2027, "gdp_growth":0.02})
    assert r.status_code == 401  # missing token
    r = client.post("/preset/qsr", json={"fiscal_year":2027}, headers=VIEWER)
    assert r.status_code == 403  # viewer cannot
    r = client.post("/preset/qsr", json={"fiscal_year":2027}, headers=ANALYST)
    assert r.status_code == 200

def test_bva_viewer_allowed():
    # ensure scenario exists
    client.post("/preset/qsr", json={"fiscal_year":2026}, headers=ANALYST)
    r = client.post("/bva/analyze", json={"year":2025, "scenario":"2026:Base"}, headers=VIEWER)
    assert r.status_code == 200
    js = r.json()
    assert "summary" in js and "hotspots" in js

def test_forecast_ai():
    r = client.post("/forecast/ai", json={"year":2024, "account":"Revenue:Food","model":"arima"}, headers=VIEWER)
    assert r.status_code == 200
    assert isinstance(r.json(), list) and len(r.json())>0

def test_qb_import_json():
    sample = {
        "rows": [
            {"Date":"2024-03-15", "Account":"Sales - Food", "Dept":"Sales", "Amount": 12345.67, "Currency":"USD"},
            {"Date":"2024-03-15", "Account":"Wages", "Dept":"Ops", "Amount": 3456.78, "Currency":"USD"}
        ]
    }
    r = client.post("/qb/import_json", headers=ANALYST, json=sample)
    assert r.status_code == 200
    assert r.json()["imported"] == 2
