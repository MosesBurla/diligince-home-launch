import toast from './toast.utils';

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    statusCode: number;
  };
}

// Error code to user-friendly message mapping
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication Errors
  'USER_NOT_FOUND': 'User account not found. Please log in again.',
  'UNAUTHORIZED': 'Your session has expired. Please log in again.',
  
  // Profile Errors
  'PROFILE_NOT_FOUND': 'Company profile not found. Please create one.',
  'PROFILE_LOCKED': 'Profile is locked and cannot be modified.',
  'ALREADY_SUBMITTED': 'Profile has already been submitted for verification.',
  'INCOMPLETE_PROFILE': 'Profile is incomplete. Please complete all required fields.',
  
  // Document Errors
  'NO_FILE': 'Please select a file to upload.',
  'INVALID_FILE_TYPE': 'Invalid file type. Accepted formats: PDF, JPG, PNG',
  'FILE_TOO_LARGE': 'File size exceeds the maximum limit.',
  'DOCUMENT_NOT_FOUND': 'Document not found.',
  'INVALID_DOCUMENT_TYPE': 'Invalid document type.',
  
  // Validation Errors
  'VALIDATION_ERROR': 'Please check your input and try again.',
  'CONFIRMATION_REQUIRED': 'Please confirm your submission.',
  
  // System Errors
  'INTERNAL_ERROR': 'Server error. Please try again later.',
  'NETWORK_ERROR': 'Network connection error. Please check your internet.',
};

class ErrorHandler {
  /**
   * Handle API error and show appropriate toast
   */
  handleApiError(error: any, customMessage?: string): void {
    console.error('API Error:', error);

    // Network error (no response)
    if (!error.response) {
      toast.error(
        customMessage || 'Network Error',
        {
          description: 'Please check your internet connection and try again.',
          duration: 5000,
        }
      );
      return;
    }

    const response = error.response?.data as ApiErrorResponse;
    const errorCode = response?.error?.code;
    const errorMessage = response?.error?.message;
    const statusCode = error.response?.status || response?.error?.statusCode;

    // Get user-friendly message
    const friendlyMessage = errorCode 
      ? ERROR_MESSAGES[errorCode] || errorMessage 
      : errorMessage || customMessage || 'An error occurred';

    // Choose toast type based on status code
    if (statusCode === 401 || statusCode === 403) {
      // Unauthorized/Forbidden - Warning
      toast.warning(friendlyMessage, {
        description: response?.error?.details,
        duration: 5000,
      });
    } else if (statusCode === 404) {
      // Not Found - Info
      toast.info(friendlyMessage, {
        description: 'The requested resource was not found.',
        duration: 4000,
      });
    } else if (statusCode === 422 || statusCode === 400) {
      // Validation Error - Error
      toast.error(friendlyMessage, {
        description: this.formatValidationDetails(response?.error?.details),
        duration: 6000,
      });
    } else if (statusCode === 413) {
      // Payload Too Large - Warning
      toast.warning(friendlyMessage, {
        description: 'Please reduce the file size and try again.',
        duration: 5000,
      });
    } else if (statusCode === 409) {
      // Conflict - Warning
      toast.warning(friendlyMessage, {
        description: response?.error?.details?.currentStatus 
          ? `Current status: ${response.error.details.currentStatus}`
          : undefined,
        duration: 5000,
      });
    } else if (statusCode >= 500) {
      // Server Error - Error
      toast.error('Server Error', {
        description: 'Something went wrong on our end. Please try again later.',
        duration: 5000,
      });
    } else {
      // Generic Error
      toast.error(friendlyMessage, {
        description: response?.error?.details,
        duration: 5000,
      });
    }
  }

  /**
   * Format validation error details for display
   */
  private formatValidationDetails(details: any): string | undefined {
    if (!details) return undefined;

    if (typeof details === 'string') return details;

    // Handle array of missing items
    if (details.missingFields?.length > 0 || details.missingDocuments?.length > 0) {
      const missing = [
        ...(details.missingFields || []),
        ...(details.missingDocuments || []),
      ];
      return `Missing: ${missing.join(', ')}`;
    }

    // Handle required actions
    if (details.requiredActions?.length > 0) {
      return details.requiredActions[0];
    }

    // Handle field-specific validation
    if (details.field) {
      return `${details.field}: ${details.message || 'Invalid value'}`;
    }

    return undefined;
  }

  /**
   * Handle success responses
   */
  handleSuccess(message: string, description?: string): void {
    toast.success(message, {
      description,
      duration: 4000,
    });
  }

  /**
   * Show loading toast for async operations
   */
  showLoading(message: string = 'Processing...'): string | number {
    return toast.loading(message);
  }

  /**
   * Update loading toast to success
   */
  updateSuccess(toastId: string | number, message: string, description?: string): void {
    toast.dismiss(toastId);
    toast.success(message, { description });
  }

  /**
   * Update loading toast to error
   */
  updateError(toastId: string | number, message: string, description?: string): void {
    toast.dismiss(toastId);
    toast.error(message, { description });
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;
