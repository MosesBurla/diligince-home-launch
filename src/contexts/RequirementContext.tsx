import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRequirementDraft } from '@/hooks/useRequirementDraft';
import { toast } from 'sonner';

export interface RequirementFormData {
  id?: string;
  title?: string;
  category?: "product" | "service" | "expert" | "logistics";
  priority?: "low" | "medium" | "high" | "critical";
  description?: string;
  specialization?: string;
  productSpecifications?: string;
  quantity?: number;
  serviceDescription?: string;
  scopeOfWork?: string;
  equipmentType?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  documents?: { 
    id: string;
    name: string; 
    url: string;
    type: string;
    size: number;
    documentType: "specification" | "drawing" | "reference" | "compliance" | "other";
    version: number;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  submissionDeadline?: Date;
  evaluationCriteria?: string[];
  visibility?: "all" | "selected";
  selectedVendors?: string[];
  notifyByEmail?: boolean;
  notifyByApp?: boolean;
  termsAccepted?: boolean;
  budget?: number;
  createdDate?: string;
  deadline?: string;
  applicants?: number;
  complianceRequired?: boolean;
  riskLevel?: "low" | "medium" | "high" | "critical";
  
  // Add new approval-related fields
  isUrgent?: boolean;
  approvalWorkflowId?: string;
  approvalStatus?: 'not_required' | 'pending' | 'approved' | 'rejected';
  emergencyPublished?: boolean;
  approvalDeadline?: Date;
  
  // Expert-specific fields
  certifications?: string[];
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  
  // Product-specific fields
  technicalStandards?: string[];
  productDeliveryDate?: Date;
  qualityRequirements?: string;
  
  // Service-specific fields
  performanceMetrics?: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  serviceBudget?: number;
  location?: string;
  
  // Logistics-specific fields
  weight?: number;
  dimensions?: string;
  pickupDate?: Date;
  deliveryDate?: Date;
  specialHandling?: string;
  
  // Additional fields for EnhancedBasicInfoStep
  businessJustification?: string;
  department?: string;
  costCenter?: string;
  requestedBy?: string;
  urgency?: boolean;
  estimatedBudget?: number;
  budgetApproved?: boolean;
}

interface RequirementContextType {
  formData: RequirementFormData;
  updateFormData: (data: Partial<RequirementFormData>) => void;
  loadDraftData: (data: RequirementFormData) => void;
  resetForm: () => void;
  validateStep: (step: number) => boolean;
  stepErrors: Record<string, string> | null;
  isFormValid: () => boolean;
  saveAsDraft: () => Promise<void>;
  draftId: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
}

const RequirementContext = createContext<RequirementContextType | undefined>(undefined);

// Initialize with proper default values to prevent null/undefined errors
const getDefaultFormData = (): RequirementFormData => ({
  title: '',
  category: undefined,
  priority: undefined,
  description: '',
  businessJustification: '',
  department: '',
  costCenter: '',
  requestedBy: '',
  estimatedBudget: 0,
  budgetApproved: false,
  isUrgent: false,
  urgency: false,
  specialization: '',
  productSpecifications: '',
  quantity: 0,
  serviceDescription: '',
  scopeOfWork: '',
  equipmentType: '',
  pickupLocation: '',
  deliveryLocation: '',
  documents: [],
  submissionDeadline: undefined,
  evaluationCriteria: [],
  visibility: 'all',
  notifyByEmail: false,
  notifyByApp: true,
  termsAccepted: false,
  performanceMetrics: '',
  location: '',
  approvalStatus: 'not_required'
});

export const RequirementProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<RequirementFormData>(getDefaultFormData());
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const { draftId, isSaving, lastSaved, initializeDraft, forceSave } = useRequirementDraft();

  const updateFormData = useCallback((data: Partial<RequirementFormData>) => {
    console.log("Updating form data:", data);
    setFormData(prev => ({ ...prev, ...data }));
    setStepErrors({});
  }, []);

  const loadDraftData = useCallback((data: RequirementFormData) => {
    console.log("🟡 Context: Loading draft data", data);
    console.log("🟡 Context: Data keys", Object.keys(data || {}));
    setFormData(data);
    setStepErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(getDefaultFormData());
    setStepErrors({});
  }, []);

  // Check if form is empty (at least one field should be filled)
  const isFormEmpty = useCallback(() => {
    const hasData = 
      formData.title?.trim() ||
      formData.description?.trim() ||
      formData.businessJustification?.trim() ||
      formData.category ||
      formData.priority;
    
    return !hasData;
  }, [formData]);

