SELECT 
    (SELECT COUNT(*) FROM "user") AS total_users,
    (SELECT COUNT(*) FROM patient) AS total_patients,
    (SELECT COUNT(*) FROM doctor) AS total_doctors,
    (SELECT COUNT(*) FROM staff) AS total_staff,
    (SELECT COUNT(*) FROM admin) AS total_admins,
    (SELECT COUNT(*) FROM appointment WHERE date >= CURRENT_DATE) AS upcoming_appointments,
    (SELECT COUNT(*) FROM appointment WHERE date = CURRENT_DATE) AS today_appointments,
    (SELECT COUNT(*) FROM blood_test WHERE test_date >= CURRENT_DATE - INTERVAL '7 days') AS recent_tests,
    (SELECT COUNT(*) FROM medical_equipment WHERE amount::integer = 0) AS out_of_stock_equipment,
    (SELECT COUNT(*) FROM medical_equipment WHERE amount::integer > 0 AND amount::integer < 10) AS low_stock_equipment; 