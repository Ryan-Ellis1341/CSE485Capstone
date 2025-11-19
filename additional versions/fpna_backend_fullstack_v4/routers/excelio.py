from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.budget_engine import retrieve_budget, upsert_budget_rows

router = APIRouter(prefix="/excel", tags=["excel"])

class RetrieveReq(BaseModel):
    year:int; scenario:str; accounts:Optional[List[str]]=None

@router.post("/retrieve")
def retrieve(req:RetrieveReq):
    return retrieve_budget(req.year, req.scenario, req.accounts)

class SubmitReq(BaseModel):
    scenario:str; rows:List[dict]

@router.post("/submit")
def submit(req:SubmitReq):
    upsert_budget_rows(req.rows, req.scenario)
    return {"rows_submitted": len(req.rows)}