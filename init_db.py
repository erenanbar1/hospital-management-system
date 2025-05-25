#!/usr/bin/env python3
import psycopg2

with open('sql/create_tables.sql') as f:
    sql = f.read()

conn = psycopg2.connect(
    dbname="mydb",
    user="myuser",
    password="secret",
    host="localhost",
    port=5432,
)
with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
print("✅ Database initialized.")
