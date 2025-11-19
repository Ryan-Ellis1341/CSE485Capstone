from fastapi import APIRouter
from pydantic import BaseModel
from services.bva_engine import bva
from services.ai_narrative import summarize_variances

router = APIRouter(prefix="/ai", tags=["ai"])

class ExplainReq(BaseModel):
    year:int; scenario:str

@router.post("/explain/variance")
def explain_variance(req:ExplainReq):
    hotspots = bva(req.year, req.scenario)
    return {"narrative": summarize_variances(hotspots), "hotspots": hotspots}