// Requirement Draft API Service

import apiService from '../../core/api.service';
import { RequirementFormData } from "@/types/requirement-form.types";
import {
  DraftResponse,
  DraftDetailResponse,
  DraftListResponse,
  ValidationResponse,
  DocumentUploadResponse,
  ApprovalWorkflowRequest,
  ApprovalWorkflowResponse,
  PublishRequirementRequest,
  PublishResponse,
  PaginationParams,
} from "@/types/requirement-draft";
import { draftsRoutes } from './drafts.routes';
import { requirementsRoutes } from './requirements.routes';

class RequirementDraftService {
  // ============= Helper Methods =============

  /**
   * Allowed keys from backend validator - sanitize data before sending
   */
  private readonly allowedUpdateKeys = [
    // Step & Status
    'currentStep', 'completedSteps', 'approvalStatus', 'emergencyPublished',
    'isValid', 'retryCount', 'savedToCloud', 'termsAccepted',
    
    // Timestamps
    'lastSaved', 'expiresAt', 'createdAt', 'updatedAt', 'lastModifiedBy',
    
    // General Details
    'title', 'category', 'priority', 'description', 'businessJustification',
    'department', 'costCenter', 'requestedBy',
    
    // Budget
    'estimatedBudget', 'budgetApproved', 'budget',
    
    // Urgency & Compliance
    'urgency', 'isUrgent', 'complianceRequired', 'riskLevel',
    
    // Skills/Expertise
    'specialization', 'certifications', 'technicalStandards',
    
    // Time & Duration
    'duration', 'startDate', 'endDate', 'productDeliveryDate',
    'serviceStartDate', 'serviceEndDate', 'serviceBudget',
    
    // Product fields
    'productSpecifications', 'quantity',
    
    // Service fields
    'serviceDescription', 'scopeOfWork', 'performanceMetrics',
    
    // Locations
    'location', 'equipmentType', 'pickupLocation', 'deliveryLocation',
    
    // Logistics
    'weight', 'dimensions', 'pickupDate', 'deliveryDate', 'specialHandling',
    
    // Approval workflow
    'approvalWorkflowId', 'emergencyPublish', 'emergencyJustification',
    'approvalDeadline', 'submissionDeadline',
    
    // Evaluation
    'evaluationCriteria',
    
    // Vendor Visibility
    'visibility', 'selectedVendors',
    
    // Notifications
    'notifyByEmail', 'notifyByApp',
    
    // Documents
    'documents',
    
    // Approval Matrix
    'selectedApprovalMatrix', 'selectedApprovalMatrixId',
    'isSentForApproval', 'isDeleted', 'status'
  ];

  /**
   * Sanitize form data to only include fields allowed by backend validator
   */
  private sanitizeForUpdate(data: Partial<RequirementFormData>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const key of this.allowedUpdateKeys) {
      if (key in data && data[key as keyof RequirementFormData] !== undefined) {
        sanitized[key] = data[key as keyof RequirementFormData];
      }
    }
    
