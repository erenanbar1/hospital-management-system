import psycopg2
import personalSettings
import hashlib

def get_db_connection():
    """Create and return a database connection"""
    return psycopg2.connect(
        dbname=personalSettings.tableName,
        user=personalSettings.dbUser,
        password=personalSettings.dbPassword,
        host="localhost",
        port=personalSettings.dbPort
    )

def get_all_users():
    """Get all users with their roles"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    u.u_id,
                    u.name,
                    u.surname,
                    u.email_address,
                    u.phone_no,
                    CASE 
                        WHEN p.u_id IS NOT NULL THEN 'patient'
                        WHEN d.u_id IS NOT NULL THEN 'doctor'
                        WHEN s.u_id IS NOT NULL THEN 'staff'
                        WHEN a.u_id IS NOT NULL THEN 'admin'
                        ELSE 'unknown'
                    END AS role,
                    d.specialization,
                    d.price,
                    d.d_id,
                    p.balance
                FROM "user" u
                LEFT JOIN patient p ON u.u_id = p.u_id
                LEFT JOIN doctor d ON u.u_id = d.u_id
                LEFT JOIN staff s ON u.u_id = s.u_id
                LEFT JOIN admin a ON u.u_id = a.u_id
                ORDER BY u.u_id
            """)
            
            rows = cur.fetchall()
            users = []
            for row in rows:
                user = {
                    'u_id': row[0],
                    'name': row[1],
                    'surname': row[2],
                    'email_address': row[3],
                    'phone_no': row[4],
                    'role': row[5],
                    'specialization': row[6],
                    'price': row[7],
                    'd_id': row[8],
                    'balance': row[9]
                }
                users.append(user)
            return users
    finally:
        conn.close()

def get_system_stats():
    """Get system statistics"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    (SELECT COUNT(*) FROM "user") AS total_users,
                    (SELECT COUNT(*) FROM doctor) AS total_doctors,
                    (SELECT COUNT(*) FROM staff) AS total_staff,
                    (SELECT COUNT(*) FROM patient) AS total_patients
            """)
            
            row = cur.fetchone()
            return {
                'total_users': row[0],
                'total_doctors': row[1],
                'total_staff': row[2],
                'total_patients': row[3]
            }
    finally:
        conn.close()

def get_all_departments():
    """Get all departments"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT d_id, dept_name 
                FROM department 
                ORDER BY dept_name
            """)
            
            rows = cur.fetchall()
            departments = []
            for row in rows:
                departments.append({
                    'd_id': row[0],
                    'd_name': row[1]
                })
            return departments
    finally:
        conn.close()

def delete_user(user_id):
    """Delete a user and all related records"""
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                # Check if user is a patient and get health card ID
                cur.execute('SELECT hc_id FROM patient WHERE u_id = %s', [user_id])
                result = cur.fetchone()
                hc_id = result[0] if result else None
                
                # Delete feedback records
                cur.execute('DELETE FROM feedback WHERE patient_id = %s OR doc_id = %s', [user_id, user_id])
                
                # Delete appointments
                cur.execute('DELETE FROM appointment WHERE patient_id = %s OR doc_id = %s', [user_id, user_id])
                
                # If user has a health card, delete related records
                if hc_id:
                    # First delete presc_medication entries for prescriptions with this health card
                    cur.execute("""
                        DELETE FROM presc_medication 
                        WHERE p_id IN (SELECT p_id FROM prescription WHERE hc_id = %s)
                    """, [hc_id])
                    
                    # Then delete prescriptions
                    cur.execute('DELETE FROM prescription WHERE hc_id = %s', [hc_id])
                    
                    # Delete blood tests
                    cur.execute('DELETE FROM blood_test WHERE hc_id = %s', [hc_id])
                
                # Delete presc_medication entries for prescriptions where user is doctor
                cur.execute("""
                    DELETE FROM presc_medication 
                    WHERE p_id IN (SELECT p_id FROM prescription WHERE doc_id = %s)
                """, [user_id])
                
                # Delete prescriptions where user is doctor
                cur.execute('DELETE FROM prescription WHERE doc_id = %s', [user_id])
                
                # Delete unavailability records if doctor
                cur.execute('DELETE FROM unavailability WHERE doc_id = %s', [user_id])
                
                # Delete from role tables
                cur.execute('DELETE FROM patient WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM doctor WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM staff WHERE u_id = %s', [user_id])
                cur.execute('DELETE FROM admin WHERE u_id = %s', [user_id])
                
                # Delete health card if exists
                if hc_id:
                    cur.execute('DELETE FROM health_card WHERE hc_id = %s', [hc_id])
                
                # Finally delete from user table
                cur.execute('DELETE FROM "user" WHERE u_id = %s', [user_id])
                
                return True
    except Exception as e:
        print(f"Error deleting user: {e}")
        return False
    finally:
        conn.close()

