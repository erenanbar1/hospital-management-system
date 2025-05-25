import personalSettings
import psycopg2

with open('sql/create_tables.sql') as f:
    sql = f.read()

conn = psycopg2.connect(
    dbname= personalSettings.tableName,
    user= personalSettings.dbUser,
    password= personalSettings.dbPassword,
    host="localhost",
    port= personalSettings.dbPort,
)

with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
print("✅ Database initialized.")
