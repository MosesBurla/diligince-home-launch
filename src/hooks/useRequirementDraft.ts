// Custom hook for managing requirement drafts

import { useState, useCallback, useEffect, useRef } from "react";
import { RequirementFormData } from "@/types/requirement-form.types";
import requirementDraftService from "@/services/requirement-draft.service";
import {
  ApprovalWorkflowRequest,
  PublishRequirementRequest,
} from "@/types/requirement-draft";
import { toast } from "sonner";

// Debounce utility
function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
      setTimeoutId(newTimeoutId);
    }) as T,
    [callback, delay, timeoutId]
  );
}

// Helper to check if auth token exists
const isAuthValid = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const useRequirementDraft = () => {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for immediate access (avoids stale closure issues)
  const draftIdRef = useRef<string | null>(null);
  const isCreatingDraftRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    draftIdRef.current = draftId;
  }, [draftId]);

  // Load draft ID from localStorage on mount
  useEffect(() => {
    const savedDraftId = localStorage.getItem("requirement-draft-id");
    if (savedDraftId) {
      setDraftId(savedDraftId);
      draftIdRef.current = savedDraftId; // Sync ref immediately
    }
  }, []);

  /**
   * Clear draft state (called on logout)
   */
  const clearDraftState = useCallback(() => {
    setDraftId(null);
    draftIdRef.current = null;
    setLastSaved(null);
    setError(null);
    localStorage.removeItem("requirement-draft");
    localStorage.removeItem("requirement-draft-id");
    console.log("Draft state cleared");
  }, []);

  /**
   * Initialize or resume draft
   */
  const initializeDraft = useCallback(
    async (data?: Partial<RequirementFormData>) => {
      // Check auth before API call
      if (!isAuthValid()) {
        console.log("No auth token, skipping draft creation");
        return null;
      }

      // Prevent concurrent draft creations
      if (isCreatingDraftRef.current) {
        console.log("Draft creation already in progress, skipping...");
        return draftIdRef.current;
      }

      // If we already have a draft ID, don't create another
      if (draftIdRef.current) {
        console.log("Draft already exists:", draftIdRef.current);
        return draftIdRef.current;
      }

      try {
        isCreatingDraftRef.current = true;
        setIsSaving(true);
        setError(null);

        const response = await requirementDraftService.createDraft(data);
        const newDraftId = response.data.draftId;

        // Update both state and ref immediately
        setDraftId(newDraftId);
        draftIdRef.current = newDraftId; // Immediate sync
        setLastSaved(new Date());
        localStorage.setItem("requirement-draft-id", newDraftId);

        console.log("Draft created with ID:", newDraftId);
        return newDraftId;
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to initialize draft";
        setError(errorMsg);
        console.error("Initialize draft error:", err);
        throw err;
      } finally {
        setIsSaving(false);
        isCreatingDraftRef.current = false;
      }
    },
    []
  );

  /**
   * Auto-save draft (debounced)
   */
  const saveDraft = useDebouncedCallback(
    async (data: Partial<RequirementFormData>) => {
      // Check auth before API call
      if (!isAuthValid()) {
        console.log("No auth token, skipping auto-save");
        return;
      }

      const currentDraftId = draftIdRef.current;
      
      if (!currentDraftId) {
        console.warn("No draft ID available for save");
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        await requirementDraftService.updateDraft(currentDraftId, data);
        setLastSaved(new Date());

        // Also save to localStorage as backup
        localStorage.setItem("requirement-draft", JSON.stringify(data));
      } catch (err: any) {
        const errorMsg = err?.message || "Auto-save failed";
        setError(errorMsg);
        console.error("Auto-save error:", err);
        // Don't show toast for auto-save failures to avoid annoying user
      } finally {
        setIsSaving(false);
      }
    },
    2000
  );

  /**
   * Force save draft immediately (no debounce)
   * @param showToast - Whether to show success toast (default: false for silent auto-save)
   */
  const forceSave = useCallback(
    async (data: Partial<RequirementFormData>, showToast: boolean = false) => {
      // Check auth before API call
      if (!isAuthValid()) {
        console.log("No auth token, skipping force save");
        return;
      }

      const currentDraftId = draftIdRef.current || draftId;

      if (!currentDraftId) {
        console.warn("No draft ID available for force save, skipping...");
        return; // Return gracefully instead of throwing
      }

      try {
        setIsSaving(true);
        setError(null);

        await requirementDraftService.updateDraft(currentDraftId, data);
        setLastSaved(new Date());
        localStorage.setItem("requirement-draft", JSON.stringify(data));

        if (showToast) {
          toast.success("Draft saved successfully");
        }
      } catch (err: any) {
        const errorMsg = err?.response?.status === 422 && err?.response?.data?.message
          ? err.response.data.message
          : err?.message || "Failed to save draft";
        setError(errorMsg);
        if (showToast) {
          toast.error(errorMsg);
        }
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [draftId]
  );

  /**
   * Load existing draft
   */
  const loadDraft = useCallback(async (draftIdToLoad: string) => {
    try {
      console.log("🔵 loadDraft: Fetching draft", draftIdToLoad);
      setIsSaving(true);
      setError(null);

      const response = await requirementDraftService.getDraft(draftIdToLoad);
      let loadedFormData = response.data.formData;
      
      // Transform document dates from strings to Date objects
      if (loadedFormData?.documents && Array.isArray(loadedFormData.documents)) {
        loadedFormData = {
          ...loadedFormData,
          documents: loadedFormData.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: doc.uploadedAt ? new Date(doc.uploadedAt) : new Date()
          }))
        };
      }
      
      console.log("🟢 loadDraft: Received data", loadedFormData);
      console.log("🟢 loadDraft: Data keys", Object.keys(loadedFormData || {}));
      
      setDraftId(draftIdToLoad);
      draftIdRef.current = draftIdToLoad;
      localStorage.setItem("requirement-draft-id", draftIdToLoad);
      
      // Sync the actual draft data to localStorage
      localStorage.setItem("requirement-draft", JSON.stringify(loadedFormData || {}));

      return loadedFormData;
    } catch (err: any) {
      console.error("🔴 loadDraft: Error", err);
      const errorMsg = err?.message || "Failed to load draft";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Upload documents
   */
  const uploadDocs = useCallback(
    async (files: File[], types: string[]) => {
      if (!draftId) {
        throw new Error("No draft ID available");
      }

      try {
        setError(null);
        const response = await requirementDraftService.uploadDocuments(
          draftId,
          files,
          types
        );
        
        // Validate response structure
        if (!response?.success || !response?.data?.documents) {
          console.error("Invalid upload response:", response);
          throw new Error(response?.message || "Failed to upload documents");
        }
        
        toast.success(`${response.data.uploadedCount || files.length} document(s) uploaded successfully`);
        return response.data.documents;
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to upload documents";
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
    },
    [draftId]
  );

  /**
   * Delete document
   */
  const deleteDoc = useCallback(
    async (documentId: string) => {
      if (!draftId) {
        throw new Error("No draft ID available");
      }

      try {
        setError(null);
        await requirementDraftService.deleteDocument(draftId, documentId);
        toast.success("Document deleted successfully");
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to delete document";
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
    },
    [draftId]
  );

  /**
   * Configure approval workflow
   */
  const configureWorkflow = useCallback(
    async (workflowData: ApprovalWorkflowRequest) => {
      if (!draftId) {
        throw new Error("No draft ID available");
      }

      try {
        setError(null);
        const response = await requirementDraftService.configureApprovalWorkflow(
          draftId,
          workflowData
        );
        toast.success("Approval workflow configured successfully");
        return response.data;
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to configure workflow";
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      }
    },
    [draftId]
  );

  /**
   * Publish requirement (final step)
   */
  const publish = useCallback(
    async (publishData: PublishRequirementRequest) => {
      try {
        setIsSaving(true);
        setError(null);

        const response = await requirementDraftService.publishRequirement(
          publishData
        );

        // Clear draft from localStorage
        localStorage.removeItem("requirement-draft");
        localStorage.removeItem("requirement-draft-id");
        setDraftId(null);

        return response.data;
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to publish requirement";
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  /**
   * Delete draft
   */
  const deleteDraft = useCallback(async () => {
    if (!draftId) {
      throw new Error("No draft ID available");
    }

    try {
      setError(null);
      await requirementDraftService.deleteDraft(draftId);
      
      // Clear local state and storage
      setDraftId(null);
      localStorage.removeItem("requirement-draft");
      localStorage.removeItem("requirement-draft-id");
      
      toast.success("Draft deleted successfully");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to delete draft";
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  }, [draftId]);

  return {
    draftId,
    draftIdRef, // Expose ref for immediate access
    isSaving,
    lastSaved,
    error,
    initializeDraft,
    saveDraft,
    forceSave,
    loadDraft,
    uploadDocs,
    deleteDoc,
    configureWorkflow,
    publish,
    deleteDraft,
    clearDraftState, // Expose for logout cleanup
  };
};
