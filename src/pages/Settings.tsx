import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CompanyProfile, VerificationStatus } from '@/types/verification';
import { calculateProfileCompletion, canSubmitForVerification, getMissingFields } from '@/utils/profileValidation';
import { mockSaveProfile, mockSubmitForVerification, MOCK_COMPLETE_PROFILE } from '@/services/verification.mock';
import { ProfileCompletionBanner } from '@/components/verification/ProfileCompletionBanner';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { refreshVerificationStatus } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Partial<CompanyProfile>>(MOCK_COMPLETE_PROFILE);

  const completionPercentage = calculateProfileCompletion(profile);
  const canSubmit = canSubmitForVerification(profile);

  // Helper functions for field validation status
  const getFieldStatus = (fieldValue: any, required: boolean = true, minLength?: number) => {
    if (!required) return 'optional';
    if (!fieldValue || String(fieldValue).trim() === '') return 'empty';
    if (minLength && String(fieldValue).length < minLength) return 'too_short';
    return 'filled';
  };

  const getFieldClassName = (status: string) => {
    if (status === 'empty') return 'border-red-300 focus:border-red-500';
    if (status === 'too_short') return 'border-yellow-300 focus:border-yellow-500';
    if (status === 'filled') return 'border-green-300 focus:border-green-500';
    return '';
  };

  const resetForm = () => {
    setProfile({
      companyName: '',
      industryType: '',
      companyDescription: '',
      yearEstablished: '',
      gstNumber: '',
      registrationNumber: '',
      email: '',
      mobile: '',
      telephone: '',
      website: '',
      addresses: [{ line1: '', city: '', state: '', pincode: '', isPrimary: true }],
      verificationStatus: VerificationStatus.INCOMPLETE,
      isProfileComplete: false,
      profileCompletionPercentage: 0
    });
    toast.info('Form reset to empty');
  };

  const fillMockData = () => {
    setProfile(MOCK_COMPLETE_PROFILE);
    toast.info('Form filled with mock data');
  };

  // Load saved profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('company_profile');
    if (saved) {
      try {
        const savedProfile = JSON.parse(saved);
        setProfile(savedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  const handleChange = (field: keyof CompanyProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (index: number, field: string, value: string) => {
    setProfile(prev => {
      const addresses = [...(prev.addresses || [])];
      addresses[index] = {
        ...addresses[index],
        [field]: value
      };
      return {
        ...prev,
        addresses
      };
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await mockSaveProfile(profile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForVerification = async () => {
    if (!canSubmit) {
      const missing = getMissingFields(profile);
      toast.error(`Please complete the following fields: ${missing.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const loadingToast = toast.loading('Submitting profile for verification...');
      
      const result = await mockSubmitForVerification(profile as CompanyProfile);
      
      toast.dismiss(loadingToast);
      toast.success('✅ Profile submitted for verification!');
      toast.info(`📋 Verification ID: ${result.verificationId}`, { duration: 5000 });
      toast.info('⏰ Estimated completion: 24 hours', { duration: 5000 });
      
      await refreshVerificationStatus();
      
      setTimeout(() => {
        navigate('/verification-pending');
      }, 1500);
    } catch (error) {
      toast.error('❌ Failed to submit for verification');
      console.error('Verification submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const address = profile.addresses?.[0] || { line1: '', city: '', state: '', pincode: '', isPrimary: true };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-muted-foreground mt-2">
              Complete all required fields to submit your profile for verification
            </p>
          </div>
          
          {/* Developer Testing Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fillMockData}>
              Fill Mock Data
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Completion Banner */}
      <ProfileCompletionBanner 
        profile={profile} 
        completionPercentage={completionPercentage}
      />

      {/* Rejection Notice if applicable */}
      {profile.verificationStatus === VerificationStatus.REJECTED && profile.verificationRemarks && (
        <Card className="mb-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">Profile Verification Rejected</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {profile.verificationRemarks}
                </p>
                <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                  Please correct the issues and resubmit for verification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Basic Information
              <Badge variant="outline" className="ml-2">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
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
              />
              {getFieldStatus(profile.companyName) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>

            <div>
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
              >
                <SelectTrigger className={getFieldClassName(getFieldStatus(profile.industryType))}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="chemicals">Chemicals</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {getFieldStatus(profile.industryType) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="companyDescription" className="flex items-center gap-2">
                Company Description <span className="text-red-500">*</span>
                {getFieldStatus(profile.companyDescription, true, 50) === 'filled' && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
                {getFieldStatus(profile.companyDescription, true, 50) === 'empty' && (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                {getFieldStatus(profile.companyDescription, true, 50) === 'too_short' && (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </Label>
              <Textarea
                id="companyDescription"
                value={profile.companyDescription || ''}
                onChange={(e) => handleChange('companyDescription', e.target.value)}
                placeholder="Describe your company, products, and services (minimum 50 characters)..."
                rows={5}
                className={`resize-none ${getFieldClassName(getFieldStatus(profile.companyDescription, true, 50))}`}
              />
              <p className={`text-xs mt-1 ${
                getFieldStatus(profile.companyDescription, true, 50) === 'empty' ? 'text-red-600' :
                getFieldStatus(profile.companyDescription, true, 50) === 'too_short' ? 'text-yellow-600' :
                'text-muted-foreground'
              }`}>
                {(profile.companyDescription || '').length} / 1000 characters
                {getFieldStatus(profile.companyDescription, true, 50) === 'too_short' && ' (Minimum 50 characters required)'}
                {getFieldStatus(profile.companyDescription, true, 50) === 'empty' && ' - This field is required'}
              </p>
            </div>

            <div>
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
                type="number"
                value={profile.yearEstablished || ''}
                onChange={(e) => handleChange('yearEstablished', e.target.value)}
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear()}
                className={getFieldClassName(getFieldStatus(profile.yearEstablished))}
              />
              {getFieldStatus(profile.yearEstablished) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Legal Information
              <Badge variant="outline" className="ml-2">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
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
              />
              {getFieldStatus(profile.gstNumber) === 'empty' ? (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  15-character GST Identification Number
                </p>
              )}
            </div>

            <div>
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
                onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                placeholder="U74900MH2010PTC123456"
                className={getFieldClassName(getFieldStatus(profile.registrationNumber))}
              />
              {getFieldStatus(profile.registrationNumber) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Contact Information
              <Badge variant="outline" className="ml-2">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                Email Address <span className="text-red-500">*</span>
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
              />
              {getFieldStatus(profile.email) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>

            <div>
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
                type="tel"
                value={profile.mobile || ''}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="+919876543210"
                className={getFieldClassName(getFieldStatus(profile.mobile))}
              />
              {getFieldStatus(profile.mobile) === 'empty' && (
                <p className="text-xs text-red-600 mt-1">This field is required</p>
              )}
            </div>

            <div>
              <Label htmlFor="telephone">Telephone (Optional)</Label>
              <Input
                id="telephone"
                type="tel"
                value={profile.telephone || ''}
                onChange={(e) => handleChange('telephone', e.target.value)}
                placeholder="+912240123456"
              />
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={profile.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://www.company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Address Information
              <Badge variant="outline" className="ml-2">Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Primary Address</h4>
                <Badge variant="secondary">Primary</Badge>
              </div>

              <div>
                <Label htmlFor="line1" className="flex items-center gap-2">
                  Address Line 1 <span className="text-red-500">*</span>
                  {getFieldStatus(address.line1) === 'filled' && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {getFieldStatus(address.line1) === 'empty' && (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </Label>
                <Input
                  id="line1"
                  value={address.line1 || ''}
                  onChange={(e) => handleAddressChange(0, 'line1', e.target.value)}
                  placeholder="Street address, building name, etc."
                  className={getFieldClassName(getFieldStatus(address.line1))}
                />
                {getFieldStatus(address.line1) === 'empty' && (
                  <p className="text-xs text-red-600 mt-1">This field is required</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="flex items-center gap-2">
                    City <span className="text-red-500">*</span>
                    {getFieldStatus(address.city) === 'filled' && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {getFieldStatus(address.city) === 'empty' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </Label>
                  <Input
                    id="city"
                    value={address.city || ''}
                    onChange={(e) => handleAddressChange(0, 'city', e.target.value)}
                    placeholder="City"
                    className={getFieldClassName(getFieldStatus(address.city))}
                  />
                  {getFieldStatus(address.city) === 'empty' && (
                    <p className="text-xs text-red-600 mt-1">This field is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state" className="flex items-center gap-2">
                    State <span className="text-red-500">*</span>
                    {getFieldStatus(address.state) === 'filled' && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {getFieldStatus(address.state) === 'empty' && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </Label>
                  <Input
                    id="state"
                    value={address.state || ''}
                    onChange={(e) => handleAddressChange(0, 'state', e.target.value)}
                    placeholder="State"
                    className={getFieldClassName(getFieldStatus(address.state))}
                  />
                  {getFieldStatus(address.state) === 'empty' && (
                    <p className="text-xs text-red-600 mt-1">This field is required</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="pincode" className="flex items-center gap-2">
                  Pincode <span className="text-red-500">*</span>
                  {getFieldStatus(address.pincode) === 'filled' && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {getFieldStatus(address.pincode) === 'empty' && (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </Label>
                <Input
                  id="pincode"
                  value={address.pincode || ''}
                  onChange={(e) => handleAddressChange(0, 'pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  className={getFieldClassName(getFieldStatus(address.pincode))}
                />
                {getFieldStatus(address.pincode) === 'empty' && (
                  <p className="text-xs text-red-600 mt-1">This field is required</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {canSubmit ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile is complete and ready for verification</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Complete all required fields to submit for verification</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!canSubmit && (
                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </Button>
                )}

                {canSubmit && (
                  <Button
                    onClick={handleSubmitForVerification}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit for Verification
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;