-- Users
CREATE TABLE IF NOT EXISTS "user" (
    u_id CHAR(5) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    email_address VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_no NUMERIC(12)
);

-- Departments
CREATE TABLE IF NOT EXISTS department (
    d_id CHAR(5) PRIMARY KEY,
    dept_name VARCHAR(15) NOT NULL,
    employee_count INT DEFAULT 0
);

-- Health cards
CREATE TABLE IF NOT EXISTS health_card (
    hc_id CHAR(5) PRIMARY KEY
);

-- Patients
CREATE TABLE IF NOT EXISTS patient (
    u_id CHAR(5) PRIMARY KEY REFERENCES "user"(u_id),
    hc_id CHAR(5) UNIQUE REFERENCES health_card(hc_id),
    balance NUMERIC(8,2) DEFAULT 0
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctor (
    u_id CHAR(5) PRIMARY KEY REFERENCES "user"(u_id),
    d_id CHAR(5) REFERENCES department(d_id),
    rating NUMERIC(2,1) DEFAULT 0,
    price NUMERIC(5,0),
    specialization VARCHAR(50)
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
    u_id CHAR(5) PRIMARY KEY REFERENCES "user"(u_id)
);

-- Admins
CREATE TABLE IF NOT EXISTS admin (
    u_id CHAR(5) PRIMARY KEY REFERENCES "user"(u_id)
);

-- Time slots
CREATE TABLE IF NOT EXISTS time_slot (
    ts_id CHAR(5) PRIMARY KEY,
    start_time TIME,
    end_time TIME
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointment (
    patient_id CHAR(5),
    doc_id CHAR(5),
    ts_id CHAR(5),
    date DATE,
    PRIMARY KEY (patient_id, doc_id, ts_id, date),
    FOREIGN KEY (patient_id) REFERENCES patient(u_id),
    FOREIGN KEY (doc_id) REFERENCES doctor(u_id),
    FOREIGN KEY (ts_id) REFERENCES time_slot(ts_id)
);

-- Doctor unavailability
CREATE TABLE IF NOT EXISTS unavailability (
    ua_id CHAR(5) PRIMARY KEY,
    ts_id CHAR(5),
    doc_id CHAR(5),
    date DATE NOT NULL,
    FOREIGN KEY (doc_id) REFERENCES doctor(u_id),
    FOREIGN KEY (ts_id) REFERENCES time_slot(ts_id)
);

-- Medications
CREATE TABLE IF NOT EXISTS medication (
    m_id CHAR(5) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    format VARCHAR(20) NOT NULL,
    dosage NUMERIC(5,1) NOT NULL
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS prescription (
    p_id CHAR(5) PRIMARY KEY,
    hc_id CHAR(5) REFERENCES health_card(hc_id),
    doc_id CHAR(5) REFERENCES doctor(u_id),
    prescription_date DATE,
    usage_info VARCHAR(100)
);

-- Prescription-Medication join
CREATE TABLE IF NOT EXISTS presc_medication (
    m_id CHAR(5),
    p_id CHAR(5),
    PRIMARY KEY (m_id, p_id),
    FOREIGN KEY (m_id) REFERENCES medication(m_id),
    FOREIGN KEY (p_id) REFERENCES prescription(p_id)
);

-- Blood tests
CREATE TABLE IF NOT EXISTS blood_test (
    bt_id CHAR(5) PRIMARY KEY,
    hc_id CHAR(5) REFERENCES health_card(hc_id),
    vitamins VARCHAR(100),
    minerals VARCHAR(100),
    cholesterol NUMERIC(5,2),
    glucose NUMERIC(5,2),
    hemoglobin NUMERIC(5,2),
    white_blood_cells NUMERIC(5,2),
    red_blood_cells NUMERIC(5,2),
    test_date DATE NOT NULL
);

-- Medical equipment
CREATE TABLE IF NOT EXISTS medical_equipment (
    me_id CHAR(5) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    format VARCHAR(20),
    amount NUMERIC(5,0)
);

-- Equipment usage log
CREATE TABLE IF NOT EXISTS usage_log (
    usage_id CHAR(5) PRIMARY KEY,
    doc_id CHAR(5) REFERENCES doctor(u_id),
    me_id CHAR(5) REFERENCES medical_equipment(me_id),
    date DATE NOT NULL,
    ts_id CHAR(5) NOT NULL REFERENCES time_slot(ts_id),
    amount INT NOT NULL,
    format VARCHAR(20)
);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
    f_id CHAR(5) PRIMARY KEY,
    patient_id CHAR(5) REFERENCES patient(u_id),
    doc_id CHAR(5) REFERENCES doctor(u_id),
    rating NUMERIC(2,1) NOT NULL,
    comment VARCHAR(200)
);

-- Department reports
CREATE TABLE IF NOT EXISTS department_report (
    r_id CHAR(5) PRIMARY KEY,
    d_id CHAR(5) REFERENCES department(d_id),
    num_appointments INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

-- Doctor reports
CREATE TABLE IF NOT EXISTS doctor_report (
    r_id CHAR(5) PRIMARY KEY,
    doc_id CHAR(5) REFERENCES doctor(u_id),
    num_appointments INT,
    start_date DATE,
    end_date DATE
);

-- Trigger: create health_card after registering patient
CREATE OR REPLACE FUNCTION create_healthcard()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO health_card (hc_id) VALUES (NEW.hc_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_create_healthcard ON patient;
CREATE TRIGGER trg_create_healthcard
AFTER INSERT ON patient
FOR EACH ROW EXECUTE FUNCTION create_healthcard();

-- Trigger: reduce patient balance after appointment
CREATE OR REPLACE FUNCTION reduce_balance()
RETURNS TRIGGER AS $$
DECLARE
    doctor_price NUMERIC(5,0);
BEGIN
    SELECT price INTO doctor_price FROM doctor WHERE u_id = NEW.doc_id;
    UPDATE patient SET balance = balance - doctor_price WHERE u_id = NEW.patient_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reduce_balance ON appointment;
CREATE TRIGGER trg_reduce_balance
AFTER INSERT ON appointment
FOR EACH ROW EXECUTE FUNCTION reduce_balance();

-- Trigger: increment department count after adding doctor
CREATE OR REPLACE FUNCTION increment_department_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE department SET employee_count = employee_count + 1 WHERE d_id = NEW.d_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_department ON doctor;
CREATE TRIGGER trg_increment_department
AFTER INSERT ON doctor
FOR EACH ROW EXECUTE FUNCTION increment_department_count();
