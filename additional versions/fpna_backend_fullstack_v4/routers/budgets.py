from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.budget_engine import upsert_budget_rows, retrieve_budget

router = APIRouter(prefix="/budgets", tags=["budgets"])

class BudgetRow(BaseModel):
    fiscal_year:int
    month:str
    account_std:str
    dept:str="HQ"
    amount:float
    currency:str="USD"

class UpsertReq(BaseModel):
    scenario:str
    rows:List[BudgetRow]

@router.post("/upsert")
def upsert(req:UpsertReq):
    rows = [r.dict() for r in req.rows]
    upsert_budget_rows(rows, req.scenario)
    return {"status":"ok","rows":len(rows)}

class RetrieveReq(BaseModel):
    year:int
    scenario:str
    accounts:Optional[list[str]]=None

@router.post("/retrieve")
def retrieve(req:RetrieveReq):
    return retrieve_budget(req.year, req.scenario, req.accounts or None)