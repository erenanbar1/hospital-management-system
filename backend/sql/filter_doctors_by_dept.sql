SELECT 
    d.u_id AS doctor_id,
    u.name AS doctor_name,
    u.surname AS doctor_surname,
    d.specialization,
    d.rating,
    d.price
FROM doctor d
JOIN "user" u ON d.u_id = u.u_id
JOIN department dept ON d.d_id = dept.d_id
WHERE dept.dept_name = %s;