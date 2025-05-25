import os
import psycopg2
import personalSettings

# Path to the SQL template
PATIENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'getHealthCard.sql')
)

def get_health_card_of_patient(patient_id: str):
    """
    Gets appointment.
    Returns appointment list.
    """
    with open(PATIENT_SQL_PATH, 'r') as f:
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
                cur.execute(sql, [patient_id])
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
                healthCard = [dict(zip(columns, row)) for row in rows]
                return healthCard
    finally:
        conn.close()