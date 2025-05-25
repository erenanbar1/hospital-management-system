-- Inserts feedback for a past appointment
INSERT INTO feedback (
    f_id,
    patient_id,
    doc_id,
    rating,
    comment
) VALUES (
    %(f_id)s,
    %(patient_id)s,
    %(doc_id)s,
    %(rating)s,
    %(comment)s
);