-- Insert Departments
INSERT INTO department (d_id, dept_name, employee_count) VALUES
('D0001', 'Cardiology', 0),
('D0002', 'Neurology', 0),
('D0003', 'Oncology', 0),
('D0004', 'Pediatrics', 0),
('D0005', 'Dermatology', 0),
('D0006', 'Radiology', 0),
('D0007', 'Urology', 0),
('D0008', 'Orthopedics', 0),
('D0009', 'ENT', 0),
('D0010', 'General', 0);

-- Insert Users
INSERT INTO "user" (u_id, name, surname, email_address, password, phone_no) VALUES
('U0001', 'John', 'Doe', 'john.doe@example.com', 'pass1234', 1234567890),
('U0002', 'Alice', 'Smith', 'alice.smith@example.com', 'pass1234', 1234567891),
('U0003', 'Bob', 'Brown', 'bob.brown@example.com', 'pass1234', 1234567892),
('U0004', 'Carol', 'Taylor', 'carol.taylor@example.com', 'pass1234', 1234567893),
('U0005', 'David', 'Wilson', 'david.wilson@example.com', 'pass1234', 1234567894),
('U0006', 'Eve', 'Johnson', 'eve.johnson@example.com', 'pass1234', 1234567895),
('U0007', 'Frank', 'Lee', 'frank.lee@example.com', 'pass1234', 1234567896),
('U0008', 'Grace', 'Kim', 'grace.kim@example.com', 'pass1234', 1234567897),
('U0009', 'Hank', 'Moore', 'hank.moore@example.com', 'pass1234', 1234567898),
('U0010', 'Ivy', 'Clark', 'ivy.clark@example.com', 'pass1234', 1234567899);

-- Insert Patients + associated health cards (via trigger)
INSERT INTO patient (u_id, hc_id, balance) VALUES
('U0001', 'HC001', 150.00),
('U0002', 'HC002', 100.00),
('U0003', 'HC003', 200.00),
('U0004', 'HC004', 300.00),
('U0005', 'HC005', 250.00);

-- Insert Doctors (triggers increment department count)
INSERT INTO doctor (u_id, d_id, rating, price, specialization) VALUES
('U0006', 'D0001', 4.5, 50, 'Cardiologist'),
('U0007', 'D0002', 4.2, 60, 'Neurologist'),
('U0008', 'D0003', 4.0, 55, 'Oncologist'),
('U0009', 'D0004', 3.9, 45, 'Pediatrician'),
('U0010', 'D0005', 4.8, 65, 'Dermatologist');

-- Insert Staff
INSERT INTO staff (u_id) VALUES
('U0005'),
('U0004');

-- Insert Admins
INSERT INTO admin (u_id) VALUES
('U0003');

-- Insert Time Slots
INSERT INTO time_slot (ts_id, start_time, end_time) VALUES
('TS001', '08:00', '08:30'),
('TS002', '08:30', '09:00'),
('TS003', '09:00', '09:30'),
('TS004', '09:30', '10:00'),
('TS005', '10:00', '10:30'),
('TS006', '10:30', '11:00'),
('TS007', '11:00', '11:30'),
('TS008', '11:30', '12:00'),
('TS009', '12:00', '12:30'),
('TS010', '12:30', '13:00');

-- Insert Appointments (trigger reduces patient balance)
INSERT INTO appointment (patient_id, doc_id, ts_id, date) VALUES
('U0001', 'U0006', 'TS001', '2024-12-01'),
('U0002', 'U0007', 'TS002', '2024-12-02'),
('U0003', 'U0008', 'TS003', '2024-12-03'),
('U0004', 'U0009', 'TS004', '2024-12-04'),
('U0005', 'U0010', 'TS005', '2024-12-05');

-- Insert Doctor Unavailability
INSERT INTO unavailability (ua_id, ts_id, doc_id, date) VALUES
('UA001', 'TS006', 'U0006', '2024-12-06'),
('UA002', 'TS007', 'U0007', '2024-12-07');

-- Insert Medications
INSERT INTO medication (m_id, name, format, dosage) VALUES
('M0001', 'Paracetamol', 'Tablet', 500.0),
('M0002', 'Ibuprofen', 'Tablet', 200.0),
('M0003', 'Amoxicillin', 'Capsule', 250.0),
('M0004', 'Cough Syrup', 'Syrup', 10.0),
('M0005', 'Insulin', 'Injection', 5.0);

-- Insert Prescriptions
INSERT INTO prescription (p_id, hc_id, doc_id, prescription_date, usage_info) VALUES
('P0001', 'HC001', 'U0006', '2024-12-01', 'Take one tablet after meals'),
('P0002', 'HC002', 'U0007', '2024-12-02', 'Take twice daily'),
('P0003', 'HC003', 'U0008', '2024-12-03', 'Before sleep');

-- Prescription-Medication
INSERT INTO presc_medication (m_id, p_id) VALUES
('M0001', 'P0001'),
('M0002', 'P0001'),
('M0003', 'P0002'),
('M0004', 'P0003');

-- Insert Blood Tests
INSERT INTO blood_test (bt_id, hc_id, vitamins, minerals, cholesterol, glucose, hemoglobin, white_blood_cells, red_blood_cells, test_date) VALUES
('BT001', 'HC001', 'A,B,C', 'Iron,Zinc', 180.5, 90.2, 13.5, 6.1, 4.5, '2024-12-10'),
('BT002', 'HC002', 'D,E,K', 'Calcium,Magnesium', 200.0, 95.0, 14.2, 5.9, 4.8, '2024-12-11');

-- Insert Medical Equipment
INSERT INTO medical_equipment (me_id, name, format, amount) VALUES
('ME001', 'Syringe', 'Piece', 100),
('ME002', 'Stethoscope', 'Piece', 20),
('ME003', 'Gloves', 'Box', 50);

-- Equipment Usage Log
INSERT INTO usage_log (usage_id, doc_id, me_id, date, ts_id, amount, format) VALUES
('UL001', 'U0006', 'ME001', '2024-12-01', 'TS001', 2, 'Piece'),
('UL002', 'U0007', 'ME002', '2024-12-02', 'TS002', 1, 'Piece');

-- Insert Feedback
INSERT INTO feedback (f_id, patient_id, doc_id, rating, comment) VALUES
('F001', 'U0001', 'U0006', 4.5, 'Very helpful and professional.'),
('F002', 'U0002', 'U0007', 4.0, 'Good service.'),
('F003', 'U0003', 'U0008', 3.5, 'Average experience.');

-- Department Reports
INSERT INTO department_report (r_id, d_id, num_appointments, start_date, end_date) VALUES
('DR001', 'D0001', 10, '2024-11-01', '2024-11-30'),
('DR002', 'D0002', 15, '2024-11-01', '2024-11-30');

-- Doctor Reports
INSERT INTO doctor_report (r_id, doc_id, num_appointments, start_date, end_date) VALUES
('R001', 'U0006', 5, '2024-11-01', '2024-11-30'),
('R002', 'U0007', 6, '2024-11-01', '2024-11-30');
