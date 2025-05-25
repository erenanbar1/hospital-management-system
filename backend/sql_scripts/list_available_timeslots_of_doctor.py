import os
import psycopg2
import personalSettings

SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'list_available_timeslots_of_doctor.sql')
)

def list_available_timeslots_of_doctor(doc_id: str, date: str):
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
                cur.execute(sql, [doc_id, date, doc_id, date])
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
                timeslots = [dict(zip(columns, row)) for row in rows]
                return timeslots
    finally:
        conn.close()