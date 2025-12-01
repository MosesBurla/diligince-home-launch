import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield } from 'lucide-react';
import ProfileSection from '@/components/userAccount/ProfileSection';
import NotificationsSection from '@/components/userAccount/NotificationsSection';
import SecuritySection from '@/components/userAccount/SecuritySection';

const UserAccountSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 max-w-6xl space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-foreground text-lg">
              Manage your personal account preferences and security
            </p>
          </div>
          {/* <div className="absolute -right-8 -bottom-8 opacity-10">
            <User size={200} strokeWidth={1} />
          </div> */}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card shadow-sm border">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <User size={18} />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Bell size={18} />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Shield size={18} />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsSection />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserAccountSettings;
