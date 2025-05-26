import os
import psycopg2
import personalSettings
import hashlib

# SQL file paths
GET_ALL_USERS_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'adminSQL', 'adminSQL', 'getAllUsers.sql')
)

GET_SYSTEM_STATS_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'adminSQL', 'adminSQL', 'getSystemStats.sql')
)

GET_ALL_DEPARTMENTS_SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'adminSQL', 'adminSQL', 'getAllDepartments.sql')
)

def get_all_users():
    """
    Gets all users in the system with their roles and additional info.
    Returns list of users.
    """
    with open(GET_ALL_USERS_SQL_PATH, 'r') as f:
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
                users = [dict(zip(columns, row)) for row in rows]
                return users
    finally:
        conn.close()

def get_system_stats():
    """
    Gets system statistics for admin dashboard.
    Returns dictionary with system stats.
    """
    with open(GET_SYSTEM_STATS_SQL_PATH, 'r') as f:
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
                row = cur.fetchone()
                columns = [desc[0] for desc in cur.description]
                stats = dict(zip(columns, row))
                return stats
    finally:
        conn.close()

def get_all_departments():
    """
    Gets all departments with doctor counts.
    Returns list of departments.
    """
    with open(GET_ALL_DEPARTMENTS_SQL_PATH, 'r') as f:
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
                departments = [dict(zip(columns, row)) for row in rows]
                return departments
    finally:
        conn.close()

