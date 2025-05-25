
SELECT 
    du.name AS doctor_name,
    a.date AS date,
    t.start_time AS startTime,
    t.end_time AS endTime,
    d.specialization AS department
FROM appointment a
JOIN "user" u ON a.patient_id = u.u_id
JOIN doctor d ON a.doc_id = d.u_id
JOIN "user" du ON d.u_id = du.u_id
JOIN time_slot t ON a.ts_id = t.ts_id
WHERE a.patient_id = %s;
