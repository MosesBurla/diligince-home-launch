import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { PurchaseOrderDetail } from '@/services/modules/purchase-orders';
import { format } from 'date-fns';

interface POOverviewTabProps {
  po: PurchaseOrderDetail;
}

export const POOverviewTab: React.FC<POOverviewTabProps> = ({ po }) => {
  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {po.currency} {po.amount?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tax Amount</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {po.currency} {po.taxAmount?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {po.taxPercentage}% tax
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {po.currency} {po.totalValue?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="text-base font-medium">
                {po.startDate ? format(new Date(po.startDate), 'PPP') : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="text-base font-medium">
                {po.endDate ? format(new Date(po.endDate), 'PPP') : 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Completion Progress</p>
              <p className="text-sm text-muted-foreground">
                {po.completionPercentage}%
              </p>
            </div>
            <Progress value={po.completionPercentage} className="h-2" />
          </div>

          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Milestones Completed: </span>
              <span className="font-medium">{po.milestonesCompleted}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Milestones Pending: </span>
              <span className="font-medium">{po.milestonesPending}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Information */}
      {po.vendor && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Company Name</p>
              <p className="font-medium">{po.vendor.name}</p>
            </div>
            {po.vendor.contactPerson && (
              <div>
                <p className="text-sm text-muted-foreground">Contact Person</p>
                <p className="font-medium">{po.vendor.contactPerson}</p>
              </div>
            )}
            {po.vendor.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{po.vendor.email}</p>
              </div>
            )}
            {po.vendor.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{po.vendor.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
        </CardHeader>
        <CardContent>
          {typeof po.paymentTerms === 'string' ? (
            <p className="text-base">{po.paymentTerms}</p>
          ) : po.paymentTerms && typeof po.paymentTerms === 'object' ? (
            <div className="space-y-2">
              {(po.paymentTerms as any).method && (
                <div>
                  <span className="text-sm text-muted-foreground">Payment Method: </span>
                  <span className="font-medium">{(po.paymentTerms as any).method}</span>
                </div>
              )}
              {(po.paymentTerms as any).advancePayment !== undefined && (
                <div>
                  <span className="text-sm text-muted-foreground">Advance Payment: </span>
                  <span className="font-medium">{(po.paymentTerms as any).advancePayment}%</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-base text-muted-foreground">No payment terms specified</p>
          )}
        </CardContent>
      </Card>

      {/* Scope of Work */}
      <Card>
        <CardHeader>
          <CardTitle>Scope of Work</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base whitespace-pre-wrap">{po.scopeOfWork}</p>
        </CardContent>
      </Card>

      {/* Special Instructions */}
      {po.specialInstructions && (
        <Card>
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base whitespace-pre-wrap">{po.specialInstructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Acceptance Criteria */}
      {po.acceptanceCriteria && po.acceptanceCriteria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Acceptance Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {po.acceptanceCriteria.map((criteria) => (
                <li key={criteria.id} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span>{criteria.criteria}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
