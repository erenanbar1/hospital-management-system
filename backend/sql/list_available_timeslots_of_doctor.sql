SELECT 
    t.ts_id,
    t.start_time,
    t.end_time
FROM time_slot t
WHERE t.ts_id NOT IN (
    -- Exclude slots already appointed
    SELECT a.ts_id
    FROM appointment a
    WHERE a.doc_id = %s AND a.date = %s

    UNION

    -- Exclude slots marked as unavailable by the doctor
    SELECT u.ts_id
    FROM unavailability u
    WHERE u.doc_id = %s AND u.date = %s
)
ORDER BY t.start_time;