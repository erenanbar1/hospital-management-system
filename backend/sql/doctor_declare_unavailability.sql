-- Insert a doctor's unavailability for a specific time slot and date
INSERT INTO unavailability (ua_id, ts_id, doc_id, date)
VALUES (%(ua_id)s, %(ts_id)s, %(doc_id)s, %(date)s);