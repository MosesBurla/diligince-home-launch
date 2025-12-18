import React from "react";
import { useRequirement } from "@/contexts/RequirementContext";
import { steps } from "@/components/requirement/RequirementStepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Package, User, Wrench, Truck, Edit, File, CheckCircle2, AlertCircle, FileText, Workflow } from "lucide-react";
import { StepType } from "@/pages/CreateRequirement";

interface PreviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onEdit: (step: StepType) => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ 
  onEdit 
}) => {
  const { formData } = useRequirement();

  const getCategoryIcon = () => {
    const categories = formData.category || [];
    // Return icon for first category, or null if none
    if (categories.includes("expert")) return <User className="h-5 w-5 text-primary" />;
    if (categories.includes("product")) return <Package className="h-5 w-5 text-emerald-600" />;
    if (categories.includes("service")) return <Wrench className="h-5 w-5 text-purple-600" />;
    if (categories.includes("logistics")) return <Truck className="h-5 w-5 text-orange-600" />;
    return null;
  };

  const formatCategories = () => {
    const categories = formData.category || [];
    if (categories.length === 0) return "No category";
    return categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ");
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not specified";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatList = (list: string[] | undefined) => {
    if (!list || list.length === 0) return "None";
    return list.join(", ");
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return "Not specified";
    return `₹${value.toLocaleString()}`;
  };

  // Check completion status for each section
  const isSectionComplete = (section: 'basic' | 'details' | 'documents' | 'approval') => {
    const categories = formData.category || [];
    switch (section) {
      case 'basic':
        return !!(formData.title && categories.length > 0 && formData.priority);
      case 'details':
        let detailsComplete = categories.length > 0;
        if (categories.includes('product') && !(formData.productSpecifications && formData.quantity)) detailsComplete = false;
        if (categories.includes('expert') && !(formData.specialization?.length && formData.description)) detailsComplete = false;
        if (categories.includes('service') && !(formData.serviceDescription && formData.scopeOfWork)) detailsComplete = false;
        if (categories.includes('logistics') && !(formData.equipmentType && formData.pickupLocation)) detailsComplete = false;
        return detailsComplete;
      case 'documents':
        return (formData.documents?.length || 0) > 0;
      case 'approval':
        return !!(formData.estimatedBudget && formData.estimatedBudget > 0);
      default:
        return false;
    }
  };

  const SectionStatus = ({ complete }: { complete: boolean }) => (
    complete ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-amber-500" />
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{steps[4].name}</h2>
        <p className="text-sm text-muted-foreground">
          Review all information before proceeding to publish
        </p>
      </div>

      {/* Basic Info Summary */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <SectionStatus complete={isSectionComplete('basic')} />
            <CardTitle className="text-base font-medium">Basic Information</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(1)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {formData.title || "Untitled Requirement"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                {getCategoryIcon()}
                <span className="text-muted-foreground">{formatCategories()}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                formData.priority === 'critical' ? 'bg-red-100 text-red-700' :
                formData.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                formData.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {formData.priority || "No priority"}
              </span>
            </div>
            {formData.businessJustification && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {formData.businessJustification}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Summary */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <SectionStatus complete={isSectionComplete('details')} />
            <CardTitle className="text-base font-medium">Requirement Details</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(2)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {formData.category?.includes("expert") && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Specialization</p>
                  <p className="font-medium">{formatList(formData.specialization)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{formData.duration ? `${formData.duration} days` : "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Certifications</p>
                  <p className="font-medium">{formatList(formData.certifications)}</p>
                </div>
              </>
            )}

            {formData.category?.includes("product") && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-medium">{formData.quantity || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">{formatDate(formData.deliveryDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <p className="font-medium">{formData.qualityRequirements || "Standard"}</p>
                </div>
              </>
            )}

            {formData.category?.includes("service") && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{formData.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(formData.serviceStartDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(formData.serviceEndDate)}</p>
                </div>
              </>
            )}

            {formData.category?.includes("logistics") && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Equipment</p>
                  <p className="font-medium">{formData.equipmentType || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="font-medium truncate">{formData.pickupLocation || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                  <p className="font-medium truncate">{formData.deliveryLocation || "Not specified"}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <SectionStatus complete={isSectionComplete('documents')} />
            <CardTitle className="text-base font-medium">Documents</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(3)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          {!formData.documents?.length ? (
            <p className="text-sm text-muted-foreground">No documents attached</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {formData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm"
                >
                  <File className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium truncate max-w-[150px]">{doc.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({doc.documentType})</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Workflow Summary */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <SectionStatus complete={isSectionComplete('approval')} />
            <CardTitle className="text-base font-medium">Budget & Approval</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1 text-muted-foreground hover:text-primary"
            onClick={() => onEdit(4)}
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="text-xs">Edit</span>
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="font-semibold text-primary">{formatCurrency(formData.estimatedBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Urgency</p>
              <p className="font-medium">{formData.isUrgent ? "Urgent" : "Standard"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Compliance</p>
              <p className="font-medium">{formData.complianceRequired ? "Required" : "Not required"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Approval Matrix</p>
              <p className="font-medium">{formData.selectedApprovalMatrixId ? "Selected" : "Not selected"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-muted-foreground">
          Review all sections carefully. Click <strong>Edit</strong> to make changes. 
          Proceed to the next step when ready to configure publishing options.
        </p>
      </div>
    </div>
  );
};

export default PreviewStep;
