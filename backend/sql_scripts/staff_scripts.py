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
                cur.execute(sql, [patient_id, vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC])
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

CREATE_EQUIPMENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'equipmentSQL', 'createEquipment.sql')
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

def create_equipment(name: str, format: str, amount: str):
    """
    Creates a new equipment item.
    Returns the created equipment data on success, raises exception on failure.
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
                # First, get the next available ID
                cur.execute("""
                    SELECT 'ME' || LPAD((COALESCE(MAX(CAST(SUBSTRING(me_id, 3) AS INTEGER)), 0) + 1)::TEXT, 3, '0') AS new_me_id
                    FROM medical_equipment
                    WHERE me_id ~ '^ME[0-9]{3}$'
                """)
                new_id = cur.fetchone()[0]
                
                # Then insert the new equipment
                with open(CREATE_EQUIPMENT_SQL_PATH, 'r') as f:
                    sql = f.read()
                
                cur.execute(sql, [new_id, name, format, amount])
                row = cur.fetchone()
                columns = [desc[0] for desc in cur.description]
                equipment = dict(zip(columns, row))
                return equipment
    finally:
        conn.close()

# Blood test results management
UPDATE_BLOOD_TEST_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'updateBloodTestResults.sql')
)

GET_BLOOD_TESTS_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'getBloodTestsByPatient.sql')
)

GET_RECENT_BLOOD_TESTS_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'getRecentBloodTests.sql')
)

def update_blood_test_results(bt_id: str, vitamins: str, minerals: str, cholesterol: str, glucose: str, hemoglobin: str, whiteBC: str, redBC: str, test_date: str = None):
    """
    Updates blood test results for an existing blood test.
    Returns True on success, raises exception on failure.
    """
    with open(UPDATE_BLOOD_TEST_SQL_PATH, 'r') as f:
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
                cur.execute(sql, [vitamins, minerals, cholesterol, glucose, hemoglobin, whiteBC, redBC, test_date, bt_id])
        return True
    finally:
        conn.close()

def get_patient_blood_tests(patient_id: str):
    """
    Gets all blood tests for a specific patient.
    Returns list of blood tests.
    """
    with open(GET_BLOOD_TESTS_SQL_PATH, 'r') as f:
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
                blood_tests = [dict(zip(columns, row)) for row in rows]
                return blood_tests
    finally:
        conn.close()

def get_recent_blood_tests():
    """
    Gets recent blood tests across all patients for staff dashboard.
    Returns list of recent blood tests.
    """
    with open(GET_RECENT_BLOOD_TESTS_SQL_PATH, 'r') as f:
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
                recent_tests = [dict(zip(columns, row)) for row in rows]
                return recent_tests
    finally:
        conn.close()

CREATE_PRESCRIPTION_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'createPrescription.sql')
)

def create_prescription_script(patient_id: str, doctor_id: str, usage_info: str):

    with open(CREATE_PRESCRIPTION_SQL_PATH, 'r') as f:
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
                cur.execute(sql, [patient_id, doctor_id, usage_info])
                return cur.fetchone()[0]
    finally:
        conn.close()

CREATE_PRESCRIPTION_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'prescribeMedication.sql')
)

def prescribe_medication_script(presc: str, med: str):

    with open(CREATE_PRESCRIPTION_SQL_PATH, 'r') as f:
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
                cur.execute(sql, [presc, med])
        return True
    finally:
        conn.close()