  // Auto-save every 30 seconds if form has data
  useEffect(() => {
    if (isFormEmpty()) {
      return; // Don't auto-save empty forms
    }

    const autoSaveInterval = setInterval(async () => {
      try {
        if (!draftId) {
          await initializeDraft(formData);
        } else {
          await forceSave(formData, false); // Silent save
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, draftId, initializeDraft, forceSave, isFormEmpty]);

  const saveAsDraft = useCallback(async () => {
    if (isFormEmpty()) {
      toast.error("Cannot save empty form. Please fill in at least one field.");
      return;
    }

    console.log("Saving draft:", formData);
    try {
      if (!draftId) {
        await initializeDraft(formData);
        toast.success("Draft created successfully");
      } else {
        await forceSave(formData, true); // Show toast
        toast.success("Draft saved successfully");
      }
      localStorage.setItem('requirement-draft', JSON.stringify(formData));
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      
      if (!navigator.onLine) {
        toast.error("You're offline. Changes saved locally.");
      } else {
        toast.error("Failed to save to server. Retrying...");
      }
      
      localStorage.setItem('requirement-draft', JSON.stringify(formData));
    }
  }, [formData, draftId, initializeDraft, forceSave, isFormEmpty]);

  const validateStep = useCallback((step: number) => {
    console.log("Validating step:", step, "with formData:", formData);
    const errors: Record<string, string> = {};
    
    try {
      switch (step) {
        case 1: // Basic Info
          if (!formData.title || formData.title.trim() === '') {
            errors.title = "Title is required";
          }
          if (!formData.category) {
            errors.category = "Category is required";
          }
          if (!formData.priority) {
            errors.priority = "Priority is required";
          }
          if (!formData.businessJustification || formData.businessJustification.trim() === '') {
            errors.businessJustification = "Business justification is required";
          }
          if (!formData.department || formData.department.trim() === '') {
            errors.department = "Department is required";
          }
          if (!formData.costCenter || formData.costCenter.trim() === '') {
            errors.costCenter = "Cost center is required";
          }
          if (!formData.estimatedBudget || formData.estimatedBudget <= 0) {
            errors.estimatedBudget = "Valid estimated budget is required";
          }
          break;
          
        case 2: // Details
          if (formData.category === "expert") {
            if (!formData.specialization || formData.specialization.trim() === '') {
              errors.specialization = "Specialization is required";
            }
            if (!formData.description || formData.description.trim() === '') {
              errors.description = "Description is required";
            }
          } else if (formData.category === "product") {
            if (!formData.productSpecifications || formData.productSpecifications.trim() === '') {
              errors.productSpecifications = "Product specifications are required";
            }
            if (!formData.quantity || formData.quantity <= 0) {
              errors.quantity = "Valid quantity is required";
            }
          } else if (formData.category === "service") {
            if (!formData.serviceDescription || formData.serviceDescription.trim() === '') {
              errors.serviceDescription = "Service description is required";
            }
            if (!formData.scopeOfWork || formData.scopeOfWork.trim() === '') {
              errors.scopeOfWork = "Scope of work is required";
            }
            if (!formData.performanceMetrics || formData.performanceMetrics.trim() === '') {
              errors.performanceMetrics = "Performance metrics are required";
            }
            if (!formData.location || formData.location.trim() === '') {
              errors.location = "Location is required";
            }
          } else if (formData.category === "logistics") {
            if (!formData.equipmentType || formData.equipmentType.trim() === '') {
              errors.equipmentType = "Equipment type is required";
            }
            if (!formData.pickupLocation || formData.pickupLocation.trim() === '') {
              errors.pickupLocation = "Pickup location is required";
            }
            if (!formData.deliveryLocation || formData.deliveryLocation.trim() === '') {
              errors.deliveryLocation = "Delivery location is required";
            }
          }
          break;
          
        case 3: // Documents (optional)
          break;
          
        case 4: // Approval Workflow
          // Validation handled by approval context
          break;
          
        case 5: // Preview
          break;
          
        case 6: // Publish
          if (!formData.submissionDeadline) {
            errors.submissionDeadline = "Submission deadline is required";
          }
          if (!formData.evaluationCriteria || formData.evaluationCriteria.length === 0) {
            errors.evaluationCriteria = "At least one evaluation criterion must be selected";
          }
          if (!formData.termsAccepted) {
            errors.termsAccepted = "You must accept the terms and conditions";
          }
          break;
      }

      console.log("Validation errors for step", step, ":", errors);
      setStepErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      console.error("Error during validation:", error);
      setStepErrors({ general: "Validation error occurred" });
      return false;
    }
  }, [formData]);

  const isFormValid = useCallback(() => {
    // Check all required steps
    for (let step = 1; step <= 6; step++) {
      if (!validateStep(step)) {
        return false;
      }
    }
    return true;
  }, [validateStep]);

  return (
    <RequirementContext.Provider value={{
      formData,
      updateFormData,
      loadDraftData,
      resetForm,
      validateStep,
      stepErrors,
      isFormValid,
      saveAsDraft,
      draftId,
      isSaving,
      lastSaved
    }}>
      {children}
    </RequirementContext.Provider>
  );
};

export const useRequirement = () => {
  const context = useContext(RequirementContext);
  if (context === undefined) {
    throw new Error('useRequirement must be used within a RequirementProvider');
  }
  return context;
};
