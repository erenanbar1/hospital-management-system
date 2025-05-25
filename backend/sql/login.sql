-- backend/sql/login.sql
-- Returns (u_id, role, name, surname) if email & password match any patient/doctor/staff/admin

(
  SELECT u.u_id, 'patient' AS role, u.name, u.surname
    FROM "user" u
    JOIN patient    p ON u.u_id = p.u_id
   WHERE u.email_address = %s
     AND u.password      = %s
)
UNION
(
  SELECT u.u_id, 'doctor'  AS role, u.name, u.surname
    FROM "user" u
    JOIN doctor     d ON u.u_id = d.u_id
   WHERE u.email_address = %s
     AND u.password      = %s
)
UNION
(
  SELECT u.u_id, 'staff'   AS role, u.name, u.surname
    FROM "user" u
    JOIN staff      s ON u.u_id = s.u_id
   WHERE u.email_address = %s
     AND u.password      = %s
)
UNION
(
  SELECT u.u_id, 'admin'   AS role, u.name, u.surname
    FROM "user" u
    JOIN admin      a ON u.u_id = a.u_id
   WHERE u.email_address = %s
     AND u.password      = %s
);
