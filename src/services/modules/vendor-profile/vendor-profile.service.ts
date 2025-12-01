import apiService from '../../core/api.service';
import { vendorProfileRoutes } from './vendor-profile.routes';
import { VendorProfile, VerificationDocument, VendorDocumentType } from '@/types/verification';

export interface SaveVendorProfileResponse {
  success: boolean;
  data: VendorProfile | { profile: VendorProfile };
  message?: string;
}

export interface SubmitVendorVerificationResponse {
  success: boolean;
  data: {
    verificationId: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    estimatedCompletionAt: string;
    estimatedCompletionHours: number;
    isLocked: boolean;
    nextSteps: string[];
  };
  message?: string;
}

export interface UploadVendorDocumentResponse {
  success: boolean;
  data: VerificationDocument;
  message?: string;
}

export interface DeleteVendorDocumentResponse {
  success: boolean;
  message?: string;
}

/**
 * Vendor Profile Service
 * Handles all vendor profile related API calls
 */
class VendorProfileService {
  /**
   * Get vendor profile
   */
  async getProfile(): Promise<VendorProfile> {
    const response = await apiService.get<{ success: boolean; data: VendorProfile }>(
      vendorProfileRoutes.get
    );
    return response.data;
  }

  /**
   * Save or update vendor profile
   */
  async saveProfile(profile: Partial<VendorProfile>): Promise<SaveVendorProfileResponse> {
    return await apiService.post<SaveVendorProfileResponse, Partial<VendorProfile>>(
      vendorProfileRoutes.save,
      profile
    );
  }

  /**
   * Upload a verification document
   */
  async uploadDocument(
    file: File,
    documentType: VendorDocumentType
  ): Promise<UploadVendorDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return await apiService.post<UploadVendorDocumentResponse, FormData>(
      vendorProfileRoutes.uploadDocument,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  /**
   * Delete a verification document
   */
  async deleteDocument(documentId: string): Promise<DeleteVendorDocumentResponse> {
    return await apiService.remove<DeleteVendorDocumentResponse>(
      vendorProfileRoutes.deleteDocument(documentId)
    );
  }

  /**
   * Submit profile for verification with consent
   */
  async submitForVerification(
    consentGiven: boolean,
    consentTimestamp: string
  ): Promise<SubmitVendorVerificationResponse> {
    return await apiService.post<SubmitVendorVerificationResponse, { consentGiven: boolean; consentTimestamp: string }>(
      vendorProfileRoutes.submitVerification,
      { consentGiven, consentTimestamp }
    );
  }
}

export const vendorProfileService = new VendorProfileService();
export default vendorProfileService;
