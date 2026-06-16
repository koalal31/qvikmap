-- Columns and constraint needed by the shop crawler (a separate application that shares
-- this database). The website owns the schema, so these live here as a website migration.

ALTER TABLE shops ADD COLUMN IF NOT EXISTS source_id    TEXT;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS confidence   DOUBLE PRECISION;

-- Upsert key for the crawler: at most one row per (source, source_id).
-- Enables `INSERT ... ON CONFLICT (source, source_id) DO UPDATE`.
-- (Existing rows with NULL source/source_id are unaffected: PostgreSQL treats NULLs as
--  distinct in a unique index, so multiple manual NULL rows remain allowed.)
CREATE UNIQUE INDEX IF NOT EXISTS uq_shops_source_source_id
    ON shops (source, source_id);

-- Helps "show only fresh shops" queries and stale-record cleanup.
CREATE INDEX IF NOT EXISTS idx_shops_last_seen_at ON shops (last_seen_at);
