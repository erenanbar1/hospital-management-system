-- getAllUsers.sql
SELECT  u.u_id,
        u.name,
        u.surname,
        u.email_address,
        u.phone_no,
        CASE WHEN p.u_id IS NOT NULL THEN 'patient'
             WHEN d.u_id IS NOT NULL THEN 'doctor'
             WHEN s.u_id IS NOT NULL THEN 'staff'
             WHEN a.u_id IS NOT NULL THEN 'admin'
        END                                AS role,
        COALESCE(p.balance, 0)             AS balance,
        d.specialization,
        d.price,
        d.d_id,
        u.active
FROM "user" u
LEFT JOIN patient p ON p.u_id = u.u_id
LEFT JOIN doctor  d ON d.u_id = u.u_id
LEFT JOIN staff   s ON s.u_id = u.u_id
LEFT JOIN admin   a ON a.u_id = u.u_id
ORDER BY u.u_id;
