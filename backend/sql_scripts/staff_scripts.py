import os
import psycopg2
import personalSettings

# Path to the SQL template
CREATE_BLOOD_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'createBloodTest.sql')
)

def create_blood_test(patient_id: str, vitamins: str, minerals: str, cholesterol: str, glucose: str, hemoglobin: str, whiteBC: str, redBC: str):
    """
    Inserts a new appointment.
    Returns True on success, raises exception on failure.
    """
    with open(CREATE_BLOOD_SQL_PATH, 'r') as f:
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

GET_EQUIPMENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'equipmentSQL', 'getEquipment.sql')
)

def get_equipment():
    with open(GET_EQUIPMENT_SQL_PATH, 'r') as f:
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
                cur.execute(sql)
                rows = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
                equipment = [dict(zip(columns, row)) for row in rows]
                return equipment
    finally:
        conn.close()

UPDATE_EQUIPMENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'equipmentSQL', 'updateEquipment.sql')
)

def update_equipment(equipment: str, amount: str):
            with open(UPDATE_EQUIPMENT_SQL_PATH, 'r') as f:
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
                        cur.execute(sql, [amount, equipment])
                return True
            finally:
                conn.close()