INSERT INTO medical_equipment (me_id, name, format, amount)
VALUES (%s, %s, %s, %s)
RETURNING me_id, name, format, amount; 