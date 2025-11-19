from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from services.db import engine

router = APIRouter(prefix="/versions", tags=["versions"])

class SaveReq(BaseModel):
    scenario:str; name:str

@router.post("/save")
def save(req:SaveReq):
    with engine.begin() as conn:
        conn.execute(text('INSERT INTO versions(scenario,name) VALUES (:s,:n)'), dict(s=req.scenario, n=req.name))
        conn.exec_driver_sql('INSERT INTO budgets(scenario,fiscal_year,month,account_std,dept,amount,currency) SELECT ?||"@"||?, fiscal_year, month, account_std, dept, amount, currency FROM budgets WHERE scenario=?',
                             (req.scenario, req.name, req.scenario))
    return {"status":"saved"}

@router.get("/list")
def list_versions(scenario:str):
    with engine.begin() as conn:
        rows = [r[0] for r in conn.exec_driver_sql('SELECT name FROM versions WHERE scenario=? ORDER BY created_at DESC', (scenario,)).fetchall()]
    return {"versions": rows}

class RestoreReq(BaseModel):
    scenario:str; name:str

@router.post("/restore")
def restore(req:RestoreReq):
    snap = f'{req.scenario}@{req.name}'
    with engine.begin() as conn:
        conn.exec_driver_sql('DELETE FROM budgets WHERE scenario=?', (req.scenario,))
        conn.exec_driver_sql('INSERT INTO budgets(scenario,fiscal_year,month,account_std,dept,amount,currency) SELECT ?, fiscal_year, month, account_std, dept, amount, currency FROM budgets WHERE scenario=?',
                             (req.scenario, snap))
    return {"status":"restored"}