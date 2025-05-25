-- Insert a new appointment
INSERT INTO appointment (patient_id, doc_id, ts_id, date)
VALUES (%(patient_id)s, %(doc_id)s, %(ts_id)s, %(date)s);