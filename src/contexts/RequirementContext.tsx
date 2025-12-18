import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRequirementDraft } from '@/hooks/useRequirementDraft';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { RequirementFormData } from '@/types/requirement-form.types';

// Re-export for backward compatibility
export type { RequirementFormData } from '@/types/requirement-form.types';

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
  loadDraftById: (draftId: string) => Promise<RequirementFormData | null>;
  // Auto-save control
  isActivelyEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
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
  specialization: [],
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
  const [isActivelyEditing, setIsActivelyEditing] = useState(false);
  const { draftId, draftIdRef, isSaving, lastSaved, initializeDraft, forceSave, clearDraftState, loadDraft } = useRequirementDraft();
  const { isAuthenticated } = useUser();

  // Start editing mode - enables auto-save
  const startEditing = useCallback(() => {
    console.log("🟢 Auto-save: Started editing mode");
    setIsActivelyEditing(true);
  }, []);

  // Stop editing mode - disables auto-save
  const stopEditing = useCallback(() => {
    console.log("🔴 Auto-save: Stopped editing mode");
    setIsActivelyEditing(false);
  }, []);

  // Check if auto-save should run
  // IMPORTANT: Auto-save must work for ALL editable statuses per user requirement
  // Only blocked when already sent for approval
  const shouldAutoSave = useCallback(() => {
    if (!isAuthenticated) return false;
    if (!isActivelyEditing) return false;

    // Don't auto-save if already sent for approval
    // This is the ONLY blocker - user can edit at any status otherwise
    if (formData.isSentForApproval) return false;

    // Allow auto-save for all editable statuses
    // Previously limited to 'draft' and 'rejected', now expanded per user requirement
    const status = formData.status || 'draft';
    const editableStatuses = ['draft', 'rejected', 'approved', 'published'];

    // Don't auto-save archived requirements
    if (status === 'archived') return false;

    return editableStatuses.includes(status);
  }, [isAuthenticated, isActivelyEditing, formData.status, formData.isSentForApproval]);

  // Load draft by ID and update form data (single source of truth)
  const loadDraftById = useCallback(async (draftIdToLoad: string): Promise<RequirementFormData | null> => {
    try {
      console.log("🟡 Context: Loading draft by ID:", draftIdToLoad);
      const draftData = await loadDraft(draftIdToLoad);

      if (draftData && Object.keys(draftData).length > 0) {
        console.log("🟢 Context: Draft loaded, updating form data");
        setFormData(draftData);
        setStepErrors({});
        return draftData;
      }

      return null;
    } catch (error) {
      console.error("🔴 Context: Failed to load draft:", error);
      throw error;
    }
  }, [loadDraft]);

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

  // Cleanup on logout - reset form and clear draft state
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User logged out, resetting requirement form...");
      resetForm();
      clearDraftState();
    }
  }, [isAuthenticated, resetForm, clearDraftState]);

  // Auto-save every 30 seconds only when actively editing
  useEffect(() => {
    // Skip if auto-save conditions not met
    if (!shouldAutoSave() || isFormEmpty()) {
      return;
    }

    const autoSaveInterval = setInterval(async () => {
      // Double-check conditions before each save attempt
      if (!shouldAutoSave()) {
        console.log("Auto-save: Conditions not met, skipping...");
        return;
      }

      try {
        // Use ref for immediate value check to avoid stale closure
        if (!draftIdRef.current) {
          console.log("Auto-save: Creating new draft...");
          await initializeDraft(formData);
        } else {
          console.log("Auto-save: Updating existing draft:", draftIdRef.current);
          await forceSave(formData, false); // Silent save
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData, draftIdRef, initializeDraft, forceSave, isFormEmpty, shouldAutoSave]);

  const saveAsDraft = useCallback(async () => {
    if (isFormEmpty()) {
      toast.error("Cannot save empty form. Please fill in at least one field.");
      return;
    }

    console.log("Saving draft:", formData);
    try {
      // Use draftIdRef for reliable synchronous check
      if (!draftIdRef.current) {
        await initializeDraft(formData);
        toast.success("Draft created successfully");
      } else {
        await forceSave(formData, false); // Silent save, we show toast below
        toast.success("Draft saved successfully");
      }
      localStorage.setItem('requirement-draft', JSON.stringify(formData));
    } catch (error: any) {
      console.error("Failed to save draft:", error);

      if (!navigator.onLine) {
        toast.error("You're offline. Changes saved locally.");
      } else {
        // Check if it's a validation error (422) and show the specific message
        if (error?.response?.status === 422 && error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to save draft");
        }
      }

      localStorage.setItem('requirement-draft', JSON.stringify(formData));
    }
  }, [formData, draftIdRef, initializeDraft, forceSave, isFormEmpty]);

  const validateStep = useCallback((step: number) => {
    console.log("Validating step:", step, "with formData:", formData);
    const errors: Record<string, string> = {};

    try {
      switch (step) {
        case 1: // Basic Info
          if (!formData.title || formData.title.trim() === '') {
            errors.title = "Title is required";
          }
          if (!formData.category || formData.category.length === 0) {
            errors.category = "At least one category is required";
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
          if (formData.category?.includes("expert")) {
            if (!formData.specialization || formData.specialization.length === 0) {
              errors.specialization = "At least one specialization is required";
            }
            if (!formData.description || formData.description.trim() === '') {
              errors.description = "Description is required";
            }
          }
          if (formData.category?.includes("product")) {
            if (!formData.productSpecifications || formData.productSpecifications.trim() === '') {
              errors.productSpecifications = "Product specifications are required";
            }
            if (!formData.quantity || formData.quantity <= 0) {
              errors.quantity = "Valid quantity is required";
            }
          }
          if (formData.category?.includes("service")) {
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
          }
          if (formData.category?.includes("logistics")) {
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
          const requiresApproval = (formData.estimatedBudget || 0) > 10000 ||
            formData.priority === 'critical' ||
            formData.priority === 'high' ||
            formData.complianceRequired;

          if (requiresApproval && !formData.selectedApprovalMatrixId) {
            errors.selectedApprovalMatrix = "Please select an approval matrix to proceed";
          }
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
      lastSaved,
      loadDraftById,
      isActivelyEditing,
      startEditing,
      stopEditing,
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
