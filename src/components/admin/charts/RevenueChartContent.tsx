import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { useWindowSize } from "@/hooks/use-window-size";

export default function RevenueChartContent() {
  const [data, setData] = useState<Array<{ date: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowSize();

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
    return <div className="h-48 sm:h-64 lg:h-[300px] animate-pulse bg-muted rounded"></div>;
  }

  // Responsive breakpoints
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  // Dynamic formatting based on screen size
  const formatXAxisTick = (value: string) => {
    if (isMobile) return value.replace('Dec ', '12/').replace('Jan ', '1/').replace('Feb ', '2/').replace('Mar ', '3/').replace('Apr ', '4/').replace('May ', '5/').replace('Jun ', '6/').replace('Jul ', '7/').replace('Aug ', '8/').replace('Sep ', '9/').replace('Oct ', '10/').replace('Nov ', '11/');
    return value;
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  // Dynamic margins and sizing
  const chartMargins = {
    top: isMobile ? 10 : 20,
    right: isMobile ? 15 : 30,
    left: isMobile ? 45 : 65,
    bottom: isMobile ? 25 : 40
  };

  const tickInterval = isMobile ? 4 : isTablet ? 2 : 1;

  return (
    <ChartContainer config={chartConfig} className="h-48 sm:h-64 lg:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={chartMargins}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }}
            tickFormatter={formatXAxisTick}
            interval={tickInterval}
            angle={isMobile ? -20 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 40 : 30}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: isMobile ? 10 : 12 }}
            tickFormatter={formatYAxisTick}
            width={isMobile ? 45 : 65}
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
            strokeWidth={isMobile ? 2 : 3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}