def create_user(name, surname, email, password, phone, role, **kwargs):
    """Create a new user"""
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                # Generate new user ID
                cur.execute("""
                    SELECT 'U' || LPAD((COALESCE(MAX(CAST(SUBSTRING(u_id, 2) AS INTEGER)), 0) + 1)::TEXT, 4, '0') 
                    FROM "user" 
                    WHERE u_id ~ '^U[0-9]{4}$'
                """)
                new_uid = cur.fetchone()[0]
                
                # Store password as plain text (no hashing)
                
                # Insert into user table
                cur.execute(
                    'INSERT INTO "user" (u_id, name, surname, email_address, password, phone_no) VALUES (%s, %s, %s, %s, %s, %s)',
                    [new_uid, name, surname, email, password, phone]
                )
                
                # Insert into role table
                if role == 'patient':
                    balance = float(kwargs.get('balance', 0))
                    # Generate health card ID
                    cur.execute("""
                        SELECT 'HC' || LPAD((COALESCE(MAX(CAST(SUBSTRING(hc_id, 3) AS INTEGER)), 0) + 1)::TEXT, 3, '0') 
                        FROM health_card 
                        WHERE hc_id ~ '^HC[0-9]{3}$'
                    """)
                    result = cur.fetchone()
                    hc_id = result[0] if result and result[0] else 'HC001'
                    
                    # The trigger will create the health_card, so we just insert the patient
                    cur.execute('INSERT INTO patient (u_id, hc_id, balance) VALUES (%s, %s, %s)', 
                               [new_uid, hc_id, balance])
                elif role == 'doctor':
                    dept = kwargs.get('department', 'D0010')
                    spec = kwargs.get('specialization', 'General')
                    price = float(kwargs.get('price', 50))
                    cur.execute('INSERT INTO doctor (u_id, d_id, rating, price, specialization) VALUES (%s, %s, %s, %s, %s)',
                               [new_uid, dept, 0, price, spec])
                elif role == 'staff':
                    cur.execute('INSERT INTO staff (u_id) VALUES (%s)', [new_uid])
                elif role == 'admin':
                    cur.execute('INSERT INTO admin (u_id) VALUES (%s)', [new_uid])
                
                return new_uid
    except Exception as e:
        print(f"Error creating user: {e}")
        return None
    finally:
        conn.close()

def update_user(user_id, **kwargs):
    """Update user details"""
    conn = get_db_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                # Update user table fields if provided
                if any(k in kwargs for k in ['name', 'surname', 'email', 'phone', 'password']):
                    updates = []
                    values = []
                    
                    if 'name' in kwargs:
                        updates.append('name = %s')
                        values.append(kwargs['name'])
                    if 'surname' in kwargs:
                        updates.append('surname = %s')
                        values.append(kwargs['surname'])
                    if 'email' in kwargs:
                        updates.append('email_address = %s')
                        values.append(kwargs['email'])
                    if 'phone' in kwargs:
                        updates.append('phone_no = %s')
                        values.append(kwargs['phone'])
                    if 'password' in kwargs and kwargs['password']:
                        updates.append('password = %s')
                        values.append(kwargs['password'])  # Store as plain text
                    
                    if updates:
                        values.append(user_id)
                        sql = f'UPDATE "user" SET {", ".join(updates)} WHERE u_id = %s'
                        cur.execute(sql, values)
                
                # Update role-specific fields
                # Check if user is a doctor
                cur.execute('SELECT u_id FROM doctor WHERE u_id = %s', [user_id])
                if cur.fetchone():
                    if 'department' in kwargs:
                        cur.execute('UPDATE doctor SET d_id = %s WHERE u_id = %s', [kwargs['department'], user_id])
                    if 'specialization' in kwargs:
                        cur.execute('UPDATE doctor SET specialization = %s WHERE u_id = %s', [kwargs['specialization'], user_id])
                    if 'price' in kwargs:
                        cur.execute('UPDATE doctor SET price = %s WHERE u_id = %s', [float(kwargs['price']), user_id])
                
                # Check if user is a patient
                cur.execute('SELECT u_id FROM patient WHERE u_id = %s', [user_id])
                if cur.fetchone():
                    if 'balance' in kwargs:
                        cur.execute('UPDATE patient SET balance = %s WHERE u_id = %s', [float(kwargs['balance']), user_id])
                
                return True
    except Exception as e:
        print(f"Error updating user: {e}")
        return False
    finally:
        conn.close() 