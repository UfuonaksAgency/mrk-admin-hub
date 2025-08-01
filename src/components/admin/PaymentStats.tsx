import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, TrendingUp, Clock } from "lucide-react";

interface CryptoPayment {
  id: string;
  amount_usd: number;
  status: string;
  created_at: string;
}

interface PaymentStatsProps {
  payments: CryptoPayment[];
}

export function PaymentStats({ payments }: PaymentStatsProps) {
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount_usd), 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const totalPayments = payments.length;

  const conversionRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "From completed payments",
      icon: DollarSign,
      trend: "+12% from last month"
    },
    {
      title: "Pending Payments",
      value: pendingPayments.toString(),
      description: "Awaiting confirmation",
      icon: Clock,
      trend: `${totalPayments} total payments`
    },
    {
      title: "Payment Success Rate",
      value: `${conversionRate.toFixed(1)}%`,
      description: "Conversion rate",
      icon: TrendingUp,
      trend: `${completedPayments}/${totalPayments} completed`
    },
    {
      title: "Active Payments",
      value: totalPayments.toString(),
      description: "All payment records",
      icon: CreditCard,
      trend: "All time"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}