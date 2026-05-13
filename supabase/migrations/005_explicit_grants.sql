-- Explicit Data API grants for existing tables
-- Required by Supabase policy change: May 30 2026 (new projects), Oct 30 2026 (all projects)
-- Without these, supabase-js / PostgREST returns 42501 errors after Oct 30.
-- RLS policies still enforce row-level access — grants only open the table to the role.

-- ── promos ──────────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.promos TO service_role;

-- ── canva_tokens ─────────────────────────────────────────────────────────────
-- authenticated can only SELECT (writes go through service_role in OAuth callback)
GRANT SELECT                         ON public.canva_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canva_tokens TO service_role;
