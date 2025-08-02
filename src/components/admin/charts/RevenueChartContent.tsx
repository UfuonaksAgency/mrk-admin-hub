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
          console.error('Error fetching revenue data:', error);
          return;
        }

        // Generate sample data if no consultations exist
        if (!consultations || consultations.length === 0) {
          const sampleData = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), 29 - i);
            return {
              date: format(date, 'MMM dd'),
              revenue: Math.floor(Math.random() * 2000) + 500
            };
          });
          setData(sampleData);
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
    return <div className="w-full h-full animate-pulse bg-muted rounded"></div>;
  }

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="w-full h-full grid place-items-center">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 20, right: 20, left: 60, bottom: 40 }}
            className="chart-container"
          >
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'hsl(var(--muted-foreground))', 
                fontSize: 'clamp(10px, 2vw, 14px)',
                fontWeight: 500
              }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'hsl(var(--muted-foreground))', 
                fontSize: 'clamp(10px, 2vw, 14px)',
                fontWeight: 500
              }}
              tickFormatter={formatYAxisTick}
              width={60}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: any) => [`$${value.toLocaleString()}`, "Revenue"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ 
                fill: "hsl(var(--primary))", 
                strokeWidth: 2, 
                r: 4 
              }}
              activeDot={{ 
                r: 6, 
                stroke: "hsl(var(--primary))", 
                strokeWidth: 2,
                fill: "hsl(var(--background))"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}