-- Update blood test results by blood test ID
UPDATE blood_test 
SET 
    vitamins = %s,
    minerals = %s,
    cholesterol = %s,
    glucose = %s,
    hemoglobin = %s,
    white_blood_cells = %s,
    red_blood_cells = %s,
    test_date = COALESCE(%s, test_date)  -- Update test_date only if provided, otherwise keep existing
WHERE bt_id = %s; 