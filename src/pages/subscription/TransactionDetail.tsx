import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/data/mockSubscriptionData';
import { subscriptionPurchaseService } from '@/services/modules/subscription-purchase/subscriptionPurchase.service';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TransactionData {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  gstAmount: number;
  netAmount: number;
  createdAt: string;
  items: Array<{
    type: 'plan' | 'addon';
    code: string;
    name: string;
    amount: number;
  }>;
  gatewayTransactionId?: string;
}

interface CompanyProfile {
  companyName?: string;
  address?: string;
  gstin?: string;
  pan?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch transaction
        const response = await subscriptionPurchaseService.getTransactions();
        if (response.success && response.data?.transactions) {
          const found = response.data.transactions.find(
            (t: any) => t.transactionId === id || t.id === id
          );
          if (found) {
            const mappedTransaction: TransactionData = {
              id: found.id || found.transactionId,
              transactionId: found.transactionId,
              amount: found.amount,
              currency: found.currency || 'INR',
              status: found.status === 'success' ? 'success' : found.status === 'pending' ? 'pending' : 'failed',
              gstAmount: found.gstAmount || 0,
              netAmount: found.netAmount || (found.amount - (found.gstAmount || 0)),
              createdAt: found.createdAt,
              items: found.items || [],
              gatewayTransactionId: found.gatewayTransactionId
            };
            setTransaction(mappedTransaction);
          }
        }

        // Try to get company profile from localStorage or user context
        const storedProfile = localStorage.getItem('companyProfile');
        if (storedProfile) {
          setCompanyProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleExportPDF = async () => {
    if (!invoiceRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice-${transaction?.transactionId || 'unknown'}.pdf`);

      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export invoice');
    } finally {
      setIsExporting(false);
    }
  };

  // Status badge component for PDF (inline styles for better PDF export)
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'success') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 12px',
          backgroundColor: '#dcfce7',
          color: '#166534',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <CheckCircle style={{ width: '14px', height: '14px' }} />
          Paid
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 12px',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          <Clock style={{ width: '14px', height: '14px' }} />
          Pending
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 12px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600
      }}>
        <XCircle style={{ width: '14px', height: '14px' }} />
        Failed
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading invoice...</span>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The transaction you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/dashboard/subscription/transactions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = transaction.netAmount || (transaction.amount - transaction.gstAmount);
  const planItem = transaction.items?.find(i => i.type === 'plan');
  const addonItems = transaction.items?.filter(i => i.type === 'addon') || [];

  // Customer details
  const customerName = companyProfile?.companyName || (user as any)?.companyName || user?.name || 'Customer';
  const customerAddress = companyProfile?.address || (user as any)?.companyAddress || '';
  const customerCity = companyProfile?.city || '';
  const customerState = companyProfile?.state || '';
  const customerPincode = companyProfile?.pincode || '';
  const customerGstin = companyProfile?.gstin || (user as any)?.gstin || '';

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/subscription/transactions')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Button>
          <Button onClick={handleExportPDF} className="gap-2" disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </Button>
        </div>

        {/* Invoice Card */}
        <Card className="overflow-hidden shadow-lg">
          <div ref={invoiceRef} style={{
            backgroundColor: '#ffffff',
            padding: '48px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
          }}>
            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
              {/* Company Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {/* Logo */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '22px' }}>D</span>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>Diligince AI</h1>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Procurement Intelligence Platform</p>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 2px 0' }}>Diligince Technologies Pvt. Ltd.</p>
                  <p style={{ margin: '0 0 2px 0' }}>Bengaluru, Karnataka 560001, India</p>
                  <p style={{ margin: 0 }}>GSTIN: 29AABCD1234F1Z5</p>
                </div>
              </div>

              {/* Invoice Title & Details */}
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', margin: '0 0 8px 0' }}>INVOICE</h2>
                <table style={{ marginLeft: 'auto', fontSize: '13px', color: '#4b5563' }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 500 }}>Invoice No:</td>
                      <td style={{ textAlign: 'left', fontWeight: 600, color: '#111827' }}>{transaction.transactionId}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 500 }}>Date:</td>
                      <td style={{ textAlign: 'left' }}>{format(parseISO(transaction.createdAt), 'MMMM d, yyyy')}</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 500, verticalAlign: 'middle' }}>Status:</td>
                      <td style={{ textAlign: 'left' }}><StatusBadge status={transaction.status} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '24px 0' }} />

            {/* Bill To Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 8px 0'
              }}>Bill To</h3>
              <div style={{ color: '#374151' }}>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>{customerName}</p>
                <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>{user?.email}</p>
                {customerAddress && (
                  <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>{customerAddress}</p>
                )}
                {(customerCity || customerState || customerPincode) && (
                  <p style={{ fontSize: '13px', margin: '0 0 2px 0' }}>
                    {[customerCity, customerState, customerPincode].filter(Boolean).join(', ')}
                  </p>
                )}
                {customerGstin && (
                  <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: '#6b7280' }}>GSTIN: {customerGstin}</p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginBottom: '32px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                    <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {planItem && (
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 0' }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: '0 0 4px 0' }}>{planItem.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Subscription Plan - Monthly</p>
                      </td>
                      <td style={{ textAlign: 'center', padding: '16px 0', fontSize: '14px', color: '#4b5563' }}>1</td>
                      <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                        {formatCurrency(planItem.amount)}
                      </td>
                    </tr>
                  )}
                  {addonItems.map((addon, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 0' }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827', margin: '0 0 4px 0' }}>{addon.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Add-on</p>
                      </td>
                      <td style={{ textAlign: 'center', padding: '16px 0', fontSize: '14px', color: '#4b5563' }}>1</td>
                      <td style={{ textAlign: 'right', padding: '16px 0', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                        {formatCurrency(addon.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <table style={{ width: '280px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0', fontSize: '14px', color: '#4b5563' }}>Subtotal</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: 500, color: '#111827', textAlign: 'right' }}>{formatCurrency(subtotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', fontSize: '14px', color: '#4b5563' }}>GST (18%)</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', fontWeight: 500, color: '#111827', textAlign: 'right' }}>{formatCurrency(transaction.gstAmount)}</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#111827' }}>Total</td>
                    <td style={{ padding: '16px 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#2563eb', textAlign: 'right' }}>{formatCurrency(transaction.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Confirmation */}
            {transaction.status === 'success' && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#166534', margin: '0 0 2px 0' }}>Payment Received</p>
                  <p style={{ fontSize: '12px', color: '#22c55e', margin: 0 }}>
                    Transaction ID: {transaction.gatewayTransactionId || transaction.transactionId}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{
              marginTop: '48px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                Thank you for your business! For questions, contact support@diligince.ai
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetail;
