from fastapi import FastAPI
from routers import budgets, actuals, bva, scenarios, headcount, versions, excelio, solver, ai, chat
from services.db import init_db

api = FastAPI(title="FP&A Backend v4 (multi-file)")
init_db()

api.include_router(budgets.router)
api.include_router(actuals.router)
api.include_router(bva.router)
api.include_router(scenarios.router)
api.include_router(headcount.router)
api.include_router(versions.router)
api.include_router(excelio.router)
api.include_router(solver.router)
api.include_router(ai.router)
api.include_router(chat.router)