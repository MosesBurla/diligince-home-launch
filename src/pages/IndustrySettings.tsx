import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { SettingsPageSkeleton } from '@/components/shared/loading';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import toast from '@/utils/toast.utils';
import errorHandler from '@/utils/errorHandler.utils';
import { CompanyProfile, VerificationStatus, Address, VerificationDocument } from '@/types/verification';

import { calculateProfileCompletion, getMissingFields, canSubmitForVerification } from '@/utils/profileValidation';
import { companyProfileService } from '@/services';
import { ProfileCompletionBanner } from '@/components/verification/ProfileCompletionBanner';
import { DocumentUploadField } from '@/components/verification/DocumentUploadField';
import { industries } from '@/constants/Types';
import PaymentSettingsTab from '@/components/companyProfile/PaymentSettingsTab';

const IndustrySettings = () => {
  const navigate = useNavigate();
  const { refreshVerificationStatus } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Company Profile State (Tab 1)
  const [profile, setProfile] = useState<Partial<CompanyProfile>>({});

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(profile);
  }, [profile]);

  const missingFields = useMemo(() => {
    return getMissingFields(profile);
  }, [profile]);

  const canSubmit = useMemo(() => {
    return canSubmitForVerification(profile);
  }, [profile]);

  const isProfileLocked = useMemo(() => {
    return profile.verificationStatus === VerificationStatus.PENDING ||
      profile.verificationStatus === VerificationStatus.APPROVED;
  }, [profile.verificationStatus]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const data = await companyProfileService.getProfile();
        setProfile(data);
      } catch (error: any) {
        // If 404, user doesn't have a profile yet - this is normal for new users
        if (error.response?.status === 404) {
          console.log('No existing profile found - user will create one');
          setProfile({});
        } else {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

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

  const descriptionStatus = () => {
    const desc = profile.companyDescription || '';
    if (desc.trim() === '') return 'empty';
    if (desc.length < 50) return 'too_short';
    return 'filled';
  };

  // Form handlers
  const handleChange = (field: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...(profile.addresses || [])];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
  };

  const handleAddAddress = () => {
    const newAddresses = [...(profile.addresses || []), {
      line1: '', city: '', state: '', pincode: '', isPrimary: false
    }];
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = profile.addresses?.filter((_, i) => i !== index) || [];
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
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
      const response = await companyProfileService.saveProfile(profile);
      // Handle both flat and nested response structures
      const savedProfile = 'profile' in response.data ? response.data.profile : response.data;
      setProfile(savedProfile);

      errorHandler.updateSuccess(loadingToast, 'Profile saved successfully');

      // Show info about missing documents if any
      if (savedProfile.documents && savedProfile.documents.length < 3) {
        setTimeout(() => {
          toast.info('Documents needed', {
            description: 'Please upload all required documents to complete your profile.',
            duration: 6000,
          });
        }, 500);
      }
    } catch (error) {
      // Error already handled by service layer
      errorHandler.updateError(loadingToast, 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!canSubmit) {
      toast.warning('Incomplete Profile', {
        description: `Please complete: ${missingFields.join(', ')}`,
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

    setIsSubmitting(true);
    const loadingToast = errorHandler.showLoading('Submitting for verification...');

    try {
      const result = await companyProfileService.submitForVerification();

      // Update profile locally with verification data from response
      setProfile(prev => ({
        ...prev,
        verificationStatus: result.data.status === 'pending'
          ? VerificationStatus.PENDING
          : VerificationStatus.INCOMPLETE,
        verificationSubmittedAt: result.data.submittedAt,
      }));

      errorHandler.updateSuccess(
        loadingToast,
        'Profile submitted successfully',
        `Verification ID: ${result.data.verificationId}`
      );

      const estimatedTime = new Date(result.data.estimatedCompletionAt).toLocaleString();
      setTimeout(() => {
        toast.info('Verification timeline', {
          description: `Estimated completion: ${estimatedTime}`,
          duration: 6000,
        });
      }, 500);

      // Show next steps
      if (result.data.nextSteps && result.data.nextSteps.length > 0) {
        setTimeout(() => {
          toast.info('Next Steps', {
            description: result.data.nextSteps.join('\n'),
            duration: 8000,
          });
        }, 1000);
      }

      await refreshVerificationStatus();

      // Refresh profile from server to get latest state
      try {
        const updatedProfile = await companyProfileService.getProfile();
        setProfile(updatedProfile);
      } catch (error) {
        console.error('Failed to refresh profile:', error);
      }

      setTimeout(() => {
        navigate('/verification-pending');
      }, 2000);
    } catch (error) {
      // Error already handled by service layer
      errorHandler.updateError(loadingToast, 'Failed to submit for verification');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Document handlers
  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (isProfileLocked) {
      toast.warning('Profile is locked', {
        description: 'Profile is locked for verification. Documents cannot be modified.',
      });
      throw new Error('Profile locked');
    }

    try {
      const response = await companyProfileService.uploadDocument(
        file,
        documentType as VerificationDocument['documentType']
      );
      const uploadedDoc = response.data.document;

      setProfile(prev => {
        const existingDocs = prev.documents || [];
        const filteredDocs = existingDocs.filter(doc => doc.documentType !== documentType);
        return {
          ...prev,
          documents: [...filteredDocs, uploadedDoc]
        };
      });

      return uploadedDoc;
    } catch (error) {
      // Error already handled by service layer
      throw error;
    }
  };

  const handleDocumentDelete = async (documentId: string) => {
    if (isProfileLocked) {
      toast.warning('Profile is locked', {
        description: 'Profile is locked for verification. Documents cannot be deleted.',
      });
      return;
    }

    try {
      await companyProfileService.deleteDocument(documentId);

      setProfile(prev => ({
        ...prev,
        documents: (prev.documents || []).filter(doc => doc.id !== documentId)
      }));
    } catch (error) {
      // Error already handled by service layer
    }
  };

  const getDocumentByType = (type: VerificationDocument['documentType']) => {
    return profile.documents?.find(doc => doc.documentType === type);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
      </div>

      {isLoadingProfile ? (
        <SettingsPageSkeleton showTabs tabCount={2} sections={3} />
      ) : (
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Company Profile
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Payment Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
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
            <ProfileCompletionBanner
              profile={profile}
              completionPercentage={profileCompletion}
            />



            {/* Basic Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      Company Name <span className="text-red-500">*</span>
                      {getFieldStatus(profile.companyName) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.companyName) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="companyName"
                      value={profile.companyName || ''}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                      className={getFieldClassName(getFieldStatus(profile.companyName))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.companyName) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Industry Type */}
                  <div className="space-y-2">
                    <Label htmlFor="industryType" className="flex items-center gap-2">
                      Industry Type <span className="text-red-500">*</span>
                      {getFieldStatus(profile.industryType) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.industryType) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Select
                      value={profile.industryType || ''}
                      onValueChange={(value) => handleChange('industryType', value)}
                      disabled={isProfileLocked}
                    >
                      <SelectTrigger className={getFieldClassName(getFieldStatus(profile.industryType))}>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getFieldStatus(profile.industryType) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Year Established */}
                  <div className="space-y-2">
                    <Label htmlFor="yearEstablished" className="flex items-center gap-2">
                      Year Established <span className="text-red-500">*</span>
                      {getFieldStatus(profile.yearEstablished) === 'filled' && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(profile.yearEstablished) === 'empty' && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Label>
                    <Input
                      id="yearEstablished"
                      value={profile.yearEstablished || ''}
                      onChange={(e) => handleChange('yearEstablished', e.target.value)}
                      placeholder="YYYY"
                      maxLength={4}
                      className={getFieldClassName(getFieldStatus(profile.yearEstablished))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.yearEstablished) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>
                </div>

                {/* Company Description */}
                <div className="space-y-2">
                  <Label htmlFor="companyDescription" className="flex items-center gap-2">
                    Company Description <span className="text-red-500">*</span>
                    {descriptionStatus() === 'filled' && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {descriptionStatus() === 'too_short' && (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    {descriptionStatus() === 'empty' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </Label>
                  <Textarea
                    id="companyDescription"
                    value={profile.companyDescription || ''}
                    onChange={(e) => handleChange('companyDescription', e.target.value)}
                    placeholder="Describe your company, products, and services..."
                    rows={5}
                    className={`resize-none ${descriptionStatus() === 'empty' ? 'border-red-300' :
                      descriptionStatus() === 'too_short' ? 'border-yellow-300' :
                        'border-green-300'
                      }`}
                    disabled={isProfileLocked}
                  />
                  <p className={`text-xs mt-1 ${descriptionStatus() === 'empty' ? 'text-red-600' :
                    descriptionStatus() === 'too_short' ? 'text-yellow-600' :
                      'text-muted-foreground'
                    }`}>
                    {(profile.companyDescription || '').length} / 1000 characters
                    {descriptionStatus() === 'too_short' && ' (Minimum 50 characters required)'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      placeholder="AABCU9603R"
                      maxLength={10}
                      className={getFieldClassName(getFieldStatus(profile.panNumber))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.panNumber) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
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
                      placeholder="27AABCU9603R1Z5"
                      maxLength={15}
                      className={getFieldClassName(getFieldStatus(profile.gstNumber))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.gstNumber) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber" className="flex items-center gap-2">
                      Company Registration Number <span className="text-red-500">*</span>
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
                      placeholder="U74900MH2010PTC123456"
                      className={getFieldClassName(getFieldStatus(profile.registrationNumber))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.registrationNumber) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>
                </div>

                {/* Document Upload Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PAN Card */}
                  <DocumentUploadField
                    label="PAN Card"
                    documentType="pan_card"
                    required={true}
                    accept=".pdf,.jpg,.jpeg,.png"
                    currentDocument={getDocumentByType('pan_card')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Upload company PAN card"
                    isProfileLocked={isProfileLocked}
                  />

                  {/* GST Certificate */}
                  <DocumentUploadField
                    label="GST Certificate"
                    documentType="gst_certificate"
                    required={true}
                    accept=".pdf,.jpg,.jpeg,.png"
                    currentDocument={getDocumentByType('gst_certificate')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Upload GST certificate"
                    isProfileLocked={isProfileLocked}
                  />

                  {/* Registration Certificate */}
                  <DocumentUploadField
                    label="Registration Certificate"
                    documentType="registration_certificate"
                    required={true}
                    accept=".pdf,.jpg,.jpeg,.png"
                    currentDocument={getDocumentByType('registration_certificate')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Upload registration certificate"
                    isProfileLocked={isProfileLocked}
                  />
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
                      placeholder="contact@company.com"
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
                      Mobile Number <span className="text-red-500">*</span>
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
                      placeholder="+919876543210"
                      className={getFieldClassName(getFieldStatus(profile.mobile))}
                      disabled={isProfileLocked}
                    />
                    {getFieldStatus(profile.mobile) === 'empty' && (
                      <p className="text-xs text-red-600 mt-1">This field is required</p>
                    )}
                  </div>

                  {/* Telephone (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Telephone (Optional)</Label>
                    <Input
                      id="telephone"
                      value={profile.telephone || ''}
                      onChange={(e) => handleChange('telephone', e.target.value)}
                      placeholder="+912240123456"
                      disabled={isProfileLocked}
                    />
                  </div>

                  {/* Website (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={profile.website || ''}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://www.company.com"
                      disabled={isProfileLocked}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Logo */}
                  <DocumentUploadField
                    label="Company Logo"
                    documentType="company_logo"
                    required={false}
                    accept=".jpg,.jpeg,.png,.svg"
                    maxSizeMB={5}
                    currentDocument={getDocumentByType('company_logo')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Upload your company logo (JPG, PNG, or SVG)"
                    isProfileLocked={isProfileLocked}
                  />

                  {/* Address Proof */}
                  <DocumentUploadField
                    label="Address Proof"
                    documentType="address_proof"
                    required={true}
                    accept=".pdf,.jpg,.jpeg,.png"
                    currentDocument={getDocumentByType('address_proof')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Utility bill, lease agreement, or property document"
                    isProfileLocked={isProfileLocked}
                  />

                  {/* Authorization Letter */}
                  <DocumentUploadField
                    label="Authorization Letter"
                    documentType="authorization_letter"
                    required={false}
                    accept=".pdf"
                    currentDocument={getDocumentByType('authorization_letter')}
                    onUpload={handleDocumentUpload}
                    onDelete={handleDocumentDelete}
                    helperText="Letter authorizing signatory (if applicable)"
                    isProfileLocked={isProfileLocked}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Address Information</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAddress}
                    disabled={isProfileLocked}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.addresses?.map((address, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Address {index + 1} {address.isPrimary && <span className="text-sm text-blue-600">(Primary)</span>}
                      </h4>
                      {profile.addresses && profile.addresses.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddress(index)}
                          disabled={isProfileLocked}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Address Line 1 */}
                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2">
                          Address Line 1 <span className="text-red-500">*</span>
                          {getFieldStatus(address.line1) === 'filled' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {getFieldStatus(address.line1) === 'empty' && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </Label>
                        <Input
                          value={address.line1}
                          onChange={(e) => handleAddressChange(index, 'line1', e.target.value)}
                          placeholder="Street address, building number"
                          className={getFieldClassName(getFieldStatus(address.line1))}
                          disabled={isProfileLocked}
                        />
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          City <span className="text-red-500">*</span>
                          {getFieldStatus(address.city) === 'filled' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {getFieldStatus(address.city) === 'empty' && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </Label>
                        <Input
                          value={address.city}
                          onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                          placeholder="City"
                          className={getFieldClassName(getFieldStatus(address.city))}
                          disabled={isProfileLocked}
                        />
                      </div>

                      {/* State */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          State <span className="text-red-500">*</span>
                          {getFieldStatus(address.state) === 'filled' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {getFieldStatus(address.state) === 'empty' && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </Label>
                        <Input
                          value={address.state}
                          onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                          placeholder="State"
                          className={getFieldClassName(getFieldStatus(address.state))}
                          disabled={isProfileLocked}
                        />
                      </div>

                      {/* Pincode */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Pincode <span className="text-red-500">*</span>
                          {getFieldStatus(address.pincode) === 'filled' && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                          {getFieldStatus(address.pincode) === 'empty' && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                        </Label>
                        <Input
                          value={address.pincode}
                          onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                          placeholder="400001"
                          maxLength={6}
                          className={getFieldClassName(getFieldStatus(address.pincode))}
                          disabled={isProfileLocked}
                        />
                      </div>

                      {/* Primary Address Toggle */}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={address.isPrimary}
                          onCheckedChange={(checked) => {
                            const newAddresses = profile.addresses?.map((addr, i) => ({
                              ...addr,
                              isPrimary: i === index ? checked : false
                            })) || [];
                            setProfile(prev => ({ ...prev, addresses: newAddresses }));
                          }}
                          disabled={isProfileLocked}
                        />
                        <Label>Set as Primary Address</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {/* Save Button - Always visible until profile is locked */}
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting || isProfileLocked}
                  variant="outline"
                  size="lg"
                >
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>

                {/* Submit for Verification - Only enabled when profile is complete */}
                <Button
                  onClick={handleSubmitForVerification}
                  disabled={isSubmitting || isProfileLocked || !canSubmit}
                  className={`${canSubmit && !isProfileLocked
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                    }`}
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>

              {/* Helpful message when Submit is disabled */}
              {!canSubmit && !isProfileLocked && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {missingFields.length > 0
                      ? `Complete ${missingFields.length} more field(s) and upload all required documents`
                      : profile.companyDescription && profile.companyDescription.length < 50
                        ? 'Complete description (minimum 50 characters)'
                        : 'Complete all requirements to submit for verification'}
                  </span>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approval" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Purchase Orders (&lt; $10,000)</h4>
                      <p className="text-sm text-muted-foreground">Department head approval required</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Purchase Orders ($10,000 - $50,000)</h4>
                      <p className="text-sm text-muted-foreground">Department head + Finance approval required</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Purchase Orders (&gt; $50,000)</h4>
                      <p className="text-sm text-muted-foreground">CEO + Finance + Department head approval required</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentSettingsTab />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-party Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">ERP System</h4>
                      <p className="text-sm text-muted-foreground">Connect with your existing ERP system</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Accounting Software</h4>
                      <p className="text-sm text-muted-foreground">Sync with QuickBooks, Xero, or other accounting tools</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email System</h4>
                      <p className="text-sm text-muted-foreground">Configure SMTP settings for notifications</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default IndustrySettings;
