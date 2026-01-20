import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Receipt,
  FileText,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Loader2
} from 'lucide-react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { TransactionStatusBadge, TransactionFilters } from '@/components/subscription';
import {
  formatCurrency,
  type Transaction,
  type TransactionStatus
} from '@/data/mockSubscriptionData';
import { subscriptionPurchaseService } from '@/services/modules/subscription-purchase/subscriptionPurchase.service';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const SubscriptionTransactions = () => {
  const navigate = useNavigate();

  // Transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await subscriptionPurchaseService.getTransactions();
        if (response.success && response.data?.transactions) {
          // Map API response to Transaction type
          const mappedTransactions: Transaction[] = response.data.transactions.map((t: any) => {
            // Calculate expiry date: transaction date + 30 days for monthly subscriptions
            const transactionDate = new Date(t.createdAt);
            const expiryDate = new Date(transactionDate);
            expiryDate.setDate(expiryDate.getDate() + 30);

            return {
              id: t.id || t.transactionId,
              transactionNumber: t.transactionId,
              date: t.createdAt,
              planCode: t.items?.[0]?.code || '',
              planName: t.items?.[0]?.name || 'Unknown',
              amount: t.amount,
              currency: t.currency || 'INR',
              status: t.status === 'success' ? 'success' : t.status === 'pending' ? 'pending' : 'failed',
              expiryDate: t.status === 'success' ? expiryDate.toISOString() : undefined,
              addOnsCount: t.items?.filter((i: any) => i.type === 'addon').length || 0,
              breakdown: {
                planAmount: t.items?.find((i: any) => i.type === 'plan')?.amount || 0,
                addOnsAmount: t.items?.filter((i: any) => i.type === 'addon').reduce((s: number, i: any) => s + i.amount, 0) || 0,
                subtotal: t.netAmount || t.amount,
                gstRate: 18,
                gstAmount: t.gstAmount || 0,
                total: t.amount
              },
              paymentMethod: {
                type: 'card'
              },
              razorpayId: t.gatewayTransactionId
            };
          });
          setTransactions(mappedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const availablePlans = useMemo(() => {
    return [...new Set(transactions.map(t => t.planName))];
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // Status filter
      if (statusFilter !== 'all' && txn.status !== statusFilter) {
        return false;
      }

      // Plan filter
      if (planFilter !== 'all' && txn.planName !== planFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from && dateRange.to) {
        const txnDate = parseISO(txn.date);
        if (!isWithinInterval(txnDate, { start: dateRange.from, end: dateRange.to })) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, statusFilter, planFilter, dateRange]);

  // Paginate
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = statusFilter !== 'all' || planFilter !== 'all' || dateRange.from !== undefined;

  const clearFilters = () => {
    setStatusFilter('all');
    setPlanFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setCurrentPage(1);
  };

  const handleRowClick = (transaction: Transaction) => {
    navigate(`/dashboard/subscription/transactions/${transaction.id}`);
  };

  // Calculate summary stats
  const stats = useMemo(() => {
    const successful = transactions.filter(t => t.status === 'success');
    const totalSpent = successful.reduce((sum, t) => sum + t.amount, 0);
    const thisMonthTransactions = transactions.filter(t => {
      const txnDate = parseISO(t.date);
      const now = new Date();
      return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonthTransactions.reduce((sum, t) => sum + (t.status === 'success' ? t.amount : 0), 0);

    return {
      totalTransactions: transactions.length,
      successfulPayments: successful.length,
      totalSpent,
      thisMonthTotal
    };
  }, [transactions]);

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
            <p className="text-muted-foreground">
              View all your subscription and add-on payments
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading transactions...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Successful Payments</p>
                    <p className="text-2xl font-bold text-green-600">{stats.successfulPayments}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.thisMonthTotal)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <TrendingDown className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Transactions</CardTitle>
                  <CardDescription>
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <TransactionFilters
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                status={statusFilter}
                onStatusChange={setStatusFilter}
                plan={planFilter}
                onPlanChange={setPlanFilter}
                availablePlans={availablePlans}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-center">Add-ons</TableHead>
                      <TableHead className="text-center">Invoice</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Receipt className="h-12 w-12 text-muted-foreground/50" />
                            <p className="text-muted-foreground">No transactions found</p>
                            {hasActiveFilters && (
                              <Button variant="link" onClick={clearFilters}>
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => handleRowClick(transaction)}
                        >
                          <TableCell className="font-medium">
                            {format(parseISO(transaction.date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{transaction.planName}</span>
                              <span className="text-xs text-muted-foreground">
                                {transaction.transactionNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <TransactionStatusBadge status={transaction.status} />
                          </TableCell>
                          <TableCell>
                            {transaction.expiryDate
                              ? format(parseISO(transaction.expiryDate), 'MMM d, yyyy')
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="text-center">
                            {transaction.addOnsCount > 0 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {transaction.addOnsCount}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(transaction);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                    {filteredTransactions.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SubscriptionTransactions;
