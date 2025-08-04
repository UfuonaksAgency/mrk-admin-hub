import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'download' | 'blog';
  title: string;
  timestamp: string;
  status?: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'download':
      return Download;
    case 'blog':
      return FileText;
    default:
      return Clock;
  }
}

function getStatusBadge(status?: string) {
  if (!status) return null;
  
  const variant = status === 'published' ? 'default' : 
                 status === 'pending' ? 'secondary' : 'outline';
  
  return <Badge variant={variant} className="text-xs">{status}</Badge>;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Get recent downloads
        const { data: downloads } = await supabase
          .from('resource_downloads')
          .select(`
            id,
            downloaded_at,
            free_resources (title)
          `)
          .order('downloaded_at', { ascending: false })
          .limit(3);

        // Get recent blog posts
        const { data: posts } = await supabase
          .from('blog_posts')
          .select('id, title, created_at, is_published')
          .order('created_at', { ascending: false })
          .limit(3);

        const recentActivities: ActivityItem[] = [];

        // Add downloads
        downloads?.forEach(download => {
          if (download.free_resources) {
            recentActivities.push({
              id: download.id,
              type: 'download',
              title: `${download.free_resources.title} downloaded`,
              timestamp: new Date(download.downloaded_at).toLocaleString()
            });
          }
        });

        // Add blog posts
        posts?.forEach(post => {
          recentActivities.push({
            id: post.id,
            type: 'blog',
            title: post.title,
            timestamp: new Date(post.created_at).toLocaleString(),
            status: post.is_published ? 'published' : 'draft'
          });
        });

        // Sort by timestamp
        recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setActivities(recentActivities.slice(0, 5));
      } catch (error) {
        // Error is handled by showing loading state
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}