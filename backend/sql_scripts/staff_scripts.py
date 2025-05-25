import os
import psycopg2
import personalSettings

# Path to the SQL template
SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'createBloodTest.sql')
)

def create_blood_test(patient_id: str, vitamins: str, minerals: str, cholesterol: str, glucose: str, hemoglobin: str, whiteBC: str, redBC: str):
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
                print("executing querry: ")
                cur.execute(sql, [patient_id, vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC])
                print("Querry executed")
        return True
    finally:
        conn.close()