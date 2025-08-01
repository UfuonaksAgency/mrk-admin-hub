import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export function RevenueChart() {
  const [data, setData] = useState<Array<{ date: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const { data: consultations, error } = await supabase
          .from('consultations')
          .select('payment_status, created_at')
          .eq('payment_status', 'paid')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching revenue data:', error);
          return;
        }

        // Group consultations by day (assuming $300 per consultation)
        const revenueByDay = (consultations || []).reduce((acc: Record<string, number>, consultation) => {
          const date = new Date(consultation.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 300; // $300 per consultation
          return acc;
        }, {});

        // Convert to chart data format
        const chartData = Object.entries(revenueByDay)
          .map(([date, revenue]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: revenue
          }))
          .slice(-30); // Last 30 days

        setData(chartData);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
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
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">Revenue Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Daily revenue from completed payments</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: any) => [`$${value}`, "Revenue"]}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}