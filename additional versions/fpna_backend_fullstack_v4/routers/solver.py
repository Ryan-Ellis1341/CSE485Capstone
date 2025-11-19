from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from services.db import engine

router = APIRouter(prefix="/solver", tags=["solver"])

class GoalSeekReq(BaseModel):
    scenario:str; target_ebitda:float; search_range:float=0.2; apply:bool=False

def compute_ebitda(conn, scenario):
    row = conn.execute(text('''
        SELECT
          COALESCE(SUM(CASE WHEN account_std LIKE "Revenue%%" THEN amount ELSE 0 END),0) -
          COALESCE(SUM(CASE WHEN account_std LIKE "COGS%%" THEN amount ELSE 0 END),0) -
          COALESCE(SUM(CASE WHEN account_std LIKE "Opex%%" THEN amount ELSE 0 END),0) as e
        FROM budgets WHERE scenario=?
    '''), (scenario,)).fetchone()
    return float(row[0] or 0.0)

@router.post("/goal_seek")
def goal_seek(req:GoalSeekReq):
    base = req.scenario
    test = base + ":_solver_tmp"
    with engine.begin() as conn:
        conn.exec_driver_sql('DELETE FROM budgets WHERE scenario=?', (test,))
        conn.exec_driver_sql('INSERT INTO budgets(scenario,fiscal_year,month,account_std,dept,amount,currency) SELECT ?, fiscal_year, month, account_std, dept, amount, currency FROM budgets WHERE scenario=?', (test, base))
        lo, hi = -req.search_range, req.search_range
        best = 0.0; best_err = 1e18
        for _ in range(20):
            mid = (lo+hi)/2.0
            conn.exec_driver_sql('UPDATE budgets SET amount=amount*(1+?) WHERE scenario=? AND account_std LIKE "Revenue%%"', (mid, test))
            e = compute_ebitda(conn, test)
            err = abs(e - req.target_ebitda)
            if err < best_err: best_err, best = err, mid
            if e < req.target_ebitda: lo = mid
            else: hi = mid
            conn.exec_driver_sql('DELETE FROM budgets WHERE scenario=?', (test,))
            conn.exec_driver_sql('INSERT INTO budgets SELECT * FROM budgets WHERE scenario=?', (base,))
        result = {"pct_change": best, "note":"Apply this % to all Revenue to hit target EBITDA (approx.)"}
        if req.apply:
            conn.exec_driver_sql('UPDATE budgets SET amount=amount*(1+?) WHERE scenario=? AND account_std LIKE "Revenue%%"', (best, base))
        return {"solution": result, "status":"success"}