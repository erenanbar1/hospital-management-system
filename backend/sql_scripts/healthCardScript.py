import os
import psycopg2
import personalSettings

def get_db_connection():
    """
    Creates and returns a database connection using settings from personalSettings.
    """
    return psycopg2.connect(
        dbname=personalSettings.tableName,
        user=personalSettings.dbUser,
        password=personalSettings.dbPassword,
        host="localhost",
        port=personalSettings.dbPort
    )

# Path to the SQL template
PATIENT_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'healthCardSQL', 'getHealthCard.sql')
)

def get_health_card_of_patient(patient_id: str):
    """
    Gets appointment.
    Returns appointment list.
    """
    # Add a print statement to debug
    def get_health_card_of_patient(patient_id):
        try:
            # Get the path to the SQL file
            sql_file = os.path.join(os.path.dirname(__file__), "../sql/healthCardSQL/getHealthCard.sql")
            
            # Read the SQL query from the file
            with open(sql_file, 'r') as file:
                query = file.read()
            
            # Connect to the database
            connection = get_db_connection()
            cursor = connection.cursor()
            
            # Execute the query with the patient_id parameter
            cursor.execute(query, [patient_id])
            
            # Fetch all results
            rows = cursor.fetchall()
            
            # Convert rows to list of dictionaries
            column_names = [desc[0] for desc in cursor.description]
            results = []
            
            for row in rows:
                result = dict(zip(column_names, row))
                results.append(result)
            
            # For debugging
            print(f"Health card data for patient {patient_id}: {results}")
            
            # Close cursor and connection
            cursor.close()
            connection.close()
            
            return results
            
        except Exception as e:
            print(f"Error in get_health_card_of_patient: {e}")
            raise

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