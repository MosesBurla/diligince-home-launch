import { CompanyProfile, REQUIRED_FIELDS } from '@/types/verification';

export const calculateProfileCompletion = (profile: Partial<CompanyProfile> | null): number => {
  if (!profile) return 0;
  
  let filledCount = 0;
  const totalRequired = REQUIRED_FIELDS.length;
  
  REQUIRED_FIELDS.forEach(field => {
    if (field === 'addresses') {
      if (profile.addresses && profile.addresses.length > 0) {
        const hasCompleteAddress = profile.addresses.some(addr => 
          addr.line1?.trim() && 
          addr.city?.trim() && 
          addr.state?.trim() && 
          addr.pincode?.trim()
        );
        if (hasCompleteAddress) filledCount++;
      }
    } else {
      const value = profile[field as keyof CompanyProfile];
      if (value && String(value).trim() !== '') {
        filledCount++;
      }
    }
  });
  
  return Math.round((filledCount / totalRequired) * 100);
};

export const getMissingFields = (profile: Partial<CompanyProfile> | null): string[] => {
  if (!profile) return [...REQUIRED_FIELDS] as any;
  
  const missing: string[] = [];
  const labels: Record<string, string> = {
    companyName: 'Company Name',
    industryType: 'Industry Type',
    companyDescription: 'Company Description',
    yearEstablished: 'Year Established',
    panNumber: 'PAN Number',
    gstNumber: 'GST Number',
    registrationNumber: 'Registration Number',
    email: 'Email',
    mobile: 'Mobile Number',
    addresses: 'Complete Address'
  };
  
  REQUIRED_FIELDS.forEach(field => {
    if (field === 'addresses') {
      const hasCompleteAddress = profile.addresses?.some(addr => 
        addr.line1?.trim() && addr.city?.trim() && addr.state?.trim() && addr.pincode?.trim()
      );
      if (!hasCompleteAddress) missing.push(labels[field]);
    } else {
      const value = profile[field as keyof CompanyProfile];
      if (!value || String(value).trim() === '') {
        missing.push(labels[field]);
      }
    }
  });
  
  return missing;
};

export const canSubmitForVerification = (profile: Partial<CompanyProfile> | null): boolean => {
  if (calculateProfileCompletion(profile) !== 100) return false;
  
  // Additional validation: Company Description must be at least 50 characters
  if (!profile?.companyDescription || profile.companyDescription.length < 50) {
    return false;
  }
  
  // Required documents validation
  const documents = profile?.documents || [];
  const hasPANCard = documents.some(doc => doc.documentType === 'pan_card');
  const hasGSTCert = documents.some(doc => doc.documentType === 'gst_certificate');
  const hasRegCert = documents.some(doc => doc.documentType === 'registration_certificate');
  const hasAddressProof = documents.some(doc => doc.documentType === 'address_proof');
  
  if (!hasPANCard || !hasGSTCert || !hasRegCert || !hasAddressProof) {
    return false;
  }
  
  return true;
};

export const getMissingDocuments = (profile: Partial<CompanyProfile> | null): string[] => {
  const missing: string[] = [];
  const documents = profile?.documents || [];
  
  if (!documents.some(doc => doc.documentType === 'pan_card')) {
    missing.push('PAN Card');
  }
  if (!documents.some(doc => doc.documentType === 'gst_certificate')) {
    missing.push('GST Certificate');
  }
  if (!documents.some(doc => doc.documentType === 'registration_certificate')) {
    missing.push('Registration Certificate');
  }
  if (!documents.some(doc => doc.documentType === 'address_proof')) {
    missing.push('Address Proof');
  }
  
  return missing;
};
