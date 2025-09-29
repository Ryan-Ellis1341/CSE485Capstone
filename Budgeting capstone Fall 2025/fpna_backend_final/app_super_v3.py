from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

api = FastAPI(title="FP&A Backend Super v3")

class BvARequest(BaseModel):
    year: int
    scenario: str

class HeadcountRow(BaseModel):
    emp_id: str
    name: str
    dept: str
    start_month: str
    annual_salary: float

@api.post("/bva/analyze")
def analyze_bva(req: BvARequest):
    return {"summary": f"AI Narrative: Variance analysis for {req.scenario} in {req.year}",
            "hotspots": [{"account_std": "COGS:Food", "amount_func": 120000, "budget_func": 100000}]}

@api.get("/headcount/list")
def list_headcount():
    return {"rows": [{
        "emp_id": "E001", "name": "Alice", "dept": "Ops",
        "start_month": "2027-01", "annual_salary": 55000
    }]}

@api.post("/headcount/upsert")
def upsert_headcount(row: HeadcountRow):
    return {"status": "ok", "row": row.dict()}

@api.post("/headcount/bake_to_budget")
def bake_to_budget(payload: Dict[str, Any]):
    return {"applied_rows": 3}

@api.post("/solver/goal_seek")
def solver_goal_seek(payload: Dict[str, Any]):
    return {"solution": {"pct_change": 0.08}, "status": "success"}

@api.post("/scenario/clone")
def scenario_clone(payload: Dict[str, Any]):
    return {"status": "cloned", "to": payload.get("to")}

@api.post("/scenario/sensitivity")
def scenario_sensitivity(payload: Dict[str, Any]):
    return {"updated_rows": 5}

@api.post("/versions/save")
def versions_save(payload: Dict[str, Any]):
    return {"status": "saved"}

@api.get("/versions/list")
def versions_list(scenario: str):
    return {"versions": ["Checkpoint-1", "Checkpoint-2"]}

@api.post("/versions/restore")
def versions_restore(payload: Dict[str, Any]):
    return {"status": "restored"}

@api.post("/excel/retrieve")
def excel_retrieve(payload: Dict[str, Any]):
    return [{"month": "2027-01", "account_std": "Revenue:Food", "amount": 10000}]

@api.post("/excel/submit")
def excel_submit(payload: Dict[str, Any]):
    return {"rows_submitted": len(payload.get("rows", []))}

@api.get("/boardpack/generate")
def boardpack_generate(year: int, scenario: str):
    return {"status": "generated", "file": f"boardpack_{year}_{scenario}.pptx"}
