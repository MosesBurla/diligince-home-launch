
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Mail, 
  Building, 
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Phone
} from 'lucide-react';

const PendingApproval = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Account Pending Approval | Diligince.ai</title>
      </Helmet>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Pending Approval</h1>
            <p className="text-gray-600">Your request to join the company is awaiting administrator approval</p>
          </div>

          {/* Status Card */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertCircle className="h-5 w-5" />
                What happens next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-800 text-sm font-medium">1</span>
                </div>
                <div>
                  <p className="font-medium text-orange-900">Administrator Review</p>
                  <p className="text-orange-700 text-sm">Your company administrator will review your request and assign you an appropriate role.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-800 text-sm font-medium">2</span>
                </div>
                <div>
                  <p className="font-medium text-orange-900">Approval Notification</p>
                  <p className="text-orange-700 text-sm">You'll receive an email notification once your account has been approved.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-800 text-sm font-medium">3</span>
                </div>
                <div>
                  <p className="font-medium text-orange-900">Access Granted</p>
                  <p className="text-orange-700 text-sm">Sign in again to access your company's dashboard and start using the platform.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                If you need immediate access or have questions about your request, please contact your company administrator directly.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">Contact your admin directly</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Support</p>
                    <p className="text-sm text-gray-600">Call your company directly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Check Status
            </Button>
            
            <Link to="/signin">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 text-sm px-4 py-2">
              <Clock className="h-3 w-3 mr-2" />
              Status: Pending Approval
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