    console.log("Sanitized draft data keys:", Object.keys(sanitized));
    return sanitized;
  }
  
  /**
   * Retry request with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries exceeded");
  }

  // ============= Draft Management =============

  /**
   * Create a new draft requirement
   */
  async createDraft(data?: Partial<RequirementFormData>): Promise<DraftResponse> {
    try {
      // Sanitize data to only include backend-allowed fields
      const sanitizedData = data ? this.sanitizeForUpdate(data) : {};
      
      const response = await apiService.post<DraftResponse, Record<string, any>>(
        draftsRoutes.create,
        sanitizedData
      );
      console.log("Draft created:", response);
      return response;
    } catch (error) {
      console.error("Failed to create draft:", error);
      throw error;
    }
  }

  /**
   * Update an existing draft with partial data (with retry logic)
   */
  async updateDraft(
    draftId: string,
    data: Partial<RequirementFormData>
  ): Promise<DraftResponse> {
    // Validate draftId to prevent invalid API calls
    if (!draftId || draftId === 'undefined' || draftId === 'null') {
      console.error('Invalid draftId provided to updateDraft:', draftId);
      throw new Error('Valid draftId is required for update');
    }

    // Sanitize data to only include backend-allowed fields
    const sanitizedData = this.sanitizeForUpdate(data);

    return this.retryRequest(async () => {
      try {
        // Use POST instead of PUT to match backend implementation
        const response = await apiService.post<DraftResponse, Record<string, any>>(
          draftsRoutes.update(draftId),
          sanitizedData
        );
        console.log("Draft updated:", response);
        return response;
      } catch (error) {
        console.error("Failed to update draft:", error);
        throw error;
      }
    });
  }

  /**
   * Get a specific draft by ID
   */
  async getDraft(draftId: string): Promise<DraftDetailResponse> {
    try {
      const response = await apiService.get<DraftDetailResponse>(
        draftsRoutes.getById(draftId)
      );
      console.log("Draft retrieved:", response);
      return response;
    } catch (error) {
      console.error("Failed to get draft:", error);
      throw error;
    }
  }

  /**
   * Get all drafts for the current user
   */
  async getAllDrafts(params?: PaginationParams): Promise<DraftListResponse> {
    try {
      const url = draftsRoutes.getAll(params);
      const response = await apiService.get<DraftListResponse>(url);
      console.log("Drafts list retrieved:", response);
      return response;
    } catch (error) {
      console.error("Failed to get drafts list:", error);
      throw error;
    }
  }

  /**
   * Delete a draft
   */
  async deleteDraft(draftId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.remove<{ success: boolean; message: string }>(
        draftsRoutes.delete(draftId)
      );
      console.log("Draft deleted:", response);
      return response;
    } catch (error) {
      console.error("Failed to delete draft:", error);
      throw error;
    }
  }

  // ============= Step Operations =============

  /**
   * Validate a specific step
   */
  async validateStep(
    draftId: string,
    step: number,
    data: Partial<RequirementFormData>
  ): Promise<ValidationResponse> {
    try {
      // Flatten the payload: backend expects { currentStep, ...formData } not { step, data: {...} }
      const payload = {
        currentStep: step,
        ...data
      };
      
      const response = await apiService.post<ValidationResponse, any>(
        draftsRoutes.update(draftId),
        payload
      );
      console.log("Step validation result:", response);
      return response;
    } catch (error) {
      console.error("Failed to validate step:", error);
      throw error;
    }
  }

  /**
   * Upload documents for a draft
   */
  async uploadDocuments(
    draftId: string,
    files: File[],
    documentTypes: string[]
  ): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData();
      
      // Append each file with its corresponding documentType
      // Using singular 'documentType' key to match backend enum expectation
      files.forEach((file, index) => {
        formData.append("files", file);
        formData.append("documentType", documentTypes[index] || 'other');
      });

      // Use axios directly for multipart/form-data
      const response = await apiService.post<DocumentUploadResponse, FormData>(
        draftsRoutes.uploadDocuments(draftId),
        formData
      );
      console.log("Documents uploaded:", response);
      return response;
    } catch (error) {
      console.error("Failed to upload documents:", error);
      throw error;
    }
  }

  /**
   * Delete a document from a draft
   */
  async deleteDocument(
    draftId: string,
    documentId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.remove<{ success: boolean; message: string }>(
        draftsRoutes.deleteDocument(draftId, documentId)
      );
      console.log("Document deleted:", response);
      return response;
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw error;
    }
  }

  /**
   * Configure approval workflow for a draft
   */
  async configureApprovalWorkflow(
    draftId: string,
    workflowData: ApprovalWorkflowRequest
  ): Promise<ApprovalWorkflowResponse> {
    try {
      const response = await apiService.post<ApprovalWorkflowResponse, ApprovalWorkflowRequest>(
        draftsRoutes.approvalWorkflow(draftId),
        workflowData
      );
      console.log("Approval workflow configured:", response);
      return response;
    } catch (error) {
      console.error("Failed to configure approval workflow:", error);
      throw error;
    }
  }

  // ============= Final Submission =============

  /**
   * Publish a requirement (final step)
   */
  async publishRequirement(
    publishData: PublishRequirementRequest
  ): Promise<PublishResponse> {
    try {
      const response = await apiService.post<PublishResponse, PublishRequirementRequest>(
        requirementsRoutes.publish,
        publishData
      );
      console.log("Requirement published:", response);
      return response;
    } catch (error) {
      console.error("Failed to publish requirement:", error);
      throw error;
    }
  }
}

export default new RequirementDraftService();
