-- getAllDepartments.sql
SELECT d.d_id,
       d.dept_name,
       d.employee_count,
       COUNT(doc.u_id) AS actual_doctor_count
FROM   department d
LEFT JOIN doctor doc ON doc.d_id = d.d_id
GROUP BY d.d_id, d.dept_name, d.employee_count
ORDER BY d.dept_name;
