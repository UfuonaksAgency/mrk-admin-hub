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
        console.error('Error fetching payments:', error);
        return;
      }

      // If no payments exist, show sample data
      if (!cryptoPayments || cryptoPayments.length === 0) {
        const samplePayments: CryptoPayment[] = [
          {
            id: "sample-1",
            amount_usd: 300.00,
            amount_crypto: 0.0075,
            coin_type: "BTC",
            status: "completed",
            payment_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            transaction_hash: "3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9",
            consultation_id: "cons-1",
            created_at: "2024-01-15T10:30:00Z",
            expires_at: "2024-01-16T10:30:00Z",
            consultations: {
              name: "John Doe",
              email: "john@example.com",
              status: "confirmed"
            }
          },
          {
            id: "sample-2",
            amount_usd: 300.00,
            amount_crypto: 0.0076,
            coin_type: "BTC",
            status: "pending",
            payment_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            created_at: "2024-01-16T14:20:00Z",
            expires_at: "2024-01-17T14:20:00Z",
            consultation_id: "cons-2",
            consultations: {
              name: "Jane Smith",
              email: "jane@example.com",
              status: "pending"
            }
          },
          {
            id: "sample-3",
            amount_usd: 300.00,
            amount_crypto: 0.008,
            coin_type: "BTC",
            status: "completed",
            payment_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            transaction_hash: "4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0",
            consultation_id: "cons-3",
            created_at: "2024-01-14T09:15:00Z",
            expires_at: "2024-01-15T09:15:00Z",
            consultations: {
              name: "Mike Johnson",
              email: "mike@example.com",
              status: "confirmed"
            }
          }
        ];
        setPayments(samplePayments);
      } else {
        setPayments(cryptoPayments as CryptoPayment[]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
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