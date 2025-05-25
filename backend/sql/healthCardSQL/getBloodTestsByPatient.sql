-- Get all blood tests for a specific patient
SELECT 
    bt.bt_id,
    bt.vitamins,
    bt.minerals,
    bt.cholesterol,
    bt.glucose,
    bt.hemoglobin,
    bt.white_blood_cells,
    bt.red_blood_cells,
    bt.test_date,
    u.name as patient_name,
    u.surname as patient_surname
FROM blood_test bt
JOIN health_card hc ON bt.hc_id = hc.hc_id
JOIN patient p ON p.hc_id = hc.hc_id
JOIN "user" u ON u.u_id = p.u_id
WHERE p.u_id = %s
ORDER BY bt.test_date DESC; 