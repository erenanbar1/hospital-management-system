#!/usr/bin/env python3
import os
import uuid
<<<<<<< Updated upstream
=======
import hashlib
>>>>>>> Stashed changes
import psycopg2

import personalSettings

# Path to the SQL template
SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'registration.sql')
)

def generate_id() -> str:
    """Return a 5-character uppercase unique ID."""
    return uuid.uuid4().hex[:5].upper()

<<<<<<< Updated upstream
=======
def hash_password(password: str) -> str:
    """Hash the password with SHA-256."""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

>>>>>>> Stashed changes
def register(
    name: str,
    surname: str,
    email: str,
    password: str,
    phone: str
) -> tuple[str, str]:
    """
    Registers a new user+patient.
    Returns (u_id, hc_id) on success.
    Raises an exception on failure.
    """
    u_id  = generate_id()
    hc_id = generate_id()
<<<<<<< Updated upstream
    pwd = password  # No hashing
=======
    pwd_hash = hash_password(password)
>>>>>>> Stashed changes

    # Read the SQL template
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
                cur.execute(sql, {
                    'u_id':     u_id,
                    'name':     name,
                    'surname':  surname,
                    'email':    email,
<<<<<<< Updated upstream
                    'password': pwd,
=======
                    'password': pwd_hash,
>>>>>>> Stashed changes
                    'phone':    phone,
                    'hc_id':    hc_id,
                })
        return u_id, hc_id
    finally:
        conn.close()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="Register a new patient")
    parser.add_argument('name',     help="First name")
    parser.add_argument('surname',  help="Last name")
    parser.add_argument('email',    help="Email")
    parser.add_argument('password', help="Password")
    parser.add_argument('phone',    help="Phone")
    args = parser.parse_args()

    try:
        u_id, hc_id = register(
            args.name, args.surname, args.email, args.password, args.phone
        )
        print(f"✅ Registered u_id={u_id}, hc_id={hc_id}")
    except Exception as e:
        print(f"❌ Registration failed: {e}")
