import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  Sparkles,
  Shield
} from 'lucide-react';
import { VendorProfile, VerificationStatus } from '@/types/verification';
import { 
  calculateVendorProfileCompletion,
  getVerificationStatusInfo 
} from '@/utils/vendorProfileValidation';
import { cn } from '@/lib/utils';

interface VendorProfileCompletionBannerProps {
  profile: Partial<VendorProfile> | null;
  onSubmitForVerification?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export const VendorProfileCompletionBanner = ({ 
  profile, 
  onSubmitForVerification,
  isSubmitting = false,
  className 
}: VendorProfileCompletionBannerProps) => {
  const completion = calculateVendorProfileCompletion(profile);
  const verificationStatus = profile?.verificationStatus || VerificationStatus.INCOMPLETE;
  const statusInfo = getVerificationStatusInfo(verificationStatus);
  
  const isComplete = completion.isComplete;
  const isPending = verificationStatus === VerificationStatus.PENDING;
  const isApproved = verificationStatus === VerificationStatus.APPROVED;
  const isRejected = verificationStatus === VerificationStatus.REJECTED;

  // Get gradient based on status
  const getGradientClass = () => {
    if (isApproved) return 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20';
    if (isPending) return 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20';
    if (isRejected) return 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20';
    if (isComplete) return 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20';
    return 'from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20';
  };

  // Get progress bar color
  const getProgressColor = () => {
    if (isApproved) return '[&>div]:bg-emerald-500';
    if (isPending) return '[&>div]:bg-amber-500';
    if (isRejected) return '[&>div]:bg-red-500';
    if (completion.percentage >= 80) return '[&>div]:bg-blue-500';
    if (completion.percentage >= 50) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-slate-400';
  };
  
  return (
    <Card className={cn(
      'overflow-hidden border-0 shadow-sm',
      `bg-gradient-to-r ${getGradientClass()}`,
      className
    )}>
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl',
              statusInfo.bgColor
            )}>
              {isApproved ? (
                <Shield className={cn('w-6 h-6', statusInfo.color)} />
              ) : isComplete ? (
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <AlertCircle className={cn('w-6 h-6', statusInfo.color)} />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {isApproved 
                  ? 'Profile Verified' 
                  : isPending 
                  ? 'Verification In Progress'
                  : isRejected
                  ? 'Verification Rejected'
                  : 'Profile Completion'}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isApproved 
                  ? 'Your business profile has been verified successfully.'
                  : isPending 
                  ? 'Your profile is under review. This usually takes 2-3 business days.'
                  : isRejected
                  ? 'Please review the feedback and update your profile.'
                  : isComplete
                  ? 'All requirements met. Ready for verification!'
                  : `Complete ${completion.missingFields.length + completion.missingDocuments.length} more items to submit for verification.`}
              </p>
            </div>
          </div>
          
          {/* Percentage & Progress */}
          <div className="flex flex-col items-end gap-2 min-w-[180px]">
            <div className={cn(
              'text-3xl font-bold',
              isApproved ? 'text-emerald-600 dark:text-emerald-400' 
                : isPending ? 'text-amber-600 dark:text-amber-400'
                : isRejected ? 'text-red-600 dark:text-red-400'
                : 'text-primary'
            )}>
              {completion.percentage}%
            </div>
            <Progress 
              value={completion.percentage} 
              className={cn('w-48 h-2', getProgressColor())} 
            />
          </div>
        </div>
        
        {/* Missing Items Section */}
        {!isApproved && !isPending && (completion.missingFields.length > 0 || completion.missingDocuments.length > 0) && (
          <div className="mt-4 p-4 bg-background/60 backdrop-blur-sm rounded-xl space-y-4">
            {/* Missing Fields */}
            {completion.missingFields.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <p className="text-sm font-medium text-foreground">
                    Required Fields ({completion.completedFields}/{completion.totalFields})
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {completion.missingFields.map((field, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 px-3 py-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg"
                    >
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-xs text-red-700 dark:text-red-300 truncate">
                        {field}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Missing Documents */}
            {completion.missingDocuments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <p className="text-sm font-medium text-foreground">
                    Required Documents ({completion.completedDocuments}/{completion.totalDocuments})
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {completion.missingDocuments.map((doc, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 px-3 py-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span className="text-xs text-amber-700 dark:text-amber-300 truncate">
                        {doc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Rejection Feedback */}
        {isRejected && profile?.verificationRemarks && (
          <div className="mt-4 p-4 bg-red-100/50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Verification Feedback
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {profile.verificationRemarks}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Complete Indicator */}
        {isComplete && !isPending && !isApproved && (
          <div className="mt-4 flex items-center justify-between p-4 bg-emerald-100/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                All requirements completed! Submit for verification.
              </span>
            </div>
            {onSubmitForVerification && (
              <Button
                onClick={onSubmitForVerification}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
        
        {/* Pending Status */}
        {isPending && (
          <div className="mt-4 flex items-center gap-3 p-4 bg-amber-100/50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Your profile is being reviewed by our verification team.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
