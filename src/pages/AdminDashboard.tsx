import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { PaymentStatusChart } from "@/components/admin/PaymentStatusChart";

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your trading agency.
          </p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <PaymentStatusChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="space-y-6">
            {/* Quick Actions could go here */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}