from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from services.db import engine
from typing import List, Optional

router = APIRouter(prefix="/headcount", tags=["headcount"])

class HCRow(BaseModel):
    emp_id:str; name:str; dept:str="HQ"; start_month:str
    annual_salary:float; fte:float=1.0
    raise_month:Optional[str]=None; raise_pct:float=0.0
    benefits_pct:float=0.0; taxes_pct:float=0.0; currency:str="USD"

@router.get("/list")
def list_roster():
    with engine.begin() as conn:
        rows = [dict(r) for r in conn.execute(text('SELECT * FROM headcount'))]
    return {"rows":rows}

@router.post("/upsert")
def upsert(row:HCRow):
    with engine.begin() as conn:
        conn.execute(text('INSERT INTO headcount(emp_id,name,dept,start_month,annual_salary,fte,raise_month,raise_pct,benefits_pct,taxes_pct,currency) VALUES (:emp,:name,:dept,:start,:sal,:fte,:rmon,:rpct,:b,:t,:cur)'),
                     dict(emp=row.emp_id, name=row.name, dept=row.dept, start=row.start_month, sal=row.annual_salary, fte=row.fte, rmon=row.raise_month, rpct=row.raise_pct, b=row.benefits_pct, t=row.taxes_pct, cur=row.currency))
    return {"status":"ok"}

class BakeReq(BaseModel):
    fiscal_year:int; scenario:str; apply:bool=True

@router.post("/bake_to_budget")
def bake(req:BakeReq):
    year = req.fiscal_year
    with engine.begin() as conn:
        roster = [dict(r) for r in conn.execute(text('SELECT * FROM headcount'))]
    rows = []
    for r in roster:
        monthly = (r['annual_salary']*(1+r['benefits_pct']+r['taxes_pct']))/12.0 * r['fte']
        start_m = int(r['start_month'].split('-')[1])
        for m in range(start_m,13):
            rows.append({"fiscal_year":year, "month":f"{year}-{m:02d}", "account_std":"Opex:Labor", "dept":r['dept'], "amount":monthly, "currency":r['currency']})
    if req.apply:
        from services.budget_engine import upsert_budget_rows
        upsert_budget_rows(rows, req.scenario)
    return {"applied_rows": len(rows)}