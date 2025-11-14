import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import IndustryHeader from '@/components/industry/IndustryHeader';
import ApprovalMatrixConfiguration from '@/components/industry/approval/ApprovalMatrixConfiguration';
import ApprovalNotificationCenter from '@/components/shared/notifications/ApprovalNotificationCenter';
import PendingUserApproval from '@/components/industry/approval/PendingUserApproval';
import { useEnhancedApproval } from '@/contexts/EnhancedApprovalContext';
import { TeamMember } from '@/types/teamMember';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, BarChart3, CheckCircle, Clock, AlertTriangle, Plus, Shield, Crown, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustryApprovalMatrix = () => {
  const { 
    activeConfiguration, 
    approvalWorkflows, 
    teamMembers,
    pendingUsers,
    updateTeamMembers,
    userRole,
    isCompanyAdmin,
    companyId,
    notifications,
    unreadNotifications
  } = useEnhancedApproval();
  
  const [selectedTab, setSelectedTab] = useState('overview');

  // Load team members from localStorage (simulating data from Industry Profile)
  useEffect(() => {
    const storedTeamMembers = localStorage.getItem('industryTeamMembers');
    if (storedTeamMembers) {
      try {
        const parsedMembers = JSON.parse(storedTeamMembers);
        updateTeamMembers(parsedMembers);
      } catch (error) {
        console.error('Error loading team members:', error);
      }
    }
  }, []); // Remove updateTeamMembers from dependency array to prevent infinite loop

  const handleTeamMembersUpdate = (updatedMembers: TeamMember[]) => {
    updateTeamMembers(updatedMembers);
    // Save to localStorage to persist across pages
    localStorage.setItem('industryTeamMembers', JSON.stringify(updatedMembers));
  };

  // Calculate approval statistics
  const approvalStats = {
    totalWorkflows: approvalWorkflows.length,
    completedWorkflows: approvalWorkflows.filter(w => w.status === 'completed').length,
    pendingWorkflows: approvalWorkflows.filter(w => w.status === 'pending' || w.status === 'in_progress').length,
    rejectedWorkflows: approvalWorkflows.filter(w => w.status === 'rejected').length,
  };

  // Calculate pending users count
  const pendingUsersCount = pendingUsers.filter(u => u.status === 'pending').length;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* User Role Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {isCompanyAdmin ? (
              <Crown className="h-8 w-8 text-blue-600" />
            ) : (
              <Shield className="h-8 w-8 text-blue-600" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">
                {isCompanyAdmin ? 'Company Administrator' : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Role`}
              </h3>
              <p className="text-blue-700">
                {isCompanyAdmin 
                  ? 'You have full access to configure approval workflows and manage team members'
                  : `You have ${userRole} level access to the approval system`
                }
              </p>
              <p className="text-sm text-blue-600 mt-1">Company ID: {companyId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{approvalStats.totalWorkflows}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{approvalStats.completedWorkflows}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-900">{approvalStats.pendingWorkflows}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{approvalStats.rejectedWorkflows}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Users Alert for Admin */}
      {isCompanyAdmin && pendingUsersCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <UserCheck className="h-8 w-8 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Pending User Approvals</h3>
                <p className="text-orange-700 mb-3">
                  You have {pendingUsersCount} user{pendingUsersCount > 1 ? 's' : ''} waiting for approval to join your company.
                </p>
                <Button 
                  onClick={() => setSelectedTab('user-management')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Review Pending Users
                </Button>
              </div>
              <Badge variant="destructive" className="text-lg px-3 py-1">
                {pendingUsersCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members Setup Notice */}
      {teamMembers.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Team Members Required</h3>
                <p className="text-orange-700 mb-3">
                  To configure approval workflows, you need to add team members first.
                </p>
                <Link to="/industry-profile">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Members
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ApprovalNotificationCenter />
        
        <div className="space-y-6">
          {activeConfiguration && (
            <Card>
              <CardHeader>
                <CardTitle>Active Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{activeConfiguration.name}</h3>
                      <p className="text-gray-600">{activeConfiguration.description}</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">Approval Thresholds</p>
                      <p className="text-2xl font-bold text-blue-600">{activeConfiguration.thresholds.length}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-900">Total Approval Stages</p>
                      <p className="text-2xl font-bold text-green-600">
                        {activeConfiguration.thresholds.reduce((total, threshold) => total + threshold.stages.length, 0)}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-900">Assigned Team Members</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {new Set(
                          activeConfiguration.thresholds.flatMap(threshold => 
                            threshold.stages.flatMap(stage => stage.assignedUsers)
                          )
                        ).size}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Recent Approval Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              {approvalWorkflows.length > 0 ? (
                <div className="space-y-4">
                  {approvalWorkflows.slice(0, 3).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{workflow.requirementId}</p>
                        <p className="text-sm text-gray-600">
                          Amount: ₹{workflow.budgetAmount.toLocaleString()} • 
                          Stages: {workflow.completedStages}/{workflow.totalStages}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          workflow.status === 'completed' ? 'default' : 
                          workflow.status === 'rejected' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {workflow.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No approval workflows yet</p>
                  <p className="text-sm text-gray-400">Workflows will appear here when requirements are created</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Approval Matrix Configuration | Diligince.ai</title>
      </Helmet>
      
      
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Approval Matrix Management</h1>
              <p className="text-gray-600">Configure and manage approval workflows for procurement requirements</p>
            </div>
            
            {/* Role indicator */}
            <div className="flex items-center gap-2">
              {isCompanyAdmin && (
                <Badge variant="default" className="bg-blue-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {userRole}
              </Badge>
              {pendingUsersCount > 0 && isCompanyAdmin && (
                <Badge variant="destructive">
                  {pendingUsersCount} pending
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              Overview
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="user-management">
              User Management
              {pendingUsersCount > 0 && isCompanyAdmin && (
                <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                  {pendingUsersCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="configuration" className="mt-6">
            {!isCompanyAdmin && userRole !== 'admin' ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-orange-900">Access Restricted</h3>
                      <p className="text-orange-700">
                        Only company administrators can configure approval workflows.
                        Contact your administrator for access.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ApprovalMatrixConfiguration 
                teamMembers={teamMembers}
                onTeamMembersUpdate={handleTeamMembersUpdate}
              />
            )}
          </TabsContent>

          <TabsContent value="user-management" className="mt-6">
            <PendingUserApproval />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Approval Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Advanced Analytics Coming Soon</p>
                  <p className="text-sm text-gray-400">
                    Detailed approval performance metrics, bottleneck analysis, and compliance reporting
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default IndustryApprovalMatrix;
