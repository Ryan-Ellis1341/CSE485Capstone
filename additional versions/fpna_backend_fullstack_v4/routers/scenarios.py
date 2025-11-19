from fastapi import APIRouter
from pydantic import BaseModel
from services.budget_engine import clone_scenario, apply_sensitivity

router = APIRouter(prefix="/scenario", tags=["scenarios"])

class CloneReq(BaseModel):
    base:str
    to:str
    pct:float=0.0

@router.post("/clone")
def clone(req:CloneReq):
    clone_scenario(req.base, req.to, req.pct)
    return {"status":"cloned","to":req.to}

class SensReq(BaseModel):
    scenario:str
    account_pattern:str
    pct:float

@router.post("/sensitivity")
def sensitivity(req:SensReq):
    updated = apply_sensitivity(req.scenario, req.account_pattern, req.pct)
    return {"updated_rows": updated}