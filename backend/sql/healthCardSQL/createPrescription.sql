CREATE SEQUENCE IF NOT EXISTS prescription_seq START 5;

INSERT INTO prescription (
    p_id,
    hc_id,
    doc_id,
    prescription_date,
    usage_info
)
VALUES (
    'PR' || LPAD(NEXTVAL('prescription_seq')::TEXT, 3, '0'),                      -- Unique prescription ID
    (SELECT hc_id FROM patient WHERE u_id = %s),  -- Patient's health card ID, retrieved by patient ID
    %s,                     -- Doctor's user ID (must exist in doctor table)
    CURRENT_DATE,                -- Prescription date (today's date)
    %s  -- Usage instructions
) RETURNING p_id;
