import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentStatusChartContent() {
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

        // If no consultations exist, show sample data
        if (!consultations || consultations.length === 0) {
          const sampleData = [
            { name: "Paid", value: 15, color: "#10b981" },
            { name: "Pending", value: 3, color: "#f59e0b" },
            { name: "Unpaid", value: 2, color: "#ef4444" }
          ];
          setData(sampleData);
          setLoading(false);
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
          paid: "#10b981",
          pending: "#f59e0b",
          unpaid: "#ef4444",
          failed: "#6b7280"
        };

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: statusColors[status] || "#8b5cf6"
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
    return <div className="h-48 sm:h-64 lg:h-[300px] animate-pulse bg-muted rounded"></div>;
  }

  const isMobile = window.innerWidth < 640;

  return (
    <>
      <ChartContainer config={chartConfig} className="h-48 sm:h-64 lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 70 : 100}
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
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 justify-center px-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}