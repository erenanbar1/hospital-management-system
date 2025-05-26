-- Get all users with their role information
SELECT 
    u.u_id,
    u.name,
    u.surname,
    u.email_address,
    u.phone_no,
    CASE 
        WHEN p.u_id IS NOT NULL THEN 'patient'
        WHEN d.u_id IS NOT NULL THEN 'doctor'
        WHEN s.u_id IS NOT NULL THEN 'staff'
        WHEN a.u_id IS NOT NULL THEN 'admin'
        ELSE 'unknown'
    END AS role,
    d.specialization,
    d.price,
    d.d_id,
    p.balance
FROM "user" u
LEFT JOIN patient p ON u.u_id = p.u_id
LEFT JOIN doctor d ON u.u_id = d.u_id
LEFT JOIN staff s ON u.u_id = s.u_id
LEFT JOIN admin a ON u.u_id = a.u_id
ORDER BY u.u_id; 