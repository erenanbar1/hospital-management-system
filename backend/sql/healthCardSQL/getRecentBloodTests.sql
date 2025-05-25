-- Get recent blood tests across all patients (for staff dashboard)
SELECT 
    bt.bt_id,
    u.name as patient_name,
    u.surname as patient_surname,
    bt.test_date,
    'Blood Test' as test_type,
    CASE 
        WHEN bt.cholesterol IS NOT NULL AND bt.glucose IS NOT NULL AND bt.hemoglobin IS NOT NULL 
             AND bt.white_blood_cells IS NOT NULL AND bt.red_blood_cells IS NOT NULL 
        THEN 'Completed'
        ELSE 'Pending'
    END as status
FROM blood_test bt
JOIN health_card hc ON bt.hc_id = hc.hc_id
JOIN patient p ON p.hc_id = hc.hc_id
JOIN "user" u ON u.u_id = p.u_id
ORDER BY bt.test_date DESC, bt.bt_id DESC
LIMIT 10; 