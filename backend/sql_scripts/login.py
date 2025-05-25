#!/usr/bin/env python3
import os
import psycopg2

import personalSettings

# Path to the SQL template
SQL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', 'sql', 'login.sql')
)

def login(email: str, password: str):
    """
    Attempts login; returns (u_id, role) on success or None on failure.
    Raises exceptions on connectivity errors.
    """
<<<<<<< Updated upstream
    # Do NOT hash the password before querying
    pwd = password

=======
>>>>>>> Stashed changes
    # Read the SQL template
    with open(SQL_PATH, 'r') as f:
        query = f.read()

    conn = psycopg2.connect(
        dbname=personalSettings.tableName,
        user=personalSettings.dbUser,
        password=personalSettings.dbPassword,
        host="localhost",
        port=personalSettings.dbPort
    )
    try:
        with conn.cursor() as cur:
            # parameters repeated 4× for each UNION block
<<<<<<< Updated upstream
            cur.execute(query, (email, pwd) * 4)
=======
            cur.execute(query, (email, password) * 4)
>>>>>>> Stashed changes
            return cur.fetchone()  # (u_id, role) or None
    finally:
        conn.close()


