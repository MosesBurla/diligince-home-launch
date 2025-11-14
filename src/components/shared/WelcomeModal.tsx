
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, User, Settings } from 'lucide-react';
import { UserRole } from '@/types/shared';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName: string;
  onCompleteProfile: () => void;
  onGoToDashboard: () => void;
  profileCompletion: number;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  userRole,
  userName,
  onCompleteProfile,
  onGoToDashboard,
  profileCompletion
}) => {
  const isProfileComplete = profileCompletion >= 80;

  const roleLabels = {
    industry: 'Industry',
    professional: 'Professional',
    vendor: 'Vendor'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Welcome to Diligince.ai, {userName}!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Your {roleLabels[userRole]} account has been created successfully!
            </p>
          </div>

          <div className="space-y-3">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium">Profile Completion</h4>
                    <p className="text-sm text-muted-foreground">
                      {profileCompletion}% complete
                    </p>
                  </div>
                  {isProfileComplete && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </CardContent>
            </Card>

            {!isProfileComplete && (
              <Card className="border-l-4 border-l-amber-500">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-amber-500" />
                    <div className="flex-1">
                      <h4 className="font-medium">Complete Your Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Add missing information to get the most out of Diligince.ai
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            {!isProfileComplete && (
              <Button 
                onClick={onCompleteProfile}
                className="flex-1"
                size="lg"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            <Button 
              onClick={onGoToDashboard}
              variant={isProfileComplete ? "default" : "outline"}
              className="flex-1"
              size="lg"
            >
              {isProfileComplete ? "Go to Dashboard" : "Skip for Now"}
            </Button>
          </div>

          {!isProfileComplete && (
            <p className="text-xs text-center text-muted-foreground">
              You can complete your profile anytime from your dashboard
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
