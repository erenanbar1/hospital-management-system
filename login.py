import psycopg2

def login(email, password):
    try:
        conn = psycopg2.connect(
            dbname="hospital_system",
            user="postgres",
            password="furkan",  # 🔒 replace with your actual PostgreSQL password
            host="localhost",
            port="5432"
        )
        cur = conn.cursor()

        query = """
        (SELECT u.u_id, 'patient' AS role FROM "user" u JOIN patient p ON u.u_id = p.u_id WHERE email_address = %s AND password = %s)
        UNION
        (SELECT u.u_id, 'doctor' AS role FROM "user" u JOIN doctor d ON u.u_id = d.u_id WHERE email_address = %s AND password = %s)
        UNION
        (SELECT u.u_id, 'staff' AS role FROM "user" u JOIN staff s ON u.u_id = s.u_id WHERE email_address = %s AND password = %s)
        UNION
        (SELECT u.u_id, 'admin' AS role FROM "user" u JOIN admin a ON u.u_id = a.u_id WHERE email_address = %s AND password = %s)
        """

        cur.execute(query, (email, password, email, password, email, password, email, password))
        result = cur.fetchone()

        if result:
            print("SUCCESS")
        else:
            print("FAILURE")

        cur.close()
        conn.close()

    except Exception as e:
        print(f"ERROR: {e}")

# Example usage
if __name__ == "__main__":
    login("ayse@example.com", "pass456")   # ← test with valid or invalid credentials
