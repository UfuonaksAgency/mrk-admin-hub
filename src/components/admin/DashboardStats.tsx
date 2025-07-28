import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, FileText, Download, Calendar, GraduationCap } from "lucide-react";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Blog Posts"
        value={24}
        description="Published articles"
        icon={FileText}
        trend="+12% from last month"
      />
      <StatCard
        title="Resource Downloads"
        value="1,234"
        description="This month"
        icon={Download}
        trend="+18% from last month"
      />
      <StatCard
        title="Consultation Requests"
        value={56}
        description="Pending responses"
        icon={Calendar}
        trend="+8% from last month"
      />
      <StatCard
        title="Mentorship Applications"
        value={23}
        description="Under review"
        icon={GraduationCap}
        trend="+25% from last month"
      />
      <StatCard
        title="Active Users"
        value="2,847"
        description="Monthly visitors"
        icon={Users}
        trend="+15% from last month"
      />
      <StatCard
        title="Membership Clicks"
        value={142}
        description="This week"
        icon={TrendingUp}
        trend="+22% from last week"
      />
    </div>
  );
}