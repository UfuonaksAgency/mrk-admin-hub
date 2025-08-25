import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export const useBlogViewTracking = () => {
  const trackBlogView = async (blogPostId: string) => {
    try {
      // First get the current view count, then increment it
      const { data: currentPost } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', blogPostId)
        .eq('is_published', true)
        .single();

      if (!currentPost) {
        logger.error('Blog post not found or not published');
        return;
      }

      const newViewCount = (currentPost.view_count || 0) + 1;

      // Update view count
      const { error } = await supabase
        .from('blog_posts')
        .update({ view_count: newViewCount })
        .eq('id', blogPostId)
        .eq('is_published', true);

      if (error) {
        logger.error('Failed to track blog view:', error);
        return;
      }

      // Track analytics event
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: 'blog_post_view',
          event_data: {
            blog_post_id: blogPostId,
            timestamp: new Date().toISOString()
          },
          user_ip: null, // Can be populated if available
          user_agent: navigator.userAgent,
          session_id: sessionStorage.getItem('session_id') || 'anonymous'
        }]);

      logger.info('Blog view tracked successfully:', { blogPostId });
    } catch (error) {
      logger.error('Error tracking blog view:', error);
    }
  };

  return { trackBlogView };
};