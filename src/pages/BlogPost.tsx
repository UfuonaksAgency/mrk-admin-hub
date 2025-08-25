import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useBlogViewTracking } from "@/hooks/useBlogViewTracking";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { logger } from "@/lib/logger";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number | null;
  reading_time: number | null;
  created_at: string;
  published_at: string | null;
  featured_image_url: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackBlogView } = useBlogViewTracking();

  useEffect(() => {
    if (!slug) return;

    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (fetchError) {
          logger.error('Error fetching blog post:', fetchError);
          setError('Failed to load blog post');
          return;
        }

        if (!data) {
          setError('Blog post not found');
          return;
        }

        setBlogPost(data);
        
        // Track view after successful fetch
        await trackBlogView(data.id);
      } catch (err) {
        logger.error('Error in fetchBlogPost:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug, trackBlogView]);

  // Update document title and meta description
  useEffect(() => {
    if (blogPost) {
      document.title = blogPost.seo_title || blogPost.title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', blogPost.seo_description || blogPost.excerpt || '');
      }
    }

    // Cleanup
    return () => {
      document.title = 'TradeWithMrK'; // Reset to default
    };
  }, [blogPost]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || 'Blog post not found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {blogPost.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {blogPost.is_featured && (
                <Badge variant="default">Featured</Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {blogPost.title}
            </h1>

            {blogPost.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {blogPost.excerpt}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {blogPost.published_at 
                    ? format(new Date(blogPost.published_at), 'MMMM d, yyyy')
                    : format(new Date(blogPost.created_at), 'MMMM d, yyyy')
                  }
                </span>
              </div>
              
              {blogPost.reading_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blogPost.reading_time} min read</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{(blogPost.view_count || 0) + 1} views</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {blogPost.featured_image_url && (
            <div className="mb-8">
              <img
                src={blogPost.featured_image_url}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <Separator className="mb-8" />

          {/* Article Content */}
          <Card>
            <CardContent className="prose prose-lg max-w-none p-8">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {blogPost.content}
              </div>
            </CardContent>
          </Card>

          {/* Article Footer */}
          <footer className="mt-8 pt-8 border-t">
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(blogPost.created_at), 'MMMM d, yyyy')}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}