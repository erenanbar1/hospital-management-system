SELECT 
    -- Blood Test Info
    bt.test_date AS testDate,
    bt.cholesterol AS cholesterol,
    bt.glucose AS glucose,
    bt.hemoglobin AS hemoglobin,
    bt.white_blood_cells AS whiteBloodCell,
    bt.red_blood_cells AS redBloodCell,

    -- Prescription Info
    pr.prescription_date AS prescriptionDate,
    pr.usage_info AS usageInfo,

    -- Medication Info
    m.name AS medicationName,
    m.format AS medicationFormat,
    m.dosage AS medicationDosage

FROM patient p
JOIN "user" u ON p.u_id = u.u_id
LEFT JOIN blood_test bt ON p.hc_id = bt.hc_id
LEFT JOIN prescription pr ON p.hc_id = pr.hc_id
LEFT JOIN presc_medication pm ON pr.p_id = pm.p_id
LEFT JOIN medication m ON pm.m_id = m.m_id

WHERE p.u_id = %s; 
