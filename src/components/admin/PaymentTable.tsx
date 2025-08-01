import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, ExternalLink, Copy } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

interface PaymentTableProps {
  payments: CryptoPayment[];
  onRefresh: () => void;
}

export function PaymentTable({ payments, onRefresh }: PaymentTableProps) {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<CryptoPayment | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      completed: "default",
      failed: "destructive",
      expired: "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const openExplorer = (hash: string, coinType: string) => {
    const explorers = {
      BTC: `https://blockstream.info/tx/${hash}`,
      ETH: `https://etherscan.io/tx/${hash}`,
      LTC: `https://blockexplorer.one/litecoin/mainnet/tx/${hash}`
    };
    
    const url = explorers[coinType as keyof typeof explorers] || `https://blockstream.info/tx/${hash}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">${payment.amount_usd}</div>
                  {payment.amount_crypto && (
                    <div className="text-sm text-muted-foreground">
                      {payment.amount_crypto} {payment.coin_type}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                <Badge variant="outline">{payment.coin_type}</Badge>
              </TableCell>
              <TableCell>
                {payment.consultations ? (
                  <div>
                    <div className="font-medium">{payment.consultations.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.consultations.email}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">No consultation</span>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Payment Details</DialogTitle>
                      <DialogDescription>
                        Payment ID: {payment.id}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedPayment && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Amount USD</label>
                            <p>${selectedPayment.amount_usd}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Coin Type</label>
                            <p>{selectedPayment.coin_type}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Amount Crypto</label>
                            <p>{selectedPayment.amount_crypto || 'Not set'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Payment Address</label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted p-2 rounded flex-1 break-all">
                              {selectedPayment.payment_address}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(selectedPayment.payment_address, "Payment address")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {selectedPayment.transaction_hash && (
                          <div>
                            <label className="text-sm font-medium">Transaction Hash</label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-sm bg-muted p-2 rounded flex-1 break-all">
                                {selectedPayment.transaction_hash}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(selectedPayment.transaction_hash!, "Transaction hash")}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openExplorer(selectedPayment.transaction_hash!, selectedPayment.coin_type)}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Created At</label>
                            <p>{format(new Date(selectedPayment.created_at), 'PPpp')}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Expires At</label>
                            <p>{format(new Date(selectedPayment.expires_at), 'PPpp')}</p>
                          </div>
                        </div>

                        {selectedPayment.consultations && (
                          <div>
                            <label className="text-sm font-medium">Consultation Details</label>
                            <div className="mt-1 p-3 bg-muted rounded">
                              <p><strong>Name:</strong> {selectedPayment.consultations.name}</p>
                              <p><strong>Email:</strong> {selectedPayment.consultations.email}</p>
                              <p><strong>Status:</strong> {selectedPayment.consultations.status}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {payments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No payments found
        </div>
      )}
    </>
  );
}