import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, Edit } from 'lucide-react';
import { purchaseOrdersService } from '@/services/modules/purchase-orders';
import VendorPurchaseOrderDetails from './VendorPurchaseOrderDetails';
import { DetailPageSkeleton } from '@/components/shared/loading';
import { POOverviewTab } from '@/components/purchase-order/POOverviewTab';
import { POLineItemsTab } from '@/components/purchase-order/POLineItemsTab';
import { POMilestonesTab } from '@/components/purchase-order/POMilestonesTab';
import { PODeliveryTab } from '@/components/purchase-order/PODeliveryTab';
import { POInvoicesTab } from '@/components/purchase-order/POInvoicesTab';
import { POAcceptanceCriteriaTab } from '@/components/purchase-order/POAcceptanceCriteriaTab';
import { POActivityTab } from '@/components/purchase-order/POActivityTab';
import { exportPOToPDF } from '@/services/pdf-generator';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const PurchaseOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  // Check user type for vendor detection (userType is more reliable than role)
  const isVendorUser = user?.userType === 'Vendor';

  // If user is a vendor, use the vendor-specific component
  if (isVendorUser) {
    return <VendorPurchaseOrderDetails />;
  }

  // Otherwise, continue with industry PO details

  const { data: poDetail, isLoading, error } = useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      const response = await purchaseOrdersService.getById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = async () => {
    if (!id) return;
    await purchaseOrdersService.approve(id, 'Approved');
  };

  const handleReject = async () => {
    if (!id) return;
    await purchaseOrdersService.reject(id, 'Rejected');
  };

  const handleExportPDF = async () => {
    if (!poDetail) return;

    try {
      // Use client-side PDF generation
      await exportPOToPDF(poDetail);
      toast({
        title: 'Success',
        description: 'PDF exported successfully',
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto p-6 space-y-6">
          <DetailPageSkeleton showTabs tabCount={7} sections={2} />
        </div>
      </div>
    );
  }

  if (error || !poDetail) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Purchase order not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const po = poDetail;

  // Role-based access control - use userType for reliable vendor/industry detection
  const isVendor = user?.userType === 'Vendor';
  const isIndustry = user?.userType === 'Industry' || user?.role === 'industry';

  // Only vendors can approve/reject POs sent to them
  const showApprovalActions = po.status === 'pending_approval' && isVendor;

  // Only industry users can edit (not vendors)
  const canEdit = (po.status === 'draft' || po.status === 'cancelled') && isIndustry;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(
              isVendor
                ? '/dashboard/service-vendor'  // Vendor dashboard
                : '/dashboard/industry-purchase-orders'  // Industry PO list
            )}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {isVendor ? 'Dashboard' : 'Purchase Orders'}
          </Button>
        </div>

        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{po.orderNumber}</h1>
                <Badge className={getStatusColor(po.status)}>
                  {po.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">{po.projectTitle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Vendor: {po.vendor?.name || po.vendorName || 'N/A'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {showApprovalActions && (
                <>
                  <Button onClick={handleApprove} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button onClick={handleReject} variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate(`/dashboard/purchase-orders/${id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="acceptance">Acceptance Criteria</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <POOverviewTab po={po} />
          </TabsContent>

          <TabsContent value="items">
            <POLineItemsTab deliverables={po.deliverables} />
          </TabsContent>

          <TabsContent value="milestones">
            <POMilestonesTab orderId={po.id} milestones={po.paymentMilestones} />
          </TabsContent>

          <TabsContent value="acceptance">
            <POAcceptanceCriteriaTab criteria={po.acceptanceCriteria || []} />
          </TabsContent>

          <TabsContent value="delivery">
            <PODeliveryTab orderId={po.id} delivery={po.deliveryTracking} />
          </TabsContent>

          <TabsContent value="invoices">
            <POInvoicesTab orderId={po.id} invoices={po.invoices || []} />
          </TabsContent>

          <TabsContent value="activity">
            <POActivityTab orderId={po.id} activities={po.activityLog} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
