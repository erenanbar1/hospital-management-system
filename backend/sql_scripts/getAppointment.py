

import os
import psycopg2
import personalSettings

# Path to the SQL template
PATIENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'getAppointmentSQL', 'getPatientAppointment.sql')
)

def get_appointments_for_patient(patient_id: str):
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
                appointments = [dict(zip(columns, row)) for row in rows]
                return appointments
    finally:
        conn.close()