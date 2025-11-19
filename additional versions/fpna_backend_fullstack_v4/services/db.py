from sqlalchemy import create_engine
DB_PATH = "fpna.sqlite3"
engine = create_engine(f"sqlite:///{DB_PATH}", future=True)

def init_db():
    with engine.begin() as conn:
        conn.exec_driver_sql('''CREATE TABLE IF NOT EXISTS budgets(
            id INTEGER PRIMARY KEY AUTOINCREMENT, scenario TEXT, fiscal_year INTEGER,
            month TEXT, account_std TEXT, dept TEXT, amount REAL, currency TEXT DEFAULT 'USD');''')
        conn.exec_driver_sql('''CREATE TABLE IF NOT EXISTS actuals(
            id INTEGER PRIMARY KEY AUTOINCREMENT, fiscal_year INTEGER,
            month TEXT, account_std TEXT, dept TEXT, amount REAL, currency TEXT DEFAULT 'USD');''')
        conn.exec_driver_sql('''CREATE TABLE IF NOT EXISTS versions(
            id INTEGER PRIMARY KEY AUTOINCREMENT, scenario TEXT, name TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);''')
        conn.exec_driver_sql('''CREATE TABLE IF NOT EXISTS headcount(
            id INTEGER PRIMARY KEY AUTOINCREMENT, emp_id TEXT, name TEXT, dept TEXT, start_month TEXT,
            annual_salary REAL, fte REAL DEFAULT 1.0, raise_month TEXT, raise_pct REAL DEFAULT 0.0,
            benefits_pct REAL DEFAULT 0.0, taxes_pct REAL DEFAULT 0.0, currency TEXT DEFAULT 'USD');''')
        conn.exec_driver_sql('''CREATE TABLE IF NOT EXISTS chat_messages(
            id INTEGER PRIMARY KEY AUTOINCREMENT, thread_id TEXT, user_id TEXT, role TEXT, text TEXT, ts REAL);''')