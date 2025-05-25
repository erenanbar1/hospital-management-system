SELECT 
    pu.name AS patient_name,
    a.date AS date,
    t.start_time AS startTime,
    t.end_time AS endTime
FROM appointment a
JOIN patient p ON a.patient_id = p.u_id
JOIN "user" pu ON p.u_id = pu.u_id
JOIN time_slot t ON a.ts_id = t.ts_id
WHERE a.doc_id = %s;