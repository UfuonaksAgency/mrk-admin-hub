-- Create blog_images storage bucket for blog post images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog_images', 'blog_images', true);

-- Create policies for blog_images bucket
CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog_images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog_images' AND is_admin(auth.uid()));

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog_images' AND is_admin(auth.uid()));

CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog_images');