-- Add updated_at trigger to free_resources table
CREATE TRIGGER update_free_resources_updated_at
BEFORE UPDATE ON public.free_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();