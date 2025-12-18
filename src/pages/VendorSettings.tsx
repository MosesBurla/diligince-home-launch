import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, AlertCircle, Save, Send } from 'lucide-react';
import { SettingsPageSkeleton } from '@/components/shared/loading';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import toast from '@/utils/toast.utils';
import errorHandler from '@/utils/errorHandler.utils';
import { VendorProfile, VerificationStatus, VerificationDocument, VendorDocumentType } from '@/types/verification';
import { VendorProfileCompletionBanner } from '@/components/vendor/shared/VendorProfileCompletionBanner';
import { VendorDocumentUploadField } from '@/components/vendor/shared/VendorDocumentUploadField';
import { 
  calculateVendorProfileCompletion, 
  canVendorSubmitForVerification,
  getVendorRequiredDocuments,
  getDocumentDisplayName
} from '@/utils/vendorProfileValidation';
import { ConsentDialog } from '@/components/verification/ConsentDialog';

const VENDOR_CATEGORIES = ['Service Vendor', 'Product Vendor', 'Logistics Vendor'] as const;

const VendorSettings = () => {
  const navigate = useNavigate();
  const { user, refreshVerificationStatus } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isConsentOpen, setIsConsentOpen] = useState(false);

  // Vendor Profile State
  const [profile, setProfile] = useState<Partial<VendorProfile>>({});

  // Calculate profile completion
  const completion = useMemo(() => {
    return calculateVendorProfileCompletion(profile);
  }, [profile]);

  const submitStatus = useMemo(() => {
    return canVendorSubmitForVerification(profile);
  }, [profile]);

  const isProfileLocked = useMemo(() => {
    return profile.verificationStatus === VerificationStatus.PENDING ||
      profile.verificationStatus === VerificationStatus.APPROVED;
  }, [profile.verificationStatus]);

  // Get required documents for this vendor type
  const requiredDocuments = useMemo(() => {
    return getVendorRequiredDocuments(profile.vendorCategory || 'Service Vendor');
  }, [profile.vendorCategory]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        // TODO: Replace with actual vendorProfileService.getProfile()
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock profile from user context
        setProfile({
          businessName: user?.profile?.businessName || '',
          vendorCategory: user?.profile?.vendorCategory || 'Service Vendor',
          specialization: user?.profile?.specialization || '',
          panNumber: '',
          gstNumber: '',
          registrationNumber: '',
          email: user?.email || '',
          mobile: user?.profile?.mobile || '',
          telephone: '',
          website: '',
          primaryIndustry: '',
          yearsInBusiness: '',
          businessLocation: '',
          documents: [],
          verificationStatus: VerificationStatus.INCOMPLETE,
        });
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Field validation helpers
  const getFieldStatus = (fieldValue: any, required: boolean = true) => {
    if (!required) return 'optional';
    if (!fieldValue || String(fieldValue).trim() === '') return 'empty';
    return 'filled';
  };

  const getFieldClassName = (status: string) => {
    if (status === 'empty') return 'border-red-300 focus:border-red-500';
    if (status === 'filled') return 'border-green-300 focus:border-green-500';
    return '';
  };

  // Form handlers
  const handleChange = (field: keyof VendorProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isProfileLocked) {
      toast.warning('Profile is locked', {
        description: 'Profile is locked for verification and cannot be edited.',
      });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = errorHandler.showLoading('Saving profile...');

    try {
      // TODO: Replace with actual vendorProfileService.saveProfile(profile)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      errorHandler.updateSuccess(loadingToast, 'Profile saved successfully');
    } catch (error) {
      errorHandler.updateError(loadingToast, 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!submitStatus.canSubmit) {
      toast.warning('Incomplete Profile', {
        description: submitStatus.reason,
        duration: 5000,
      });
      return;
    }

    if (isProfileLocked) {
      toast.info('Already Submitted', {
        description: 'Profile has already been submitted for verification.',
      });
      return;
    }

    setIsConsentOpen(true);
  };

  const handleConsentConfirm = async () => {
    setIsSubmitting(true);
    const loadingToast = errorHandler.showLoading('Submitting for verification...');

    try {
      // TODO: Replace with actual vendorProfileService.submitForVerification()
      await new Promise(resolve => setTimeout(resolve, 2000));

      setProfile(prev => ({
        ...prev,
        verificationStatus: VerificationStatus.PENDING,
        verificationSubmittedAt: new Date().toISOString(),
      }));

      errorHandler.updateSuccess(loadingToast, 'Profile submitted for verification!');
      setIsConsentOpen(false);

      await refreshVerificationStatus();

      setTimeout(() => {
        navigate('/verification-pending');
      }, 1500);
    } catch (error) {
      errorHandler.updateError(loadingToast, 'Failed to submit for verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document handlers
  const handleDocumentUpload = async (file: File, documentType: string): Promise<VerificationDocument> => {
    if (isProfileLocked) {
      toast.warning('Profile is locked', {
        description: 'Profile is locked for verification. Documents cannot be modified.',
      });
      throw new Error('Profile locked');
    }

    // TODO: Replace with actual vendorProfileService.uploadDocument()
    await new Promise(resolve => setTimeout(resolve, 1500));

    const uploadedDoc: VerificationDocument = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      documentType: documentType as VerificationDocument['documentType'],
      uploadedAt: new Date(),
      status: 'pending',
    };

    setProfile(prev => {
      const existingDocs = prev.documents || [];
      const filteredDocs = existingDocs.filter(doc => doc.documentType !== documentType);
      return {
        ...prev,
        documents: [...filteredDocs, uploadedDoc]
      };
    });

    return uploadedDoc;
  };

  const handleDocumentDelete = async (documentId: string): Promise<void> => {
    if (isProfileLocked) {
      toast.warning('Profile is locked', {
        description: 'Profile is locked for verification. Documents cannot be deleted.',
      });
      return;
    }

    // TODO: Replace with actual vendorProfileService.deleteDocument()
    await new Promise(resolve => setTimeout(resolve, 500));

    setProfile(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== documentId)
    }));
  };

  const getDocumentByType = (type: VendorDocumentType) => {
    return profile.documents?.find(doc => doc.documentType === type);
  };

    return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Profile</h1>
          <p className="text-muted-foreground">Manage your business profile and company details</p>
        </div>
      </div>

      {isLoadingProfile ? (
        <SettingsPageSkeleton showTabs={false} sections={4} />
      ) : (
        <div className="space-y-6">

          <>
            {/* Profile Lock Warning */}
            {isProfileLocked && (
              <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">
                        Profile Locked
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                        {profile.verificationStatus === VerificationStatus.PENDING
                          ? 'Your profile has been submitted for verification and is currently under review. No changes can be made during this period.'
                          : 'Your profile has been verified and is permanently locked. Please contact support if you need to make changes.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Completion Banner */}
            <VendorProfileCompletionBanner
              profile={profile}
              onSubmitForVerification={handleSubmitForVerification}
              isSubmitting={isSubmitting}
            />

            {/* Business Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="flex items-center gap-2">
                      Business Name <span className="text-red-500">*</span>
                      {getFieldStatus(profile.businessName) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.businessName) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="businessName"
                      value={profile.businessName || ''}
                      onChange={(e) => handleChange('businessName', e.target.value)}
                      placeholder="Enter business name"
                      className={getFieldClassName(getFieldStatus(profile.businessName))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.businessName) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Vendor Category */}
                  <div className="space-y-2">
                    <Label htmlFor="vendorCategory" className="flex items-center gap-2">
                      Vendor Category
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </Label>
                    <Select
                      value={profile.vendorCategory || 'Service Vendor'}
                      onValueChange={(value) => handleChange('vendorCategory', value)}
                      disabled={isProfileLocked}
                    >
                      <SelectTrigger className="border-green-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {VENDOR_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specialization */}
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="flex items-center gap-2">
                      Specialization
                      {profile.specialization && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      id="specialization"
                      value={profile.specialization || ''}
                      onChange={(e) => handleChange('specialization', e.target.value)}
                      placeholder="Enter specialization"
                      disabled={isProfileLocked}
                    />
                  </div>

                  {/* Years in Business */}
                  <div className="space-y-2">
                    <Label htmlFor="yearsInBusiness" className="flex items-center gap-2">
                      Years in Business
                      {profile.yearsInBusiness && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      id="yearsInBusiness"
                      value={profile.yearsInBusiness || ''}
                      onChange={(e) => handleChange('yearsInBusiness', e.target.value)}
                      placeholder="e.g., 5"
                      disabled={isProfileLocked}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      Email <span className="text-red-500">*</span>
                      {getFieldStatus(profile.email) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.email) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="business@example.com"
                      className={getFieldClassName(getFieldStatus(profile.email))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.email) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      Mobile <span className="text-red-500">*</span>
                      {getFieldStatus(profile.mobile) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.mobile) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="mobile"
                      value={profile.mobile || ''}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      placeholder="9876543210"
                      className={getFieldClassName(getFieldStatus(profile.mobile))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.mobile) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Telephone */}
                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="flex items-center gap-2">
                      Telephone (Optional)
                      {profile.telephone && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      id="telephone"
                      value={profile.telephone || ''}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      placeholder="044-12345678"
                      disabled={isProfileLocked}
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      Website (Optional)
                      {profile.website && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      id="website"
                      value={profile.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="www.example.com"
                      disabled={isProfileLocked}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information & Documents Section (Combined) */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="panNumber" className="flex items-center gap-2">
                      PAN Number <span className="text-red-500">*</span>
                      {getFieldStatus(profile.panNumber) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.panNumber) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="panNumber"
                      value={profile.panNumber || ''}
                      onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className={getFieldClassName(getFieldStatus(profile.panNumber))}
                      disabled={isProfileLocked}
                    />
                  </div>

                  {/* GST Number */}
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber" className="flex items-center gap-2">
                      GST Number <span className="text-red-500">*</span>
                      {getFieldStatus(profile.gstNumber) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.gstNumber) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="gstNumber"
                      value={profile.gstNumber || ''}
                      onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                      placeholder="22ABCDE1234F1Z5"
                      maxLength={15}
                      className={getFieldClassName(getFieldStatus(profile.gstNumber))}
                      disabled={isProfileLocked}
                    />
                  </div>

                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                      Registration Number <span className="text-red-500">*</span>
                      {getFieldStatus(profile.registrationNumber) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.registrationNumber) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="registrationNumber"
                      value={profile.registrationNumber || ''}
                      onChange={(e) => handleChange('registrationNumber', e.target.value)}
                      placeholder="Enter registration number"
                      className={getFieldClassName(getFieldStatus(profile.registrationNumber))}
                      disabled={isProfileLocked}
                    />
                  </div>
                </div>

                {/* Document Upload Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {requiredDocuments.map((docType) => (
                    <VendorDocumentUploadField
                      key={docType}
                      label={getDocumentDisplayName(docType)}
                      documentType={docType}
                      required={true}
                      currentDocument={getDocumentByType(docType)}
                      onUpload={handleDocumentUpload}
                      onDelete={handleDocumentDelete}
                      isProfileLocked={isProfileLocked}
                      vendorCategory={profile.vendorCategory}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons - Simple row without card */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSubmitting || isProfileLocked}
                className="min-w-[120px]"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                onClick={handleSubmitForVerification}
                disabled={isSubmitting || isProfileLocked || !completion.canSubmitForVerification}
                className={completion.canSubmitForVerification && !isProfileLocked
                  ? 'bg-emerald-600 hover:bg-emerald-700 min-w-[180px]'
                  : 'min-w-[180px]'
                }
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </div>
          </>
        </div>
      )}

      {/* Consent Dialog */}
      <ConsentDialog
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
        onConfirm={handleConsentConfirm}
        userType="vendor"
        documentsToSubmit={requiredDocuments.map(getDocumentDisplayName)}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default VendorSettings;
