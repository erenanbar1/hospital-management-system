import psycopg2

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="hospital_system",
            user="postgres",
            password="furkan",   # 🔒 replace with your actual password
            host="localhost",
            port="5432"
        )
        self.conn.autocommit = True
        self.cur = self.conn.cursor()

    def close(self):
        self.cur.close()
        self.conn.close()

    def seed_users(self):
        try:
            # STEP 1: Insert health card first
            self.cur.execute("INSERT INTO health_card (hc_id) VALUES ('HC001')")

            # STEP 2: Insert user records
            self.cur.execute("""
                INSERT INTO "user" (u_id, name, surname, email_address, password, phone_no)
                VALUES 
                    ('U0001', 'Ali', 'Yilmaz', 'ali@example.com', 'pass123', 905551112233),
                    ('U0002', 'Ayse', 'Demir', 'ayse@example.com', 'pass456', 905552223344),
                    ('U0003', 'Mehmet', 'Can', 'mehmet@example.com', 'pass789', 905553334455),
                    ('U0004', 'Fatma', 'Kara', 'fatma@example.com', 'adminpw', 905554445566)
            """)

            # STEP 3: Insert role entries


            self.cur.execute("INSERT INTO patient (u_id, hc_id, balance) VALUES ('U0001', 'HC001', 200.00)")
            self.cur.execute("INSERT INTO department (d_id, dept_name) VALUES ('D001', 'Cardiology')")
            self.cur.execute("INSERT INTO doctor (u_id, d_id, rating, price, specialization) VALUES ('U0002', 'D001', 4.5, 100, 'Cardiology')")
            self.cur.execute("INSERT INTO staff (u_id) VALUES ('U0003')")
            self.cur.execute("INSERT INTO admin (u_id) VALUES ('U0004')")

            print("✅ Test users inserted successfully.")

        except Exception as e:
            print(f"❌ Failed to insert users: {e}")

if __name__ == "__main__":
    db = Database()
    db.seed_users()
    db.close()



