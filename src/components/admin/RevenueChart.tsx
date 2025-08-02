import { createDynamicChart, ChartWrapper } from "@/components/ui/chart-wrapper";

const RevenueChartContent = createDynamicChart(
  () => import("@/components/admin/charts/RevenueChartContent")
);

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