// src/pages/industry/IndustryDashboard.tsx
import React, { memo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  ShoppingCart,
  Workflow,
  RefreshCw,
  PackageSearch,
  TrendingUp,
} from "lucide-react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { perfUtils } from "@/utils/performance";
import { useIndustryDashboard } from "@/hooks/useIndustryDashboard";
import { DashboardStats } from "@/components/industry/dashboard/DashboardStats";
import { ProcurementAnalytics } from "@/components/industry/dashboard/ProcurementAnalytics";
import { VendorPerformance } from "@/components/industry/dashboard/VendorPerformance";
import { DashboardSkeleton } from "@/components/shared/loading/DashboardSkeleton";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

const getStatusColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case "active":
    case "in progress": return "bg-green-100 text-green-800";
    case "pending": return "bg-amber-100 text-amber-800";
    case "completed":
    case "approved":
    case "delivered": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (cat: string) => {
  switch ((cat || '').toLowerCase()) {
    case "product": return "bg-purple-100 text-purple-800";
    case "service": return "bg-blue-100 text-blue-800";
    case "expert": return "bg-green-100 text-green-800";
    case "logistics": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (p: string) => {
  switch ((p || '').toLowerCase()) {
    case "urgent": return "bg-red-100 text-red-800";
    case "high": return "bg-orange-100 text-orange-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Empty state component
const EmptyState = ({ icon: Icon, title, subtitle }: {
  icon: React.ElementType; title: string; subtitle?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
    <div className="p-3 rounded-full bg-muted/60">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const DashboardContainer = memo(() => {
  const {
    stats,
    analytics,
    vendors,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useIndustryDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={refresh}>Try Again</Button>
          </Card>
        </div>
      </main>
    );
  }

  const hasVendors = (vendors ?? []).length > 0;

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Industry Dashboard</h1>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild><Link to="/dashboard/create-requirement"><FileText className="mr-2 h-4 w-4" />Create Requirement</Link></Button>
          <Button asChild><Link to="/dashboard/industry-workflows"><Workflow className="mr-2 h-4 w-4" />Manage Workflows</Link></Button>
          <Button asChild><Link to="/dashboard/industry-stakeholders"><ShoppingCart className="mr-2 h-4 w-4" />Find Stakeholders</Link></Button>
          <Button asChild><Link to="/dashboard/industry-messages"><MessageSquare className="mr-2 h-4 w-4" />View Messages</Link></Button>
        </div>

        {/* ── KPI Stats — always visible ── */}
        <section>
          {stats
            ? <DashboardStats data={stats} />
            : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="p-6 text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Loading…</p>
                  </Card>
                ))}
              </div>
            )}
        </section>

        {/* ── Procurement Analytics — always visible ── */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Procurement Analytics</h2>
          {analytics && (analytics.categories.length > 0 || analytics.monthlyTrend.length > 0) ? (
            <ProcurementAnalytics data={analytics} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {['Spend by Category', 'Monthly Spend Trend'].map(title => (
                <Card key={title} className="shadow-sm">
                  <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                  <CardContent>
                    <EmptyState
                      icon={TrendingUp}
                      title="No spend data yet"
                      subtitle="Data will appear once purchase orders are issued"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Top Performing Vendors — always visible ── */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Top Performing Vendors</h2>
          {hasVendors ? (
            <VendorPerformance data={vendors} />
          ) : (
            <Card className="shadow-sm">
              <CardContent>
                <EmptyState
                  icon={PackageSearch}
                  title="No vendor data available"
                  subtitle="Vendor rankings appear once orders are processed"
                />
              </CardContent>
            </Card>
          )}
        </section>

      </div>
    </main>
  );
});

// ─── Page wrapper ─────────────────────────────────────────────────────────────

const IndustryDashboard = () => {
  usePerformanceMonitor("IndustryDashboard");
  React.useEffect(() => { perfUtils.measureCoreWebVitals(); }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Industry Dashboard | Diligince.ai</title>
      </Helmet>
      <DashboardContainer />
    </div>
  );
};

export default memo(IndustryDashboard);
