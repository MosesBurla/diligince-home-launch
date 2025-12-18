import apiService from '../../core/api.service';
import { companyProfileRoutes } from './company-profile.routes';
import { CompanyProfile, VerificationDocument } from '@/types/verification';
import errorHandler from '@/utils/errorHandler.utils';

export interface SaveProfileResponse {
  success: boolean;
  data: CompanyProfile | { profile: CompanyProfile };
  message?: string;
}

export interface SubmitVerificationResponse {
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

export interface UploadDocumentResponse {
  success: boolean;
  data: {
    document: VerificationDocument;
    replacedDocument?: {
      id: string;
      name: string;
    };
  };
  message?: string;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message?: string;
}

/**
 * Company Profile Service
 * Handles all company profile related API calls
 */
class CompanyProfileService {
  /**
   * Get company profile
   */
  async getProfile(): Promise<CompanyProfile | null> {
    try {
      const response = await apiService.get<{
        success: boolean;
        data: {
          profile: CompanyProfile;
          missingFields: string[];
          missingDocuments: string[];
        }
      }>(companyProfileRoutes.get);
      return response.data.profile;
    } catch (error: any) {
      // If profile doesn't exist (404), return null silently for new users
      // This prevents annoying error popups on first login
      if (error.response?.status === 404) {
        console.info('No company profile found - new user will need to create one');
        return null;
      }

      // For other errors, show the error popup
      errorHandler.handleApiError(error, 'Failed to load profile');
      throw error;
    }
  }

  /**
   * Save or update company profile
   */
  async saveProfile(profile: Partial<CompanyProfile>): Promise<SaveProfileResponse> {
    try {
      return await apiService.post<SaveProfileResponse, Partial<CompanyProfile>>(
        companyProfileRoutes.save,
        profile
      );
    } catch (error) {
      errorHandler.handleApiError(error, 'Failed to save profile');
      throw error;
    }
  }

  /**
   * Upload a verification document
   */
  async uploadDocument(
    file: File,
    documentType: VerificationDocument['documentType']
  ): Promise<UploadDocumentResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      return await apiService.post<UploadDocumentResponse, FormData>(
        companyProfileRoutes.uploadDocument,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      errorHandler.handleApiError(error, 'Failed to upload document');
      throw error;
    }
  }

  /**
   * Delete a verification document
   */
  async deleteDocument(documentId: string): Promise<DeleteDocumentResponse> {
    try {
      return await apiService.remove<DeleteDocumentResponse>(
        companyProfileRoutes.deleteDocument(documentId)
      );
    } catch (error) {
      errorHandler.handleApiError(error, 'Failed to delete document');
      throw error;
    }
  }

  /**
   * Submit profile for verification
   */
  async submitForVerification(): Promise<SubmitVerificationResponse> {
    try {
      return await apiService.post<SubmitVerificationResponse, { confirmSubmission: boolean }>(
        companyProfileRoutes.submitVerification,
        { confirmSubmission: true }
      );
    } catch (error) {
      errorHandler.handleApiError(error, 'Failed to submit for verification');
      throw error;
    }
  }
}

export const companyProfileService = new CompanyProfileService();
export default companyProfileService;
