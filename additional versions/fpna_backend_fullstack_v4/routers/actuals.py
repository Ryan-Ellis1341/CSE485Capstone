from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from sqlalchemy import text
from services.db import engine

router = APIRouter(prefix="/actuals", tags=["actuals"])

class ActualRow(BaseModel):
    fiscal_year:int
    month:str
    account_std:str
    dept:str="HQ"
    amount:float
    currency:str="USD"

@router.post("/upsert")
def upsert(rows:List[ActualRow]):
    with engine.begin() as conn:
        for r in rows:
            conn.execute(text('INSERT INTO actuals (fiscal_year,month,account_std,dept,amount,currency) VALUES (:fy,:m,:a,:d,:amt,:cur)'),
                         dict(fy=r.fiscal_year, m=r.month, a=r.account_std, d=r.dept, amt=r.amount, cur=r.currency))
    return {"status":"ok","rows":len(rows)}