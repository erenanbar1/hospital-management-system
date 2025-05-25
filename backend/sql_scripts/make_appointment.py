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
                # Validate balance vs doctor price
                cur.execute("SELECT balance FROM patient WHERE u_id = %s", (patient_id,))
                bal_row = cur.fetchone()
                if not bal_row:
                    raise Exception("Patient not found")
                balance = float(bal_row[0])

                cur.execute("SELECT price FROM doctor WHERE u_id = %s", (doc_id,))
                price_row = cur.fetchone()
                if not price_row or price_row[0] is None:
                    raise Exception("Doctor price not set")
                price = float(price_row[0])

                if balance < price:
                    raise Exception(f"Insufficient balance. Need {price}, have {balance}")

                # execute original insert (trigger will deduct balance)
                cur.execute(sql, {
                    'patient_id': patient_id,
                    'doc_id': doc_id,
                    'ts_id': ts_id,
                    'date': date
                })
        return True
    finally:
        conn.close()