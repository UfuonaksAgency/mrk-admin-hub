import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PaymentStats } from "@/components/admin/PaymentStats";
import { PaymentTable } from "@/components/admin/PaymentTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
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
    try {
      // For now, let's use mock data since crypto_payments might not be in types yet
      const mockPayments: CryptoPayment[] = [
        {
          id: "1",
          amount_usd: 300,
          amount_crypto: 0.01,
          coin_type: "BTC",
          status: "pending",
          payment_address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          transaction_hash: "abc123def456",
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          consultation_id: "cons-1",
          consultations: {
            name: "John Doe",
            email: "john@example.com",
            status: "confirmed"
          }
        }
      ];
      setPayments(mockPayments);
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

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              All cryptocurrency payments and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentTable payments={payments} onRefresh={fetchPayments} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}