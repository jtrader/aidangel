-- Migration: create SQL functions to support admin edge functions
-- Adds helper to check admin role via has_role and grants

-- has_role already exists in earlier migrations — we depend on it here.

-- No schema changes required; this migration documents requirements for role checks.

COMMENT ON FUNCTION public.has_role(uuid, public.app_role) IS 'Used by admin edge functions to check if a user has admin role';
