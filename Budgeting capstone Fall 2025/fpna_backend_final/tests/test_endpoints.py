from fastapi.testclient import TestClient
from app_super_v3 import api

client = TestClient(api)

def test_bva():
    resp = client.post("/bva/analyze", json={"year": 2027, "scenario": "2027:Base"})
    assert resp.status_code == 200
    assert "summary" in resp.json()
