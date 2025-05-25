UPDATE medical_equipment
SET              -- New format (optional)
    amount = %s                  -- New amount
WHERE me_id = %s;                -- Specify the equipment ID to update
