import os
import psycopg2
import personalSettings

# Path to the SQL template
SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'make_appointment.sql')
)

def make_appointment(patient_id: str, doc_id: str, ts_id: str, date: str):
    """
    Inserts a new appointment.
    Returns True on success, raises exception on failure.
    """
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
                cur.execute(sql, {
                    'patient_id': patient_id,
                    'doc_id': doc_id,
                    'ts_id': ts_id,
                    'date': date
                })
        return True
    finally:
        conn.close()