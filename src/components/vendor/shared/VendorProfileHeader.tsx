import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Building2,
  Truck,
  Package,
  Wrench,
  Shield,
  MapPin,
  Calendar
} from "lucide-react";
import { VerificationStatus, VendorProfile } from "@/types/verification";
import { calculateVendorProfileCompletion, getVerificationStatusInfo } from "@/utils/vendorProfileValidation";
import { cn } from "@/lib/utils";

interface VendorProfileHeaderProps {
  profile: Partial<VendorProfile> | null;
  className?: string;
}

export const VendorProfileHeader = ({
  profile,
  className
}: VendorProfileHeaderProps) => {
  const businessName = profile?.businessName || 'Your Business';
  const vendorCategory = profile?.vendorCategory || 'Service Vendor';
  const specialization = profile?.specialization;
  const verificationStatus = profile?.verificationStatus || VerificationStatus.INCOMPLETE;
  const completion = calculateVendorProfileCompletion(profile);
  const statusInfo = getVerificationStatusInfo(verificationStatus);
  
  // Generate initials from business name
  const initials = businessName
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  // Get vendor category icon
  const getCategoryIcon = () => {
    switch (vendorCategory) {
      case 'Service Vendor':
        return <Wrench className="w-4 h-4" />;
      case 'Product Vendor':
        return <Package className="w-4 h-4" />;
      case 'Logistics Vendor':
        return <Truck className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  // Get verification status icon
  const getStatusIcon = () => {
    switch (verificationStatus) {
      case VerificationStatus.APPROVED:
        return <CheckCircle className="h-5 w-5 text-white" />;
      case VerificationStatus.PENDING:
        return <Clock className="h-5 w-5 text-white" />;
      case VerificationStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-white" />;
    }
  };

  // Get status badge colors
  const getStatusBadgeColors = () => {
    switch (verificationStatus) {
      case VerificationStatus.APPROVED:
        return 'bg-emerald-500';
      case VerificationStatus.PENDING:
        return 'bg-amber-500';
      case VerificationStatus.REJECTED:
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  };

  // Get progress bar color
  const getProgressColor = () => {
    if (verificationStatus === VerificationStatus.APPROVED) return '[&>div]:bg-emerald-500';
    if (verificationStatus === VerificationStatus.PENDING) return '[&>div]:bg-amber-500';
    if (completion.percentage >= 80) return '[&>div]:bg-blue-500';
    if (completion.percentage >= 50) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-slate-400';
  };

  return (
    <Card className={cn(
      'overflow-hidden border-0 shadow-sm',
      'bg-gradient-to-br from-slate-50 via-white to-slate-50',
      'dark:from-slate-900 dark:via-slate-900 dark:to-slate-800',
      className
    )}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
              <AvatarImage src={undefined} alt={businessName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Verification Badge Overlay */}
            <div className={cn(
              'absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-md',
              getStatusBadgeColors()
            )}>
              {getStatusIcon()}
            </div>
          </div>
          
          {/* Info Section */}
          <div className="flex-1 min-w-0">
            {/* Business Name & Verification */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <h1 className="text-2xl font-bold text-foreground truncate">
                {businessName}
              </h1>
              
              {verificationStatus === VerificationStatus.APPROVED && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800 w-fit">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            {/* Category & Specialization Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1.5">
                {getCategoryIcon()}
                {vendorCategory}
              </Badge>
              
              {specialization && (
                <Badge variant="outline" className="text-muted-foreground">
                  {specialization}
                </Badge>
              )}
            </div>
            
            {/* Additional Info Row */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {profile?.businessLocation && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.businessLocation}</span>
                </div>
              )}
              {profile?.yearsInBusiness && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{profile.yearsInBusiness} years in business</span>
                </div>
              )}
            </div>
            
            {/* Profile Completion */}
            <div className="space-y-2 max-w-md">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className={cn(
                  'font-semibold',
                  verificationStatus === VerificationStatus.APPROVED 
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-primary'
                )}>
                  {completion.percentage}%
                </span>
              </div>
              <Progress 
                value={completion.percentage} 
                className={cn('h-2', getProgressColor())} 
              />
              
              {/* Completion Status Message */}
              {verificationStatus !== VerificationStatus.APPROVED && completion.percentage < 100 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {completion.missingFields.length > 0 && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      {completion.missingFields.length} field{completion.missingFields.length !== 1 ? 's' : ''}
                    </>
                  )}
                  {completion.missingFields.length > 0 && completion.missingDocuments.length > 0 && (
                    <span className="mx-1">•</span>
                  )}
                  {completion.missingDocuments.length > 0 && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {completion.missingDocuments.length} document{completion.missingDocuments.length !== 1 ? 's' : ''}
                    </>
                  )}
                  <span className="ml-1">remaining</span>
                </p>
              )}
              
              {/* Verification Status Message */}
              {verificationStatus === VerificationStatus.PENDING && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Profile under verification review
                </p>
              )}
              
              {verificationStatus === VerificationStatus.REJECTED && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Verification rejected - Please update and resubmit
                </p>
              )}
            </div>
          </div>
          
          {/* Right Side - Status Card (Desktop) */}
          <div className="hidden lg:flex flex-col items-end gap-2">
            <div className={cn(
              'px-4 py-2 rounded-lg text-center min-w-[140px]',
              statusInfo.bgColor
            )}>
              <p className={cn('text-xs font-medium', statusInfo.color)}>
                Status
              </p>
              <p className={cn('text-sm font-semibold', statusInfo.color)}>
                {statusInfo.label}
              </p>
            </div>
            
            {profile?.verificationSubmittedAt && (
              <p className="text-xs text-muted-foreground">
                Submitted: {new Date(profile.verificationSubmittedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
