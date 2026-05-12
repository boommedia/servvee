-- Servvee — initial schema
-- Run in Supabase SQL Editor or via `supabase db push`

-- ── promos ──────────────────────────────────────────────────────────────────
-- One table for both standard menus (start_date IS NULL) and
-- holiday overrides (start_date + end_date set).
-- Resolution priority: active holiday in range → active standard.

CREATE TABLE IF NOT EXISTS promos (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT        NOT NULL,
    slot        TEXT        NOT NULL DEFAULT 'default',
    source      TEXT        NOT NULL DEFAULT 'canva'  -- 'canva' | 'adobe' | 'url'
                            CHECK (source IN ('canva', 'adobe', 'url')),
    design_id   TEXT        NOT NULL,   -- Canva ID, Adobe share URL, or raw embed URL
    start_date  DATE,                   -- NULL = no date restriction (standard menu)
    end_date    DATE,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    page_url    TEXT        NOT NULL DEFAULT '',  -- used for QR code
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT dates_both_or_none CHECK (
        (start_date IS NULL AND end_date IS NULL) OR
        (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date >= start_date)
    )
);

CREATE INDEX IF NOT EXISTS idx_promos_user_slot ON promos (user_id, slot);
CREATE INDEX IF NOT EXISTS idx_promos_dates ON promos (start_date, end_date);

-- ── Row-Level Security ───────────────────────────────────────────────────────
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own promos"
    ON promos FOR ALL
    USING  (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ── Helper: resolve active promo for embed ───────────────────────────────────
-- Called by the embed API route via RPC with service-role key.
-- Returns the best promo for (p_user_id, p_slot) on today's date.
CREATE OR REPLACE FUNCTION resolve_active_promo(p_user_id UUID, p_slot TEXT)
RETURNS TABLE (
    id          UUID,
    name        TEXT,
    slot        TEXT,
    source      TEXT,
    design_id   TEXT
) LANGUAGE sql SECURITY DEFINER AS $$
    -- 1. Holiday override in range
    SELECT id, name, slot, source, design_id
    FROM   promos
    WHERE  user_id   = p_user_id
      AND  slot      = p_slot
      AND  is_active = TRUE
      AND  start_date IS NOT NULL
      AND  start_date <= CURRENT_DATE
      AND  end_date   >= CURRENT_DATE
    ORDER BY start_date DESC
    LIMIT 1

    UNION ALL

    -- 2. Standard (no-date) fallback
    SELECT id, name, slot, source, design_id
    FROM   promos
    WHERE  user_id   = p_user_id
      AND  slot      = p_slot
      AND  is_active = TRUE
      AND  start_date IS NULL
    ORDER BY created_at DESC
    LIMIT 1

    LIMIT 1;
$$;
