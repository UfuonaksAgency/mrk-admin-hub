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
  
  // Calculate optimal tick interval based on data length and screen size
  const getTickInterval = () => {
    if (data.length <= 7) return 0; // Show all ticks for small datasets
    if (isMobile) return Math.ceil(data.length / 3); // Show ~3 ticks on mobile
    if (isTablet) return Math.ceil(data.length / 5); // Show ~5 ticks on tablet
    return Math.ceil(data.length / 7); // Show ~7 ticks on desktop
  };

  // Improved formatting for X-axis readability
  const formatXAxisTick = (value: string) => {
    if (isMobile) {
      // Convert to short format: "Dec 15" -> "12/15"
      return value.replace(/(\w{3}) (\d+)/, (match, month, day) => {
        const monthMap: { [key: string]: string } = {
          'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6',
          'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        return `${monthMap[month]}/${day}`;
      });
    }
    return value;
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  // Calculate dynamic margins for proper centering
  const getMargins = () => {
    return {
      top: isMobile ? 15 : 20,
      right: isMobile ? 20 : 30,
      left: isMobile ? 55 : isTablet ? 65 : 75,
      bottom: isMobile ? 45 : 35
    };
  };

  return (
    <div className="w-full h-48 sm:h-64 lg:h-[300px] flex items-center justify-center">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={getMargins()}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'hsl(var(--muted-foreground))', 
                fontSize: isMobile ? 12 : isTablet ? 13 : 14,
                fontWeight: 500
              }}
              tickFormatter={formatXAxisTick}
              interval={getTickInterval()}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 45 : 35}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: 'hsl(var(--muted-foreground))', 
                fontSize: isMobile ? 12 : isTablet ? 13 : 14,
                fontWeight: 500
              }}
              tickFormatter={formatYAxisTick}
              width={isMobile ? 55 : isTablet ? 65 : 75}
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
              strokeWidth={isMobile ? 2.5 : 3}
              dot={{ 
                fill: "hsl(var(--primary))", 
                strokeWidth: 2, 
                r: isMobile ? 3 : 4 
              }}
              activeDot={{ 
                r: isMobile ? 5 : 6, 
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