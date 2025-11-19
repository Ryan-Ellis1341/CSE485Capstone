from sqlalchemy import text
from .db import engine

def upsert_budget_rows(rows, scenario:str):
    with engine.begin() as conn:
        for r in rows:
            conn.execute(text('INSERT INTO budgets (scenario,fiscal_year,month,account_std,dept,amount,currency) VALUES (:scenario,:fy,:m,:acct,:dept,:amt,:cur)'),
                dict(scenario=scenario, fy=r.get('fiscal_year'), m=r.get('month'),
                     acct=r.get('account_std'), dept=r.get('dept','HQ'),
                     amt=float(r.get('amount',0)), cur=r.get('currency','USD')))

def retrieve_budget(year:int, scenario:str, accounts=None):
    q = 'SELECT month, account_std, dept, amount, currency FROM budgets WHERE fiscal_year=:fy AND scenario=:sc'
    params = {'fy':year, 'sc':scenario}
    if accounts:
        like = []
        for i,a in enumerate(accounts):
            like.append(f'account_std LIKE :p{i}')
            params[f'p{i}'] = a.replace('*','%')
        q += ' AND (' + ' OR '.join(like) + ')'
    q += ' ORDER BY month, account_std'
    with engine.begin() as conn:
        rows = [dict(r) for r in conn.execute(text(q), params)]
    return rows

def clone_scenario(base:str, to:str, pct:float=0.0):
    with engine.begin() as conn:
        conn.exec_driver_sql('DELETE FROM budgets WHERE scenario = ?', (to,))
        conn.exec_driver_sql('INSERT INTO budgets (scenario,fiscal_year,month,account_std,dept,amount,currency) SELECT ?, fiscal_year, month, account_std, dept, amount*(1+?), currency FROM budgets WHERE scenario=?',
                             (to, pct, base))

def apply_sensitivity(scenario:str, account_pattern:str, pct:float):
    like = account_pattern.replace('*','%')
    with engine.begin() as conn:
        res = conn.exec_driver_sql('UPDATE budgets SET amount = amount*(1+?) WHERE scenario=? AND account_std LIKE ?',
                                   (pct, scenario, like))
        return res.rowcount