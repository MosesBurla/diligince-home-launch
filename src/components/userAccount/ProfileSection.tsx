import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building2, UserCircle, Calendar } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ProfileSection = () => {
  const { user } = useUser();

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'industry':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'professional':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vendor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="text-primary" size={24} />
          Your Profile
        </CardTitle>
        <CardDescription>
          View your account information. Contact support to update your details.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
              <AvatarImage src={user?.profile?.avatar} alt={user?.name} />
              <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                {getInitials(user?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            <Badge className={`${getRoleBadgeColor(user?.role || '')} px-4 py-1 text-sm font-medium`}>
              {user?.role === 'industry' && 'Industry'}
              {user?.role === 'professional' && 'Professional'}
              {user?.role === 'vendor' && 'Vendor'}
            </Badge>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCircle size={16} />
                Full Name
              </label>
              <div className="text-lg font-semibold text-foreground bg-muted/30 p-3 rounded-lg">
                {user?.name || 'Not provided'}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <div className="text-lg font-semibold text-foreground bg-muted/30 p-3 rounded-lg">
                {user?.email || 'Not provided'}
              </div>
            </div>

            {/* Phone */}
            {user?.profile?.phone && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <div className="text-lg font-semibold text-foreground bg-muted/30 p-3 rounded-lg">
                  {user.profile.phone}
                </div>
              </div>
            )}

            {/* Company Name (for industry users) */}
            {user?.role === 'industry' && user?.profile?.companyName && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 size={16} />
                  Company Name
                </label>
                <div className="text-lg font-semibold text-foreground bg-muted/30 p-3 rounded-lg">
                  {user.profile.companyName}
                </div>
              </div>
            )}

            {/* Account Created */}
            {user?.createdAt && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar size={16} />
                  Member Since
                </label>
                <div className="text-lg font-semibold text-foreground bg-muted/30 p-3 rounded-lg">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> To update your profile information, please contact our support team.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
