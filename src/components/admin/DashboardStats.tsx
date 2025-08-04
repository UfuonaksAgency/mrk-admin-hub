import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
}

function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-elegant transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {trend && (
            <span className="text-success inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    publishedPosts: 0,
    totalResources: 0,
    activeResources: 0,
    totalDownloads: 0,
    analyticsEvents: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    growthPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogResult, resourcesResult, downloadsResult, analyticsResult, consultationsResult] = await Promise.all([
          supabase.from('blog_posts').select('id, is_published'),
          supabase.from('free_resources').select('id, is_active'),
          supabase.from('resource_downloads').select('id'),
          supabase.from('analytics_events').select('id'),
          supabase.from('consultations').select('id, payment_status, created_at')
        ]);

        const blogPosts = blogResult.data || [];
        const resources = resourcesResult.data || [];
        const consultations = consultationsResult.data || [];
        
        // Calculate payment statistics from consultations
        const paidConsultations = consultations.filter(c => c.payment_status === 'paid');
        const totalRevenue = paidConsultations.length * 300; // Assuming $300 per consultation
        const pendingPayments = consultations.filter(c => c.payment_status === 'pending').length;
        
        // Calculate growth (compare with last month)
        const thisMonth = new Date();
        const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
        const thisMonthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        
        const thisMonthPaid = consultations.filter(c => 
          c.payment_status === 'paid' && 
          new Date(c.created_at) >= thisMonthStart
        ).length;
        
        const lastMonthPaid = consultations.filter(c => 
          c.payment_status === 'paid' && 
          new Date(c.created_at) >= lastMonth && 
          new Date(c.created_at) < thisMonthStart
        ).length;
        
        const growthPercentage = lastMonthPaid > 0 
          ? Math.round(((thisMonthPaid - lastMonthPaid) / lastMonthPaid) * 100)
          : thisMonthPaid > 0 ? 100 : 0;
        
        setStats({
          blogPosts: blogPosts.length,
          publishedPosts: blogPosts.filter(post => post.is_published).length,
          totalResources: resources.length,
          activeResources: resources.filter(resource => resource.is_active).length,
          totalDownloads: downloadsResult.data?.length || 0,
          analyticsEvents: analyticsResult.data?.length || 0,
          totalRevenue: totalRevenue,
          pendingPayments: pendingPayments,
          growthPercentage: growthPercentage
        });
      } catch (error) {
        // Error is handled by showing loading state
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Blog Posts"
        value={stats.blogPosts}
        description={`${stats.publishedPosts} published`}
        icon={FileText}
      />
      <StatCard
        title="Free Resources"
        value={stats.totalResources}
        description={`${stats.activeResources} active`}
        icon={Download}
      />
      <StatCard
        title="Resource Downloads"
        value={stats.totalDownloads}
        description="Total downloads"
        icon={Users}
      />
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        description={`${stats.pendingPayments} pending payments`}
        icon={DollarSign}
        trend={stats.growthPercentage > 0 ? `+${stats.growthPercentage}% this month` : stats.growthPercentage < 0 ? `${stats.growthPercentage}% this month` : "No change this month"}
      />
      <StatCard
        title="Site Activity"
        value={stats.analyticsEvents}
        description="Analytics events"
        icon={TrendingUp}
      />
    </div>
  );
}