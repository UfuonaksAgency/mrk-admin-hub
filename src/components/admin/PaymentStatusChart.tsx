import { createDynamicChart, ChartWrapper } from "@/components/ui/chart-wrapper";

const PaymentStatusChartContent = createDynamicChart(
  () => import("@/components/admin/charts/PaymentStatusChartContent")
);

export function PaymentStatusChart() {
  return (
    <ChartWrapper 
      title="Payment Status Distribution" 
      description="Breakdown of payment statuses"
    >
      <PaymentStatusChartContent />
    </ChartWrapper>
  );
}