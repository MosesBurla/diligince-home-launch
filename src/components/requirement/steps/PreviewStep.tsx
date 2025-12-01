import React from "react";
import { useNavigate } from "react-router-dom";
import { useRequirement } from "@/contexts/RequirementContext";
import { useRequirementDraft } from "@/hooks/useRequirementDraft";
import { steps } from "@/components/requirement/RequirementStepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Package, User, Wrench, Truck, Edit, File } from "lucide-react";
import { StepType } from "@/pages/CreateRequirement";
import { toast } from "sonner";

interface PreviewStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onEdit: (step: StepType) => void;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ 
  onNext, 
  onPrevious,
  onEdit 
}) => {
  const { formData } = useRequirement();
  const { forceSave } = useRequirementDraft();
  const navigate = useNavigate();

  const handleSendForApproval = async () => {
    try {
      // Auto-save will handle saving in background
      onNext(); // Navigate to approval workflow step
      toast.success("Proceeding to approval configuration");
    } catch (error) {
      console.error("Failed to proceed:", error);
      toast.error("Failed to proceed. Please try again.");
    }
  };

  const handleClose = () => {
    navigate("/industry");
  };

  const getCategoryIcon = () => {
    switch (formData.category) {
      case "expert":
        return <User className="h-5 w-5 text-primary" />;
      case "product":
        return <Package className="h-5 w-5 text-green-600" />;
      case "service":
        return <Wrench className="h-5 w-5 text-purple-600" />;
      case "logistics":
        return <Truck className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return format(date, "MMM dd, yyyy");
  };

  const formatList = (list: string[] | undefined) => {
    if (!list || list.length === 0) return "None";
    return list.join(", ");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{steps[4].name}</h2>
        <p className="text-gray-600">
          {steps[4].description}
        </p>
      </div>

      {/* Basic Info Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Basic Information</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1 text-gray-500 hover:text-primary"
            onClick={() => onEdit(1)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {formData.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              {getCategoryIcon()}
              <span className="capitalize">{formData.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Requirement Details</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1 text-gray-500 hover:text-primary"
            onClick={() => onEdit(2)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.category === "expert" && (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                    <p className="mt-1">{formData.specialization || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1">{formData.budget ? `$${formData.budget.toLocaleString()}` : "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 whitespace-pre-line">{formData.description || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="mt-1">{formData.duration ? `${formData.duration} days` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Certifications</p>
                    <p className="mt-1">{formatList(formData.certifications)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1">{formatDate(formData.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-1">{formatDate(formData.endDate)}</p>
                  </div>
                </div>
              </>
            )}

            {formData.category === "product" && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product Specifications</p>
                  <p className="mt-1 whitespace-pre-line">{formData.productSpecifications || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p className="mt-1">{formData.quantity || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1">{formData.budget ? `$${formData.budget.toLocaleString()}` : "Not specified"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Date</p>
                    <p className="mt-1">{formatDate(formData.deliveryDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quality Requirements</p>
                    <p className="mt-1">{formData.qualityRequirements || "Not specified"}</p>
                  </div>
                </div>
              </>
            )}

            {formData.category === "service" && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Description</p>
                  <p className="mt-1 whitespace-pre-line">{formData.serviceDescription || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Scope of Work</p>
                  <p className="mt-1 whitespace-pre-line">{formData.scopeOfWork || "Not specified"}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1">{formData.serviceBudget ? `$${formData.serviceBudget.toLocaleString()}` : "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1">{formData.location || "Not specified"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1">{formatDate(formData.serviceStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="mt-1">{formatDate(formData.serviceEndDate)}</p>
                  </div>
                </div>
              </>
            )}

            {formData.category === "logistics" && (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Equipment Type</p>
                    <p className="mt-1">{formData.equipmentType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p className="mt-1">{formData.weight ? `${formData.weight} kg` : "Not specified"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dimensions</p>
                    <p className="mt-1">{formData.dimensions || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Special Handling</p>
                    <p className="mt-1 whitespace-pre-line">{formData.specialHandling || "None"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pickup Location</p>
                    <p className="mt-1">{formData.pickupLocation || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Location</p>
                    <p className="mt-1">{formData.deliveryLocation || "Not specified"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pickup Date</p>
                    <p className="mt-1">{formatDate(formData.pickupDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivery Date</p>
                    <p className="mt-1">{formatDate(formData.deliveryDate)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Documents</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1 text-gray-500 hover:text-primary"
            onClick={() => onEdit(3)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </CardHeader>
        <CardContent>
          {formData.documents.length === 0 ? (
            <p className="text-gray-500">No documents attached</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {formData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <File className="h-5 w-5 text-primary" />
                  <div className="flex-1 truncate">
                    <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{doc.documentType}</p>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleSendForApproval}>
            Send for Approvals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
