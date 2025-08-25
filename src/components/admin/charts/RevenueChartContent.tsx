import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

export default function RevenueChartContent() {
  const [data, setData] = useState<Array<{ date: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Fetch actual crypto payments data instead of consultations
        const { data: cryptoPayments, error } = await supabase
          .from('crypto_payments')
          .select('amount_usd, status, created_at')
          .eq('status', 'completed')
          .gte('created_at', subDays(new Date(), 30).toISOString());

        if (error) {
          return;
        }

        // Process real payment data
        const dailyRevenue = (cryptoPayments || []).reduce((acc: Record<string, number>, payment) => {
          const date = format(new Date(payment.created_at), 'MMM dd');
          acc[date] = (acc[date] || 0) + Number(payment.amount_usd);
          return acc;
        }, {});

        // Create chart data for last 30 days
        const chartData = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(new Date(), 29 - i);
          const dateKey = format(date, 'MMM dd');
          return {
            date: dateKey,
            revenue: dailyRevenue[dateKey] || 0
          };
        });

        setData(chartData);
      } catch (error) {
        // Error is handled by showing loading state or sample data
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
    return <div className="w-full h-full animate-pulse bg-muted rounded"></div>;
  }

  const formatYAxisTick = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tickFormatter={formatYAxisTick}
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
    </ChartContainer>
  );
}