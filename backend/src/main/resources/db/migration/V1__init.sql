CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE shops (
    id            BIGSERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    type          TEXT NOT NULL,
    address       TEXT,
    city          TEXT,
    postal_code   TEXT,
    location      geography(Point, 4326) NOT NULL,
    qvik_verified BOOLEAN NOT NULL DEFAULT FALSE,
    sponsored     BOOLEAN NOT NULL DEFAULT FALSE,
    sponsor_tier  INT     NOT NULL DEFAULT 0,
    website       TEXT,
    source        TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Spatial index: makes "find shops within X km" fast.
CREATE INDEX idx_shops_location ON shops USING GIST (location);
-- Regular indexes for common filters:
CREATE INDEX idx_shops_city ON shops (city);
CREATE INDEX idx_shops_type ON shops (type);
