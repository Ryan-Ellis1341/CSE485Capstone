from fastapi.testclient import TestClient
from app import api
client = TestClient(api)
def test_bva_endpoint():
    r = client.post('/bva/analyze', json={'year':2027,'scenario':'2027:Base'})
    assert r.status_code == 200