-- Canva OAuth tokens (one per user, upserted on reconnect)
CREATE TABLE IF NOT EXISTS canva_tokens (
  user_id       UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token  TEXT        NOT NULL,
  refresh_token TEXT,
  expires_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Data API grants (required post-Oct 2026 Supabase policy change) ──────────
GRANT SELECT                         ON public.canva_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canva_tokens TO service_role;

ALTER TABLE canva_tokens ENABLE ROW LEVEL SECURITY;

-- Users can read their own row; all writes go through service role
CREATE POLICY "Users read own Canva token"
  ON canva_tokens FOR SELECT
  USING (auth.uid() = user_id);
