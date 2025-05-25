CREATE SEQUENCE IF NOT EXISTS bt_id_seq START 3;

INSERT INTO blood_test (
    bt_id,
    hc_id,
    vitamins,
    minerals,
    cholesterol,
    glucose,
    hemoglobin,
    white_blood_cells,
    red_blood_cells,
    test_date
)
VALUES (
    'BT' || LPAD(NEXTVAL('bt_id_seq')::TEXT, 3, '0'),  -- Auto-generated ID like 'BT001'
    (SELECT hc_id FROM patient WHERE u_id = %s),
    %s,
    %s,
    %s,
    %s,
    %s,
    %s,
    %s,
    CURRENT_DATE  -- Or a specific date like '2025-05-25'
);
