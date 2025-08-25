import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PaymentStats } from "@/components/admin/PaymentStats";
import { PaymentTable } from "@/components/admin/PaymentTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { PaymentStatusChart } from "@/components/admin/PaymentStatusChart";
import { Loader2 } from "lucide-react";

interface CryptoPayment {
  id: string;
  amount_usd: number;
  amount_crypto?: number;
  coin_type: string;
  status: string;
  payment_address: string;
  transaction_hash?: string;
  created_at: string;
  expires_at: string;
  consultation_id?: string;
  consultations?: {
    name: string;
    email: string;
    status: string;
  };
}

export function AdminPayments() {
  const [payments, setPayments] = useState<CryptoPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Fetch real crypto payments data with consultation details
      const { data: cryptoPayments, error } = await supabase
        .from('crypto_payments')
        .select(`
          *,
          consultations (
            name,
            email,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return;
      }

      setPayments(cryptoPayments as CryptoPayment[]);
    } catch (error) {
      // Error is handled by showing loading state or sample data
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage cryptocurrency payments and consultation bookings.
          </p>
        </div>

        <PaymentStats payments={payments} />

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart />
          <PaymentStatusChart />
        </div>

        <PaymentTable payments={payments} onRefresh={fetchPayments} />
      </div>
    </AdminLayout>
  );
}