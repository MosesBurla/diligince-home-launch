import { CompanyProfile, VerificationStatus, VerificationDocument } from '@/types/verification';

export const MOCK_INCOMPLETE_PROFILE: Partial<CompanyProfile> = {
  companyName: "TechPro Industries",
  industryType: "manufacturing",
  verificationStatus: VerificationStatus.INCOMPLETE,
  isProfileComplete: false,
  profileCompletionPercentage: 30,
  addresses: []
};

export const MOCK_COMPLETE_PROFILE: CompanyProfile = {
  companyName: "TechPro Industries",
  industryType: "manufacturing",
  companyDescription: "Leading manufacturer of industrial automation equipment and solutions specialized in cutting-edge technology.",
  yearEstablished: "2010",
  panNumber: "AABCU9603R",
  gstNumber: "27AABCU9603R1Z5",
  registrationNumber: "U74900MH2010PTC123456",
  email: "contact@techpro.com",
  mobile: "+919876543210",
  telephone: "+912240123456",
  website: "https://www.techpro.com",
  addresses: [
    {
      line1: "Plot No. 123, Industrial Area, Phase 2",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isPrimary: true
    }
  ],
  verificationStatus: VerificationStatus.INCOMPLETE,
  isProfileComplete: true,
  profileCompletionPercentage: 100
};

export const mockSaveProfile = async (profile: Partial<CompanyProfile>): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Mock: Saving profile...', profile);
  localStorage.setItem('company_profile', JSON.stringify(profile));
  return { success: true };
};

export const mockSubmitForVerification = async (profile: CompanyProfile): Promise<{
  success: boolean;
  verificationId: string;
  estimatedCompletionAt: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  console.log('Mock: Submitting for verification...', profile);
  
  const profileWithStatus = {
    ...profile,
    verificationStatus: VerificationStatus.PENDING,
    verificationSubmittedAt: new Date().toISOString()
  };
  
  localStorage.setItem('company_profile', JSON.stringify(profileWithStatus));
  localStorage.setItem('verification_status', VerificationStatus.PENDING);
  
  const estimatedCompletionAt = new Date();
  estimatedCompletionAt.setHours(estimatedCompletionAt.getHours() + 24);
  
  return {
    success: true,
    verificationId: `VER${Date.now()}`,
    estimatedCompletionAt: estimatedCompletionAt.toISOString()
  };
};

export const mockCheckVerificationStatus = async (): Promise<{
  status: VerificationStatus;
  remarks?: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const storedStatus = localStorage.getItem('verification_status');
  if (storedStatus) {
    return { status: storedStatus as VerificationStatus };
  }
  
  const stored = localStorage.getItem('company_profile');
  if (stored) {
    const profile = JSON.parse(stored);
    return {
      status: profile.verificationStatus || VerificationStatus.INCOMPLETE,
      remarks: profile.verificationRemarks
    };
  }
  
  return { status: VerificationStatus.INCOMPLETE };
};

export const mockUploadDocument = async (
  file: File, 
  documentType: VerificationDocument['documentType']
): Promise<VerificationDocument> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockDocument: VerificationDocument = {
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
    documentType,
    uploadedAt: new Date(),
    status: 'pending'
  };
  
  const stored = localStorage.getItem('company_profile');
  if (stored) {
    const profile = JSON.parse(stored);
    const documents = profile.documents || [];
    
    const filteredDocs = documents.filter((doc: VerificationDocument) => 
      doc.documentType !== documentType
    );
    
    profile.documents = [...filteredDocs, mockDocument];
    localStorage.setItem('company_profile', JSON.stringify(profile));
  }
  
  console.log('Mock: Document uploaded', mockDocument);
  return mockDocument;
};

export const mockDeleteDocument = async (documentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stored = localStorage.getItem('company_profile');
  if (stored) {
    const profile = JSON.parse(stored);
    profile.documents = (profile.documents || []).filter(
      (doc: VerificationDocument) => doc.id !== documentId
    );
    localStorage.setItem('company_profile', JSON.stringify(profile));
  }
  
  console.log('Mock: Document deleted', documentId);
};
