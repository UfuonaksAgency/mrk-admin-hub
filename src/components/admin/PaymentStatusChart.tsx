import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export function PaymentStatusChart() {
  const [data, setData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatusData = async () => {
      try {
        const { data: consultations, error } = await supabase
          .from('consultations')
          .select('payment_status');

        if (error) {
          console.error('Error fetching payment status data:', error);
          return;
        }

        // Count consultations by payment status
        const statusCounts = (consultations || []).reduce((acc: Record<string, number>, consultation) => {
          const status = consultation.payment_status || 'unpaid';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart data format with colors
        const statusColors: Record<string, string> = {
          paid: "hsl(var(--success))",
          pending: "hsl(var(--warning))",
          unpaid: "hsl(var(--destructive))",
          failed: "hsl(var(--muted-foreground))"
        };

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: statusColors[status] || "hsl(var(--primary))"
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching payment status data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatusData();
  }, []);

  const chartConfig = {
    value: {
      label: "Payments",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-elegant transition-shadow">
      <CardHeader>
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">Payment Status Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Breakdown of payment statuses</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: any, name: any) => [value, `${name} Payments`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}