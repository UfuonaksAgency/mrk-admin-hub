import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Download, Calendar, FileText } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'consultation' | 'download' | 'blog' | 'mentorship';
  title: string;
  user?: string;
  timestamp: string;
  status?: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'consultation',
    title: 'New consultation request',
    user: 'John Doe',
    timestamp: '2 minutes ago',
    status: 'pending'
  },
  {
    id: '2',
    type: 'download',
    title: 'Trading Guide PDF downloaded',
    user: 'Jane Smith',
    timestamp: '15 minutes ago'
  },
  {
    id: '3',
    type: 'blog',
    title: 'Published: Market Analysis Tips',
    timestamp: '1 hour ago',
    status: 'published'
  },
  {
    id: '4',
    type: 'mentorship',
    title: 'New mentorship application',
    user: 'Mike Johnson',
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: '5',
    type: 'download',
    title: 'Risk Management Checklist downloaded',
    user: 'Sarah Wilson',
    timestamp: '3 hours ago'
  }
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'consultation':
      return Calendar;
    case 'download':
      return Download;
    case 'blog':
      return FileText;
    case 'mentorship':
      return User;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => {
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
                {activity.user && (
                  <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}