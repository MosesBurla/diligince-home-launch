import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Users, UserCheck, UserX, Mail, Phone, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { vendorTeamService } from '@/services/modules/vendor-team';
import type { VendorTeamMember, VendorTeamMemberFilters, VendorRoleDetails } from '@/services/modules/vendor-team';

const VendorTeamMembers: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<VendorTeamMember[]>([]);
  const [roles, setRoles] = useState<VendorRoleDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState<VendorTeamMemberFilters>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [statistics, setStatistics] = useState({
    totalMembers: 0,
    activeMembers: 0,
    pendingVerification: 0,
    suspended: 0,
    byRole: {} as Record<string, number>,
  });
  const [newMember, setNewMember] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
    roleId: '',
  });

  useEffect(() => {
    fetchMembers();
    fetchRoles();
  }, [filters]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await vendorTeamService.getMembers(filters);
      if (response.success) {
        setMembers(response.data.members);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await vendorTeamService.getCompanyRoles();
      if (response.success) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleAddMember = async () => {
    try {
      const response = await vendorTeamService.createMember({
        ...newMember,
        sendInvitation: true,
      });
      if (response.success) {
        toast.success('Team member added successfully');
        setShowAddDialog(false);
        setNewMember({
          email: '',
          phone: '',
          firstName: '',
          lastName: '',
          department: '',
          designation: '',
          roleId: '',
        });
        fetchMembers();
      }
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  const handleStatusChange = async (memberId: string, status: 'active' | 'suspended') => {
    try {
      await vendorTeamService.updateMemberStatus(memberId, status);
      toast.success(`Member ${status === 'active' ? 'activated' : 'suspended'} successfully`);
      fetchMembers();
    } catch (error) {
      toast.error('Failed to update member status');
    }
  };

  const handleResendVerification = async (memberId: string) => {
    try {
      await vendorTeamService.resendVerification(memberId, 'both');
      toast.success('Verification sent successfully');
    } catch (error) {
      toast.error('Failed to resend verification');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await vendorTeamService.removeMember(memberId);
      toast.success('Member removed successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'pending_verification':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground">Manage your vendor team members</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{statistics.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{statistics.activeMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Mail className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{statistics.pendingVerification}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{statistics.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.role || 'all'}
              onValueChange={(value) => handleFilterChange('role', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.displayName || role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending_verification">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[40px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No team members found</h3>
                    <p className="text-muted-foreground">Add your first team member to get started</p>
                    <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.fullName}</p>
                          <p className="text-sm text-muted-foreground">{member.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </p>
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {member.assignedRole?.displayName || member.assignedRole?.name || 'No Role'}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.department || '-'}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/team/members/${member.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/team/members/${member.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Member
                          </DropdownMenuItem>
                          {member.status === 'pending_verification' && (
                            <DropdownMenuItem onClick={() => handleResendVerification(member.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend Verification
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {member.status === 'active' ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'suspended')}>
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(member.id, 'active')}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your vendor team. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newMember.department}
                  onChange={(e) => setNewMember(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Operations"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={newMember.designation}
                  onChange={(e) => setNewMember(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="Manager"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newMember.roleId}
                onValueChange={(value) => setNewMember(prev => ({ ...prev, roleId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.displayName || role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorTeamMembers;
