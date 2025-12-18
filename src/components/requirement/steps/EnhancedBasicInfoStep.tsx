import React, { useState } from "react";
import { useRequirement } from "@/contexts/RequirementContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, DollarSign, Loader2 } from "lucide-react";
import { CategorySelector } from "@/components/requirement/CategorySelector";
import { PriorityBadge } from "@/components/requirement/PriorityBadge";
import { AdvancedOptions } from "@/components/requirement/AdvancedOptions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import requirementDraftService from "@/services/requirement-draft.service";

interface EnhancedBasicInfoStepProps {
  onNext: () => void;
}

const EnhancedBasicInfoStep: React.FC<EnhancedBasicInfoStepProps> = ({
  onNext
}) => {
  const {
    formData,
    updateFormData,
    validateStep,
    stepErrors,
    saveAsDraft,
    draftId
  } = useRequirement();
  const [isValidating, setIsValidating] = useState(false);

  const handleNext = async () => {
    // Client-side validation first
    if (!validateStep(1)) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Save the draft before moving to next step
    try {
      setIsValidating(true);
      
      await saveAsDraft();
      
      // Move to next step after successful save
      onNext();
      
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveDraft = () => {
    saveAsDraft();
    toast.success("Draft saved successfully");
  };

  const departments = ["Engineering", "Procurement", "Operations", "Maintenance", "Quality", "Safety", "IT", "Finance", "HR", "Management"];

  // Debug logging to track data flow
  console.log("🟠 BasicInfoStep: Rendering with formData", formData);
  console.log("🟠 BasicInfoStep: Title =", formData.title);
  console.log("🟠 BasicInfoStep: Category =", formData.category);
  console.log("🟠 BasicInfoStep: Priority =", formData.priority);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-6">
      {/* Section 1: Essential Information */}
      <section className="space-y-6 bg-white rounded-lg border border-corporate-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-corporate-gray-200">
          <Briefcase className="w-5 h-5 text-corporate-gray-500" />
          <h2 className="text-lg font-semibold text-corporate-gray-900">Essential Information</h2>
        </div>

        {/* Requirement Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-foreground">
            Requirement Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g., Procurement of Heavy Equipment for Construction Phase 2"
            value={formData.title || ""}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="text-base h-12"
            autoFocus
          />
          {formData.title && (
            <p className="text-xs text-muted-foreground">{formData.title.length} characters</p>
          )}
          {stepErrors.title && <p className="text-xs text-destructive">{stepErrors.title}</p>}
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <CategorySelector
            value={formData.category || []}
            onChange={(values) => updateFormData({ 
              category: values as any,
              specialization: [] // Clear specialization when categories change
            })}
            error={stepErrors.category}
          />
        </div>

        {/* Priority Level */}
        <PriorityBadge
          value={formData.priority || ""}
          onChange={(value) => updateFormData({ priority: value as any })}
          error={stepErrors.priority}
        />
      </section>

      {/* Section 2: Business Context */}
      <section className="space-y-6 bg-white rounded-lg border border-corporate-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-corporate-gray-200">
          <Briefcase className="w-5 h-5 text-corporate-gray-500" />
          <h2 className="text-lg font-semibold text-corporate-gray-900">Business Context</h2>
        </div>

        {/* Business Justification */}
        <div className="space-y-2">
          <Label htmlFor="justification" className="text-sm font-medium text-foreground">
            Business Justification <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="justification"
            placeholder="Describe the business need, expected outcomes, and strategic alignment..."
            value={formData.businessJustification || ""}
            onChange={(e) => updateFormData({ businessJustification: e.target.value })}
            className="min-h-[120px] text-base resize-none"
          />
          {formData.businessJustification && (
            <p className="text-xs text-muted-foreground">
              {formData.businessJustification.length} characters (min. 50 recommended)
            </p>
          )}
          {stepErrors.businessJustification && (
            <p className="text-xs text-destructive">{stepErrors.businessJustification}</p>
          )}
        </div>

        {/* Department & Cost Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium text-foreground">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.department || ""}
              onValueChange={(value) => updateFormData({ department: value })}
            >
              <SelectTrigger id="department" className="h-11">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stepErrors.department && <p className="text-xs text-destructive">{stepErrors.department}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="costCenter" className="text-sm font-medium text-foreground">
              Cost Center
            </Label>
            <Input
              id="costCenter"
              placeholder="e.g., CC-123-456"
              value={formData.costCenter || ""}
              onChange={(e) => updateFormData({ costCenter: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Requested By */}
        <div className="space-y-2">
          <Label htmlFor="requestedBy" className="text-sm font-medium text-foreground">
            Requested By
          </Label>
          <Input
            id="requestedBy"
            placeholder="Enter name or employee ID"
            value={formData.requestedBy || ""}
            onChange={(e) => updateFormData({ requestedBy: e.target.value })}
            className="h-11"
          />
        </div>
      </section>

      {/* Section 3: Budget Information */}
      <section className="space-y-6 bg-white rounded-lg border border-corporate-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-corporate-gray-200">
          <DollarSign className="w-5 h-5 text-corporate-gray-500" />
          <h2 className="text-lg font-semibold text-corporate-gray-900">
            Budget Information
            {formData.estimatedBudget && (
              <span className="ml-2 text-muted-foreground font-normal text-sm">
                (${Number(formData.estimatedBudget).toLocaleString()})
              </span>
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedBudget" className="text-sm font-medium text-foreground">
              Estimated Budget <span className="text-destructive">*</span>
            </Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  placeholder="0.00"
                  value={formData.estimatedBudget || ""}
                  onChange={(e) => updateFormData({ estimatedBudget: parseFloat(e.target.value) || 0 })}
                  className="h-11"
                />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetCostCenter" className="text-sm font-medium text-foreground">
              Budget Cost Center
            </Label>
            <Input
              id="budgetCostCenter"
              placeholder="e.g., BUDGET-2024-Q1"
              value={formData.costCenter || ""}
              onChange={(e) => updateFormData({ costCenter: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Advanced Options */}
      <AdvancedOptions
        riskLevel={formData.riskLevel || "low"}
        onRiskLevelChange={(value) => updateFormData({ riskLevel: value as any })}
        isUrgent={formData.isUrgent || false}
        onUrgentChange={(value) => updateFormData({ isUrgent: value })}
        budgetPreApproved={formData.budgetApproved || false}
        onBudgetPreApprovedChange={(value) => updateFormData({ budgetApproved: value })}
        complianceRequired={formData.complianceRequired || false}
        onComplianceRequiredChange={(value) => updateFormData({ complianceRequired: value })}
      />
    </div>
  );
};

export default EnhancedBasicInfoStep;
