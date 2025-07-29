-- Add external_link column to free_resources table
ALTER TABLE public.free_resources 
ADD COLUMN external_link TEXT;