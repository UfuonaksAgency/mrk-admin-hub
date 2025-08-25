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
        // Fetch actual crypto payments data instead of consultations
        const { data: cryptoPayments, error } = await supabase
          .from('crypto_payments')
          .select('status');

        if (error) {
          return;
        }

        if (!cryptoPayments || cryptoPayments.length === 0) {
          setData([]);
          setLoading(false);
          return;
        }

        // Count crypto payments by status
        const statusCounts = (cryptoPayments || []).reduce((acc: Record<string, number>, payment) => {
          const status = payment.status || 'pending';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart data format with colors
        const statusColors: Record<string, string> = {
          completed: "#10b981",
          pending: "#f59e0b",
          failed: "#ef4444",
          expired: "#6b7280"
        };

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
          color: statusColors[status] || "#8b5cf6"
        }));

        setData(chartData);
      } catch (error) {
        // Error is handled by showing loading state or sample data
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
    return <div className="w-full h-full animate-pulse bg-muted rounded"></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="flex-1 w-full max-w-sm">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="80%"
                paddingAngle={4}
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
        </ChartContainer>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}