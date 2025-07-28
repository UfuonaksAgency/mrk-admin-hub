-- Fix security warnings by updating function search paths
ALTER FUNCTION public.is_admin(uuid) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;