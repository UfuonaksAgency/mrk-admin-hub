import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { logger } from "@/lib/logger";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_featured: boolean;
  view_count: number | null;
  reading_time: number | null;
  published_at: string | null;
  featured_image_url: string | null;
  tags: string[];
}

export function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, is_featured, view_count, reading_time, published_at, featured_image_url, tags')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) {
          logger.error('Error fetching blog posts:', error);
          return;
        }

        setBlogPosts(data || []);
      } catch (error) {
        logger.error('Error in fetchBlogPosts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPosts = filteredPosts.filter(post => post.is_featured);
  const regularPosts = filteredPosts.filter(post => !post.is_featured);

  // Update document title
  useEffect(() => {
    document.title = 'Blog - TradeWithMrK';
    return () => {
      document.title = 'TradeWithMrK';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent mb-4">
            Trading Insights & Education
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn advanced trading strategies, market analysis, and expert insights from Mr.K's years of trading experience.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-1"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {searchQuery ? 'No articles found' : 'No articles available'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search terms.' : 'Check back soon for new content.'}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
                  <Badge variant="default">Featured</Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Separator */}
            {featuredPosts.length > 0 && regularPosts.length > 0 && (
              <Separator />
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <section>
                {featuredPosts.length > 0 && (
                  <h2 className="text-2xl font-bold text-foreground mb-6">Latest Articles</h2>
                )}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${featured ? 'ring-2 ring-primary/20' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Featured Image */}
        {post.featured_image_url ? (
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {featured && (
              <Badge className="absolute top-3 left-3" variant="default">
                Featured
              </Badge>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-primary opacity-10 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold text-lg text-muted-foreground">Trading Insights</h3>
              <p className="text-sm text-muted-foreground">Mr.K's Trading Blog</p>
            </div>
          </div>
        )}

        <CardHeader>
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h3 className="font-bold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {post.published_at 
                    ? format(new Date(post.published_at), 'MMM d, yyyy')
                    : 'Recently'
                  }
                </span>
              </div>
              
              {post.reading_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.reading_time} min</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{post.view_count || 0} views</span>
            </div>
          </div>
        </CardHeader>
      </Link>
    </Card>
  );
}