import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, RefreshCw, Mail, Phone } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { VerificationStatus, VerificationStep } from '@/types/verification';
import { toast } from 'sonner';
import { companyProfileService } from '@/services';
import { getSettingsRoute, getDashboardRoute } from '@/types/shared';

const VerificationPending = () => {
  const { verificationStatus, refreshVerificationStatus, user } = useUser();
  const navigate = useNavigate();
  const userRole = user?.role || 'industry';
  const [timeRemaining, setTimeRemaining] = useState('24h 0m');
  const [verificationSteps, setVerificationSteps] = useState<Array<{
    label: string;
    status: 'complete' | 'in_progress' | 'pending';
    icon: typeof CheckCircle2;
  }>>([]);

  // Fetch verification steps from API
  useEffect(() => {
    const loadVerificationSteps = async () => {
      try {
        const profile = await companyProfileService.getProfile();
        if (profile?.verificationSteps && profile.verificationSteps.length > 0) {
          const stepLabels: Record<string, string> = {
            'profile_submitted': 'Profile Submitted',
            'digital_verification': 'Digital Verification',
            'manual_review': 'Manual Review',
            'final_approval': 'Final Approval'
          };

          const steps = profile.verificationSteps.map((step: VerificationStep) => ({
            label: stepLabels[step.step] || step.step,
            status: step.status === 'completed' ? 'complete' as const :
              step.status === 'in_progress' ? 'in_progress' as const :
                'pending' as const,
            icon: Clock
          }));

          setVerificationSteps(steps);
        } else {
          // Fallback to default steps if API doesn't return them
          setVerificationSteps([
            { label: 'Profile Submitted', status: 'complete', icon: CheckCircle2 },
            { label: 'Digital Verification', status: 'in_progress', icon: Clock },
            { label: 'Manual Review', status: 'pending', icon: Clock },
            { label: 'Final Approval', status: 'pending', icon: Clock }
          ]);
        }
      } catch (error) {
        console.error('Error loading verification steps:', error);
        // Use fallback steps on error
        setVerificationSteps([
          { label: 'Profile Submitted', status: 'complete', icon: CheckCircle2 },
          { label: 'Digital Verification', status: 'in_progress', icon: Clock },
          { label: 'Manual Review', status: 'pending', icon: Clock },
          { label: 'Final Approval', status: 'pending', icon: Clock }
        ]);
      }
    };

    loadVerificationSteps();
  }, []);

  // Calculate time remaining
  useEffect(() => {
    const stored = localStorage.getItem('company_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      if (profile.verificationSubmittedAt) {
        const submittedAt = new Date(profile.verificationSubmittedAt);
        const estimatedCompletion = new Date(submittedAt.getTime() + 24 * 60 * 60 * 1000);

        const interval = setInterval(() => {
          const now = new Date();
          const diff = estimatedCompletion.getTime() - now.getTime();

          if (diff <= 0) {
            setTimeRemaining('Verification complete. Checking status...');
            refreshVerificationStatus();
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeRemaining(`${hours}h ${minutes}m`);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [refreshVerificationStatus]);

  // Redirect if not pending - role-aware
  useEffect(() => {
    if (verificationStatus === VerificationStatus.APPROVED) {
      // Redirect to role-specific dashboard
      const dashboardPath = user ? getDashboardRoute(user) : '/dashboard/industry';
      navigate(dashboardPath);
    } else if (verificationStatus === VerificationStatus.INCOMPLETE ||
      verificationStatus === VerificationStatus.REJECTED) {
      // Redirect to role-specific settings
      const settingsPath = getSettingsRoute(userRole);
      navigate(settingsPath);
    }
  }, [verificationStatus, navigate, user, userRole]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-orange-600 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verification in Progress</h1>
          <p className="text-muted-foreground">
            Your company profile is being verified. This typically takes up to 24 hours.
          </p>
        </div>

        {/* Countdown */}
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Estimated completion in</p>
            <p className="text-4xl font-bold text-orange-600">{timeRemaining}</p>
          </div>
        </Card>

        {/* Verification Timeline */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Verification Process</h3>
          <div className="space-y-4">
            {verificationSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step.status === 'complete' ? 'bg-green-100 dark:bg-green-900/30' :
                      step.status === 'in_progress' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-gray-100 dark:bg-gray-800'
                    }`}>
                    <Icon className={`h-5 w-5 ${step.status === 'complete' ? 'text-green-600' :
                        step.status === 'in_progress' ? 'text-orange-600' :
                          'text-gray-400'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.status === 'complete' && 'Completed'}
                      {step.status === 'in_progress' && 'In Progress'}
                      {step.status === 'pending' && 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* What's Being Verified */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">What We're Verifying</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Company Registration Details',
              'GST Number Authenticity',
              'Business Address',
              'Contact Information',
              'Legal Documentation',
              'Financial Information'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Support */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have questions or need to update information, contact our support team.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
          </div>
        </Card>

        {/* Developer Testing - Quick Approve Button */}
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span>⚡</span> Developer Testing
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            For testing purposes only - instantly approve verification
          </p>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 w-full"
            onClick={async () => {
              // Update localStorage to approved status
              const stored = localStorage.getItem('company_profile');
              if (stored) {
                const profile = JSON.parse(stored);
                const approvedProfile = {
                  ...profile,
                  verificationStatus: VerificationStatus.APPROVED,
                  verificationCompletedAt: new Date().toISOString()
                };
                localStorage.setItem('company_profile', JSON.stringify(approvedProfile));
                localStorage.setItem('verification_status', VerificationStatus.APPROVED);
              }

              // Refresh verification status in context
              await refreshVerificationStatus();

              // Show success message
              toast.success('✅ Verification approved! Redirecting to dashboard...');

              // Redirect to role-specific dashboard after 1 second
              setTimeout(() => {
                const dashboardPath = user ? getDashboardRoute(user) : '/dashboard/industry';
                navigate(dashboardPath);
              }, 1000);
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Quick Approve (Dev Only)
          </Button>
        </Card>

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => refreshVerificationStatus()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Status
          </Button>
        </div>

        {/* Status Badge */}
        <div className="text-center">
          <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-2" />
            Status: Under Review
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