def delete_user(user_id: str):
    """
    Deletes a user from the system (cascade delete).
    Returns True on success, raises exception on failure.
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
                # First, delete all related records that reference this user
                # Get the patient's hc_id (if any)
                cur.execute('SELECT hc_id FROM patient WHERE u_id = %s', [user_id])
                hc_id_result = cur.fetchone()
                hc_id = hc_id_result[0] if hc_id_result else None
                
                # Delete feedback where patient or doctor is this user
                cur.execute('DELETE FROM feedback WHERE patient_id = %s', [user_id])
                cur.execute('DELETE FROM feedback WHERE doc_id = %s', [user_id])
                
                # Delete appointments where this user is a patient
                cur.execute('DELETE FROM appointment WHERE patient_id = %s', [user_id])
                # Delete appointments where this user is a doctor
                cur.execute('DELETE FROM appointment WHERE doc_id = %s', [user_id])
                
                # Delete blood tests, prescriptions if hc_id exists
                if hc_id:
                    # Delete presc_medication for all prescriptions of this patient
                    cur.execute('SELECT p_id FROM prescription WHERE hc_id = %s', [hc_id])
                    presc_ids = [row[0] for row in cur.fetchall()]
                    if presc_ids:
                        cur.execute('DELETE FROM presc_medication WHERE p_id = ANY(%s)', (presc_ids,))
                    cur.execute('DELETE FROM blood_test WHERE hc_id = %s', [hc_id])
                    cur.execute('DELETE FROM prescription WHERE hc_id = %s', [hc_id])
                
                # Delete all prescriptions where this user is a doctor
                cur.execute('SELECT p_id FROM prescription WHERE doc_id = %s', [user_id])
                doc_presc_ids = [row[0] for row in cur.fetchall()]
                if doc_presc_ids:
                    cur.execute('DELETE FROM presc_medication WHERE p_id = ANY(%s)', (doc_presc_ids,))
                cur.execute('DELETE FROM prescription WHERE doc_id = %s', [user_id])
                
                # Delete doctor unavailability records (correct table name)
                cur.execute('DELETE FROM unavailability WHERE doc_id = %s', [user_id])
                
                # Now delete from role-specific tables
                cur.execute('DELETE FROM patient WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM doctor WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM staff WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM admin WHERE u_id = %s', [user_id])
                # Now delete health card (after patient is deleted)
                if hc_id:
                    cur.execute('DELETE FROM health_card WHERE hc_id = %s', [hc_id])
                # Finally delete from user table
                cur.execute('DELETE FROM "user" WHERE u_id = %s', [user_id])
        return True
    finally:
        conn.close()

def update_user_role(user_id: str, new_role: str):
    """
    Updates a user's role by moving them between role tables.
    Returns True on success, raises exception on failure.
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
                # Get current role to handle data migration
                cur.execute("""
                    SELECT 
                        CASE 
                            WHEN p.u_id IS NOT NULL THEN 'patient'
                            WHEN d.u_id IS NOT NULL THEN 'doctor'
                            WHEN s.u_id IS NOT NULL THEN 'staff'
                            WHEN a.u_id IS NOT NULL THEN 'admin'
                            ELSE 'none'
                        END AS current_role
                    FROM "user" u
                    LEFT JOIN patient p ON u.u_id = p.u_id
                    LEFT JOIN doctor d ON u.u_id = d.u_id
                    LEFT JOIN staff s ON u.u_id = s.u_id
                    LEFT JOIN admin a ON u.u_id = a.u_id
                    WHERE u.u_id = %s
                """, [user_id])
                
                result = cur.fetchone()
                if not result:
                    raise Exception("User not found")
                
                current_role = result[0]
                
                # If changing from patient to another role, we need to handle appointments
                if current_role == 'patient' and new_role.lower() != 'patient':
                    # Delete appointments where this user is a patient
                    cur.execute('DELETE FROM appointment WHERE patient_id = %s', [user_id])
                    # Delete blood tests for this patient
                    cur.execute('DELETE FROM blood_test WHERE patient_id = %s', [user_id])
                    # Delete prescriptions for this patient
                    cur.execute('DELETE FROM prescription WHERE patient_id = %s', [user_id])
                    # Delete health card for this patient
                    cur.execute('DELETE FROM health_card WHERE patient_id = %s', [user_id])
                
                # If changing from doctor to another role, handle doctor-specific data
                if current_role == 'doctor' and new_role.lower() != 'doctor':
                    # Delete appointments where this user is a doctor
                    cur.execute('DELETE FROM appointment WHERE doc_id = %s', [user_id])
                    # Delete doctor unavailability records
                    cur.execute('DELETE FROM unavailability WHERE doc_id = %s', [user_id])
                
                # Remove from all role tables
                cur.execute('DELETE FROM patient WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM doctor WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM staff WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM admin WHERE u_id = %s', [user_id])
                
                # Add to appropriate role table
                if new_role.lower() == 'patient':
                    # Generate health card ID
                    cur.execute("SELECT 'HC' || LPAD((COALESCE(MAX(CAST(SUBSTRING(hc_id, 3) AS INTEGER)), 0) + 1)::TEXT, 3, '0') FROM health_card WHERE hc_id ~ '^HC[0-9]{3}$'")
                    hc_id_result = cur.fetchone()
                    if hc_id_result and hc_id_result[0]:
                        hc_id = hc_id_result[0]
                    else:
                        hc_id = 'HC001'  # Default if no existing health cards
                    cur.execute('INSERT INTO patient (u_id, hc_id, balance) VALUES (%s, %s, %s)', [user_id, hc_id, 0])
                elif new_role.lower() == 'doctor':
                    # Default to General department (D0010)
                    cur.execute('INSERT INTO doctor (u_id, d_id, rating, price, specialization) VALUES (%s, %s, %s, %s, %s)', 
                               [user_id, 'D0010', 0, 50, 'General'])
                elif new_role.lower() == 'staff':
                    cur.execute('INSERT INTO staff (u_id) VALUES (%s)', [user_id])
                elif new_role.lower() == 'admin':
                    cur.execute('INSERT INTO admin (u_id) VALUES (%s)', [user_id])
        return True
    finally:
        conn.close()

