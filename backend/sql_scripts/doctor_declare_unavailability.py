import os
import uuid
import psycopg2
import personalSettings

SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'doctor_declare_unavailability.sql')
)

def declare_unavailability(ts_id: str, doc_id: str, date: str):
    ua_id = uuid.uuid4().hex[:5].upper()
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
                    'ua_id': ua_id,
                    'ts_id': ts_id,
                    'doc_id': doc_id,
                    'date': date
                })
        return ua_id
    finally:
        conn.close()