-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Create policies for resource uploads
CREATE POLICY "Allow public read access to resources" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Allow admin upload to resources" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resources' AND is_admin(auth.uid()));

CREATE POLICY "Allow admin update to resources" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resources' AND is_admin(auth.uid()));

CREATE POLICY "Allow admin delete from resources" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resources' AND is_admin(auth.uid()));