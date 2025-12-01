// src/pages/industry/IndustryDashboard.tsx

import React, { Suspense, memo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  FileText,
  MessageSquare,
  ShoppingCart,
  Workflow,
  RefreshCw,
} from "lucide-react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { perfUtils } from "@/utils/performance";
import { useApproval } from "@/contexts/ApprovalContext";
import { ApprovalModal } from "@/components/approval/ApprovalModal";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import { useIndustryDashboard } from "@/hooks/useIndustryDashboard";
import { DashboardStats } from "@/components/industry/dashboard/DashboardStats";
import { ProcurementAnalytics } from "@/components/industry/dashboard/ProcurementAnalytics";
import { BudgetUtilization } from "@/components/industry/dashboard/BudgetUtilization";
import { VendorPerformance } from "@/components/industry/dashboard/VendorPerformance";
import { LoadingSpinner } from "@/components/shared/loading/LoadingSpinner";

// ---------------- Helpers ----------------
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "in progress":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "completed":
    case "delivered":
      return "bg-blue-100 text-blue-800";
    case "approved":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "product":
    case "product vendor":
      return "bg-purple-100 text-purple-800";
    case "service":
    case "service vendor":
      return "bg-blue-100 text-blue-800";
    case "expert":
      return "bg-green-100 text-green-800";
    case "logistics":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ---------------- Dashboard ----------------
const DashboardContainer = memo(() => {
  const navigate = useNavigate();
  const { submitApproval } = useApproval();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  
  // Fetch dashboard data
  const {
    stats,
    analytics,
    budget,
    vendors,
    requirements,
    purchaseOrders,
    pendingApprovals,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useIndustryDashboard();

  const handleManageMilestones = (orderId: string) => {
    navigate(`/dashboard/industry-workflows/${orderId}`);
  };

  const handleReviewApproval = (approval: any) => {
    setSelectedApproval(approval);
    openModal();
  };

  const handleApprove = (comments: string) => {
    if (selectedApproval) {
      submitApproval(selectedApproval.id, "approved", comments);
      toast.success(
        `Requirement "${selectedApproval.requirementTitle}" approved successfully`
      );
      setSelectedApproval(null);
    }
  };

  const handleReject = (comments: string) => {
    if (selectedApproval) {
      submitApproval(selectedApproval.id, "rejected", comments);
      toast.error(
        `Requirement "${selectedApproval.requirementTitle}" rejected`
      );
      setSelectedApproval(null);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </main>
    );
  }

  // Show error state
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

  return (
    <main className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Industry Dashboard</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild>
            <Link to="/dashboard/create-requirement">
              <FileText /> Create Requirement
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/industry-workflows">
              <Workflow /> Manage Workflows
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/industry-stakeholders">
              <ShoppingCart /> Find Stakeholders
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/industry-messages">
              <MessageSquare /> View Messages
            </Link>
          </Button>
        </div>

        {/* Pending Approvals */}
        {(pendingApprovals ?? []).length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requirement</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(pendingApprovals ?? []).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.requirementTitle}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(a.category)}>
                          {a.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{a.priority}</TableCell>
                      <TableCell>${a.budget.toLocaleString()}</TableCell>
                      <TableCell>{new Date(a.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleReviewApproval(a)}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Metrics */}
        {stats && <DashboardStats data={stats} />}

        {/* Procurement Analytics */}
        {analytics && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Procurement Analytics</h2>
            <ProcurementAnalytics data={analytics} />
          </div>
        )}

        {/* Budget Utilization */}
        {budget && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Budget Overview</h2>
            <BudgetUtilization data={budget} />
          </div>
        )}

        {/* Vendor Performance */}
        {(vendors ?? []).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Top Performing Vendors</h2>
            <VendorPerformance data={vendors} />
          </div>
        )}

        {/* Active Requirements */}
        {(requirements ?? []).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Requirements</h2>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(requirements ?? []).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.title}</TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(r.category)}>
                            {r.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(r.status)}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${r.budget.toLocaleString()}</TableCell>
                        <TableCell>{r.applicants}</TableCell>
                        <TableCell>
                          <Button asChild size="sm">
                            <Link to={`/dashboard/industry-workflows/${r.id}`}>
                              <Workflow className="h-4 w-4 mr-1" /> Workflow
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Purchase Orders */}
        {(purchaseOrders ?? []).length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Active Purchase Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(purchaseOrders ?? []).map((o) => (
                <Card key={o.id} className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {o.id}
                      </Badge>
                      <Badge className={getStatusColor(o.status)}>
                        {o.status}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{o.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Vendor: {o.vendor}</p>
                    <p className="text-sm text-muted-foreground mb-4">{o.summary}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold">{o.progress}%</span>
                      </div>
                      <Progress value={o.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ${o.amount.toLocaleString()}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleManageMilestones(o.id)}
                        className="gap-2"
                      >
                        <Workflow className="h-4 w-4" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {selectedApproval && (
          <ApprovalModal
            isOpen={isOpen}
            onClose={closeModal}
            requirement={selectedApproval}
            approvalLevel={selectedApproval.approvalLevel}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </main>
  );
});

const IndustryDashboard = () => {
  usePerformanceMonitor("IndustryDashboard");
  React.useEffect(() => {
    perfUtils.measureCoreWebVitals();
  }, []);
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
