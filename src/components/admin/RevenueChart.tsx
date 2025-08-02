import { ChartWrapper } from "@/components/ui/chart-wrapper";
import RevenueChartContent from "@/components/admin/charts/RevenueChartContent";

export function RevenueChart() {
  return (
    <ChartWrapper 
      title="Daily Revenue" 
      description="Revenue trend over the last 30 days"
    >
      <RevenueChartContent />
    </ChartWrapper>
  );
}