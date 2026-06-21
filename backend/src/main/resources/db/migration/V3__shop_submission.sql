CREATE TABLE shop_submissions (
    id           BIGSERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    type         TEXT,
    address      TEXT,
    city         TEXT,
    postal_code  TEXT,
    website      TEXT,
    note         TEXT,
    lat          DOUBLE PRECISION,   -- if the user dropped a pin
    lng          DOUBLE PRECISION,
    submitter_ip INET,               -- for rate-limiting / abuse handling
    status       TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at  TIMESTAMPTZ
);
CREATE INDEX idx_submissions_status ON shop_submissions (status);
