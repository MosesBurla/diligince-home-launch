export interface CertificationDocument {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface VendorCertification {
  _id: string;
  vendorId: string;
  name: string;
  issuingBody: string;
  certificationNumber?: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending_renewal';
  category: string;
  description?: string;
  document?: CertificationDocument;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationRequest {
  name: string;
  issuingBody: string;
  certificationNumber?: string;
  issueDate: string;
  expiryDate?: string;
  category: string;
  description?: string;
}

export interface UpdateCertificationRequest extends Partial<CreateCertificationRequest> {}

export interface CertificationsListResponse {
  certifications: VendorCertification[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}
