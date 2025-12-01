export enum VerificationStatus {
  INCOMPLETE = 'incomplete',
  PENDING = 'pending', 
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type VendorDocumentType = 
  // Mandatory for all vendors
  | 'gst_certificate' 
  | 'pan_card'
  | 'registration_certificate'
  
  // Service Vendor specific
  | 'service_certifications'
  | 'insurance_certificate'
  | 'technical_qualifications'
  
  // Product Vendor specific
  | 'product_certifications'
  | 'quality_certificates'
  | 'manufacturer_authorization'
  | 'product_catalog'
  
  // Logistics Vendor specific
  | 'transport_license'
  | 'vehicle_registration'
  | 'goods_insurance'
  | 'warehouse_license';

export interface VerificationDocument {
  id: string;
  name: string;
  type: string; // MIME type
  size: number; // bytes
  url: string; // preview/download URL
  documentType: 'gst_certificate' | 'registration_certificate' | 'pan_card' | 'company_logo' | 'address_proof' | 'authorization_letter' | VendorDocumentType;
  uploadedAt: Date;
  status?: 'pending' | 'verified' | 'rejected';
  remarks?: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isPrimary: boolean;
}

export interface CompanyProfile {
  // Basic Info
  companyName: string;
  industryType: string;
  companyDescription: string;
  yearEstablished: string;
  
  // Legal
  panNumber: string;
  gstNumber: string;
  registrationNumber: string;
  
  // Contact
  email: string;
  mobile: string;
  telephone?: string;
  website?: string;
  
  // Address
  addresses: Address[];
  
  // Documents
  documents?: VerificationDocument[];
  
  // Verification
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string;
  verificationCompletedAt?: string;
  verificationRemarks?: string;
  
  // Completion
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
}

export const REQUIRED_FIELDS = [
  'companyName',
  'industryType',
  'companyDescription',
  'yearEstablished',
  'panNumber',
  'gstNumber',
  'registrationNumber',
  'email',
  'mobile',
  'addresses'
] as const;

// Vendor Profile Types
export interface VendorProfile {
  // Basic Info
  businessName: string;
  vendorCategory: 'Service Vendor' | 'Product Vendor' | 'Logistics Vendor';
  specialization: string;
  
  // Legal
  panNumber: string;
  gstNumber: string;
  registrationNumber: string;
  
  // Contact
  email: string;
  mobile: string;
  telephone?: string;
  website?: string;
  
  // Business Details
  primaryIndustry?: string;
  yearsInBusiness?: string;
  businessLocation?: string;
  serviceAreas?: string[];
  
  // Documents
  documents?: VerificationDocument[];
  
  // Verification
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string;
  verificationCompletedAt?: string;
  verificationRemarks?: string;
  
  // Consent
  consentGiven: boolean;
  consentTimestamp?: string;
  
  // Completion
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
}

export const VENDOR_MANDATORY_DOCUMENTS = [
  'gst_certificate',
  'pan_card', 
  'registration_certificate'
] as const;

export const VENDOR_SUBTYPE_DOCUMENTS = {
  'Service Vendor': ['service_certifications', 'insurance_certificate'],
  'Product Vendor': ['product_certifications', 'quality_certificates'],
  'Logistics Vendor': ['transport_license', 'vehicle_registration']
} as const;
