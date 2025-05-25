-- backend/sql/registration.sql
-- Creates a new "user" and a matching "patient" record in one atomic transaction

INSERT INTO "user" (
    u_id,
    name,
    surname,
    email_address,
    password,
    phone_no
) VALUES (
    %(u_id)s,
    %(name)s,
    %(surname)s,
    %(email)s,
    %(password)s,
    %(phone)s
);

INSERT INTO patient (
    u_id,
    hc_id,
    balance
) VALUES (
    %(u_id)s,
    %(hc_id)s,
    0.00
);
