import { ChartWrapper } from "@/components/ui/chart-wrapper";
import PaymentStatusChartContent from "@/components/admin/charts/PaymentStatusChartContent";

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