def create_user(name: str, surname: str, email: str, password: str, phone: str, role: str, specialization: str = None, price: str = None, department: str = None, balance: str = None, **kwargs):
    """
    Creates a new user and adds them to the appropriate role table.
    Returns the new user ID.
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
                # Generate new user ID
                cur.execute("SELECT 'U' || LPAD((COALESCE(MAX(CAST(SUBSTRING(u_id, 2) AS INTEGER)), 0) + 1)::TEXT, 4, '0') FROM \"user\" WHERE u_id ~ '^U[0-9]{4}$'")
                new_uid = cur.fetchone()[0]
                # Hash the password
                hashed_pw = hashlib.sha256(password.encode()).hexdigest()
                # Insert into user table
                cur.execute('INSERT INTO "user" (u_id, name, surname, email_address, password, phone_no) VALUES (%s, %s, %s, %s, %s, %s)',
                            [new_uid, name, surname, email, hashed_pw, phone])
                # Add to appropriate role table
                if role.lower() == 'patient':
                    # Generate health card ID
                    cur.execute("SELECT 'HC' || LPAD((COALESCE(MAX(CAST(SUBSTRING(hc_id, 3) AS INTEGER)), 0) + 1)::TEXT, 3, '0') FROM health_card WHERE hc_id ~ '^HC[0-9]{3}$'")
                    hc_id_result = cur.fetchone()
                    hc_id = hc_id_result[0] if hc_id_result and hc_id_result[0] else 'HC001'
                    patient_balance = float(balance) if balance else 0
                    cur.execute('INSERT INTO patient (u_id, hc_id, balance) VALUES (%s, %s, %s)', [new_uid, hc_id, patient_balance])
                elif role.lower() == 'doctor':
                    doctor_dept = department if department else 'D0010'  # Default to General department
                    doctor_spec = specialization if specialization else 'General'
                    doctor_price = float(price) if price else 50
                    cur.execute('INSERT INTO doctor (u_id, d_id, rating, price, specialization) VALUES (%s, %s, %s, %s, %s)',
                                [new_uid, doctor_dept, 0, doctor_price, doctor_spec])
                elif role.lower() == 'staff':
                    cur.execute('INSERT INTO staff (u_id) VALUES (%s)', [new_uid])
                elif role.lower() == 'admin':
                    cur.execute('INSERT INTO admin (u_id) VALUES (%s)', [new_uid])
                return new_uid
    finally:
        conn.close()

def update_user_details(user_id: str, name: str = None, surname: str = None, email: str = None, phone: str = None, password: str = None, specialization: str = None, price: str = None, department: str = None, balance: str = None, **kwargs):
    """
    Updates user details (not role or ID). For doctors, updates department, specialization, and price. For patients, updates balance.
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
                # Update user table only if values are provided
                update_fields = []
                update_values = []
                
                if name:
                    update_fields.append("name=%s")
                    update_values.append(name)
                if surname:
                    update_fields.append("surname=%s")
                    update_values.append(surname)
                if email:
                    update_fields.append("email_address=%s")
                    update_values.append(email)
                if phone:
                    update_fields.append("phone_no=%s")
                    update_values.append(phone)
                if password:
                    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
                    update_fields.append("password=%s")
                    update_values.append(hashed_pw)
                
                if update_fields:
                    update_values.append(user_id)
                    sql = f'UPDATE "user" SET {", ".join(update_fields)} WHERE u_id=%s'
                    cur.execute(sql, update_values)
                
                # Check if user is a doctor
                cur.execute('SELECT u_id FROM doctor WHERE u_id = %s', [user_id])
                if cur.fetchone():
                    # Update doctor table
                    if department:
                        cur.execute('UPDATE doctor SET d_id=%s WHERE u_id=%s', [department, user_id])
                    if specialization:
                        cur.execute('UPDATE doctor SET specialization=%s WHERE u_id=%s', [specialization, user_id])
                    if price:
                        cur.execute('UPDATE doctor SET price=%s WHERE u_id=%s', [float(price), user_id])
                
                # Check if user is a patient
                cur.execute('SELECT u_id FROM patient WHERE u_id = %s', [user_id])
                if cur.fetchone() and balance is not None:
                    cur.execute('UPDATE patient SET balance=%s WHERE u_id=%s', [float(balance), user_id])
    finally:
        conn.close() 