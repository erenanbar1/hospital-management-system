import psycopg2
import personalSettings

def get_patient_balance(patient_id: str):
    """
    Get patient's current balance
    Returns balance as float or None if patient not found
    """
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
                cur.execute("SELECT balance FROM patient WHERE u_id = %s", (patient_id,))
                row = cur.fetchone()
                return float(row[0]) if row else None
    finally:
        conn.close() 