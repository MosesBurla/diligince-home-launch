import { VendorProfile, VerificationDocument, VENDOR_MANDATORY_DOCUMENTS, VENDOR_SUBTYPE_DOCUMENTS, VendorDocumentType } from '@/types/verification';

// Field display names for UI
const FIELD_DISPLAY_NAMES: Record<string, string> = {
  businessName: 'Business Name',
  vendorCategory: 'Vendor Category',
  specialization: 'Specialization',
  panNumber: 'PAN Number',
  gstNumber: 'GST Number',
  registrationNumber: 'Registration Number',
  email: 'Email Address',
  mobile: 'Mobile Number',
  primaryIndustry: 'Primary Industry',
  yearsInBusiness: 'Years in Business',
  businessLocation: 'Business Location',
};

// Required fields for vendor profile completion
const VENDOR_REQUIRED_FIELDS = [
  'businessName',
  'panNumber',
  'gstNumber',
  'registrationNumber',
  'email',
  'mobile',
] as const;

// Optional fields that contribute to completion
const VENDOR_OPTIONAL_FIELDS = [
  'specialization',
  'primaryIndustry',
  'yearsInBusiness',
  'businessLocation',
  'telephone',
  'website',
] as const;

export interface VendorCompletionResult {
  percentage: number;
  missingFields: string[];
  missingDocuments: string[];
  isComplete: boolean;
  canSubmitForVerification: boolean;
  completedFields: number;
  totalFields: number;
  completedDocuments: number;
  totalDocuments: number;
}

/**
 * Get required documents for a vendor type
 */
export const getVendorRequiredDocuments = (
  vendorCategory: string
): VendorDocumentType[] => {
  const mandatoryDocs = [...VENDOR_MANDATORY_DOCUMENTS] as VendorDocumentType[];
  
  const categoryKey = vendorCategory as keyof typeof VENDOR_SUBTYPE_DOCUMENTS;
  const subtypeDocs = VENDOR_SUBTYPE_DOCUMENTS[categoryKey] || [];
  
  return [...mandatoryDocs, ...subtypeDocs] as VendorDocumentType[];
};

/**
 * Get display name for document type
 */
export const getDocumentDisplayName = (docType: string): string => {
  const displayNames: Record<string, string> = {
    gst_certificate: 'GST Certificate',
    pan_card: 'PAN Card',
    registration_certificate: 'Registration Certificate',
    service_certifications: 'Service Certifications',
    insurance_certificate: 'Insurance Certificate',
    technical_qualifications: 'Technical Qualifications',
    product_certifications: 'Product Certifications',
    quality_certificates: 'Quality Certificates',
    manufacturer_authorization: 'Manufacturer Authorization',
    product_catalog: 'Product Catalog',
    transport_license: 'Transport License',
    vehicle_registration: 'Vehicle Registration',
    goods_insurance: 'Goods Insurance',
    warehouse_license: 'Warehouse License',
  };
  
  return displayNames[docType] || docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Calculate vendor profile completion percentage and missing items
 */
export const calculateVendorProfileCompletion = (
  profile: Partial<VendorProfile> | null
): VendorCompletionResult => {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: VENDOR_REQUIRED_FIELDS.map(f => FIELD_DISPLAY_NAMES[f] || f),
      missingDocuments: getVendorRequiredDocuments('Service Vendor').map(getDocumentDisplayName),
      isComplete: false,
      canSubmitForVerification: false,
      completedFields: 0,
      totalFields: VENDOR_REQUIRED_FIELDS.length,
      completedDocuments: 0,
      totalDocuments: getVendorRequiredDocuments('Service Vendor').length,
    };
  }

  const vendorCategory = profile.vendorCategory || 'Service Vendor';
  const requiredDocs = getVendorRequiredDocuments(vendorCategory);
  
  // Calculate field completion
  const missingFields: string[] = [];
  let completedFields = 0;
  
  for (const field of VENDOR_REQUIRED_FIELDS) {
    const value = profile[field as keyof VendorProfile];
    if (value && String(value).trim()) {
      completedFields++;
    } else {
      missingFields.push(FIELD_DISPLAY_NAMES[field] || field);
    }
  }
  
  // Add optional fields to completion calculation (weighted less)
  let optionalFieldsCompleted = 0;
  for (const field of VENDOR_OPTIONAL_FIELDS) {
    const value = profile[field as keyof VendorProfile];
    if (value && String(value).trim()) {
      optionalFieldsCompleted++;
    }
  }

  // Calculate document completion
  const uploadedDocTypes = (profile.documents || []).map(doc => doc.documentType);
  const missingDocuments: string[] = [];
  let completedDocuments = 0;
  
  for (const docType of requiredDocs) {
    if (uploadedDocTypes.includes(docType)) {
      completedDocuments++;
    } else {
      missingDocuments.push(getDocumentDisplayName(docType));
    }
  }

  // Calculate percentage (60% fields, 40% documents)
  const fieldWeight = 60;
  const docWeight = 40;
  
  const fieldPercentage = (completedFields / VENDOR_REQUIRED_FIELDS.length) * fieldWeight;
  const docPercentage = (completedDocuments / requiredDocs.length) * docWeight;
  
  // Add bonus for optional fields (up to 10% extra)
  const optionalBonus = Math.min((optionalFieldsCompleted / VENDOR_OPTIONAL_FIELDS.length) * 10, 10);
  
  const percentage = Math.round(Math.min(fieldPercentage + docPercentage + optionalBonus, 100));
  
  const isComplete = missingFields.length === 0 && missingDocuments.length === 0;
  const canSubmitForVerification = isComplete;

  return {
    percentage,
    missingFields,
    missingDocuments,
    isComplete,
    canSubmitForVerification,
    completedFields,
    totalFields: VENDOR_REQUIRED_FIELDS.length,
    completedDocuments,
    totalDocuments: requiredDocs.length,
  };
};

/**
 * Check if vendor can submit for verification
 */
export const canVendorSubmitForVerification = (
  profile: Partial<VendorProfile> | null
): { canSubmit: boolean; reason?: string } => {
  if (!profile) {
    return { canSubmit: false, reason: 'Profile not found' };
  }
  
  const completion = calculateVendorProfileCompletion(profile);
  
  if (completion.missingFields.length > 0) {
    return { 
      canSubmit: false, 
      reason: `Complete required fields: ${completion.missingFields.slice(0, 3).join(', ')}${completion.missingFields.length > 3 ? '...' : ''}` 
    };
  }
  
  if (completion.missingDocuments.length > 0) {
    return { 
      canSubmit: false, 
      reason: `Upload required documents: ${completion.missingDocuments.slice(0, 3).join(', ')}${completion.missingDocuments.length > 3 ? '...' : ''}` 
    };
  }
  
  return { canSubmit: true };
};

/**
 * Get verification status display info
 */
export const getVerificationStatusInfo = (status: string): {
  label: string;
  color: string;
  bgColor: string;
  icon: 'check' | 'clock' | 'x' | 'alert';
} => {
  switch (status) {
    case 'approved':
      return {
        label: 'Verified',
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
        icon: 'check',
      };
    case 'pending':
      return {
        label: 'Pending Verification',
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30',
        icon: 'clock',
      };
    case 'rejected':
      return {
        label: 'Verification Rejected',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        icon: 'x',
      };
    default:
      return {
        label: 'Not Verified',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted',
        icon: 'alert',
      };
  }
};
