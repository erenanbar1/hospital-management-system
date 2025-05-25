import os
import psycopg2
import personalSettings

SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'filter_doctors_by_dept.sql')
)

def filter_doctors_by_dept(dept_name: str):
    with open(SQL_PATH, 'r') as f:
        sql = f.read()

    conn = psycopg2.connect(
        dbname=personalSettings.tableName,
        user=personalSettings.dbUser,
        password=personalSettings.dbPassword,
        host="localhost",
        port=personalSettings.dbPort
    )
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(sql, [dept_name])
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
                doctors = [dict(zip(columns, row)) for row in rows]
                return doctors
    finally:
        conn.close()