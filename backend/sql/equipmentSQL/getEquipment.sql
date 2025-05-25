SELECT 
    me.me_id AS id,
    me.name AS name,
    me.format AS format,
    me.amount AS amount
FROM medical_equipment me
ORDER BY me.name;
