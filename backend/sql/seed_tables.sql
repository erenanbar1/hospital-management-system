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

-- Insert Time Slots for all hours of the day (48 slots, 30 min each)
INSERT INTO time_slot (ts_id, start_time, end_time) VALUES
('TS001',  '00:00', '00:30'),
('TS002',  '00:30', '01:00'),
('TS003',  '01:00', '01:30'),
('TS004',  '01:30', '02:00'),
('TS005',  '02:00', '02:30'),
('TS006',  '02:30', '03:00'),
('TS007',  '03:00', '03:30'),
('TS008',  '03:30', '04:00'),
('TS009',  '04:00', '04:30'),
('TS010',  '04:30', '05:00'),
('TS011',  '05:00', '05:30'),
('TS012',  '05:30', '06:00'),
('TS013',  '06:00', '06:30'),
('TS014',  '06:30', '07:00'),
('TS015',  '07:00', '07:30'),
('TS016',  '07:30', '08:00'),
('TS017',  '08:00', '08:30'),
('TS018',  '08:30', '09:00'),
('TS019',  '09:00', '09:30'),
('TS020',  '09:30', '10:00'),
('TS021',  '10:00', '10:30'),
('TS022',  '10:30', '11:00'),
('TS023',  '11:00', '11:30'),
('TS024',  '11:30', '12:00'),
('TS025',  '12:00', '12:30'),
('TS026',  '12:30', '13:00'),
('TS027',  '13:00', '13:30'),
('TS028',  '13:30', '14:00'),
('TS029',  '14:00', '14:30'),
('TS030',  '14:30', '15:00'),
('TS031',  '15:00', '15:30'),
('TS032',  '15:30', '16:00'),
('TS033',  '16:00', '16:30'),
('TS034',  '16:30', '17:00'),
('TS035',  '17:00', '17:30'),
('TS036',  '17:30', '18:00'),
('TS037',  '18:00', '18:30'),
('TS038',  '18:30', '19:00'),
('TS039',  '19:00', '19:30'),
('TS040',  '19:30', '20:00'),
('TS041',  '20:00', '20:30'),
('TS042',  '20:30', '21:00'),
('TS043',  '21:00', '21:30'),
('TS044',  '21:30', '22:00'),
('TS045',  '22:00', '22:30'),
('TS046',  '22:30', '23:00'),
('TS047',  '23:00', '23:30'),
('TS048',  '23:30', '00:00');

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
