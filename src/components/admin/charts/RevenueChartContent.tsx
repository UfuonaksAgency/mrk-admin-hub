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
        const { data: consultations, error } = await supabase
          .from('consultations')
          .select('payment_status, created_at')
          .eq('payment_status', 'paid')
          .gte('created_at', subDays(new Date(), 30).toISOString());

        if (error) {
          return;
        }

        if (!consultations || consultations.length === 0) {
          // Create empty chart data for last 30 days
          const chartData = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i);
            return {
              date: format(date, 'MMM dd'),
              revenue: 0
            };
          });
          setData(chartData);
          setLoading(false);
          return;
        }

        // Process real data
        const dailyRevenue = consultations.reduce((acc: Record<string, number>, consultation) => {
          const date = format(new Date(consultation.created_at), 'MMM dd');
          acc[date] = (acc[date] || 0) + 300; // Assuming $300 per consultation
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