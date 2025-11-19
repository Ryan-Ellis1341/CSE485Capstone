from sqlalchemy import text
from .db import engine

def bva(year:int, scenario:str):
    with engine.begin() as conn:
        act = conn.execute(text('SELECT month, account_std, SUM(amount) as amt FROM actuals WHERE fiscal_year=:fy GROUP BY month, account_std'), {'fy':year}).mappings().all()
        bud = conn.execute(text('SELECT month, account_std, SUM(amount) as amt FROM budgets WHERE fiscal_year=:fy AND scenario=:sc GROUP BY month, account_std'), {'fy':year,'sc':scenario}).mappings().all()
    bykey_act = {(r['month'], r['account_std']): r['amt'] for r in act}
    bykey_bud = {(r['month'], r['account_std']): r['amt'] for r in bud}
    variances = []
    keys = set(list(bykey_act.keys()) + list(bykey_bud.keys()))
    for (m,a) in keys:
        av = bykey_act.get((m,a), 0.0)
        bv = bykey_bud.get((m,a), 0.0)
        if av != 0 or bv != 0:
            variances.append({'month':m, 'account_std':a, 'actual':av, 'budget':bv, 'variance': av-bv, 'abs_var': abs(av-bv)})
    variances.sort(key=lambda x: x['abs_var'], reverse=True)
    return variances[:20]