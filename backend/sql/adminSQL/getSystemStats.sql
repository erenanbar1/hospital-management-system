-- Get system statistics
SELECT 
    (SELECT COUNT(*) FROM "user") AS total_users,
    (SELECT COUNT(*) FROM doctor) AS total_doctors,
    (SELECT COUNT(*) FROM staff) AS total_staff,
    (SELECT COUNT(*) FROM patient) AS total_patients; 