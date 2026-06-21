ALTER TABLE shop_submissions
    ADD COLUMN IF NOT EXISTS qvik_verified BOOLEAN NOT NULL DEFAULT false;
