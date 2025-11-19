from fastapi import APIRouter
from pydantic import BaseModel
from services.bva_engine import bva
from services.ai_narrative import summarize_variances

router = APIRouter(prefix="/bva", tags=["bva"])

class BvAReq(BaseModel):
    year:int
    scenario:str

@router.post("/analyze")
def analyze(req:BvAReq):
    hotspots = bva(req.year, req.scenario)
    return {"summary": summarize_variances(hotspots), "hotspots": [
        {"account_std":h["account_std"], "amount_func":h["actual"], "budget_func":h["budget"], "month":h["month"]} for h in hotspots
    ]}