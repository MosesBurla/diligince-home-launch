import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Shield, Users, Eye, Edit, Copy, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { vendorRolesService } from '@/services/modules/vendor-roles';
import type { VendorRole, VendorRoleFilters } from '@/services/modules/vendor-roles';

const VendorRoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<VendorRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VendorRoleFilters>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [statistics, setStatistics] = useState({
    totalRoles: 0,
    systemRoles: 0,
    customRoles: 0,
    activeRoles: 0,
    inactiveRoles: 0,
    totalAssignments: 0,
  });

  useEffect(() => {
    fetchRoles();
  }, [filters]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await vendorRolesService.getRoles(filters);
      if (response.success) {
        setRoles(response.data.roles);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
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

  const handleToggleStatus = async (roleId: string, currentStatus: boolean) => {
    try {
      await vendorRolesService.toggleRoleStatus(roleId, { isActive: !currentStatus });
      toast.success(`Role ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchRoles();
    } catch (error) {
      toast.error('Failed to update role status');
    }
  };

  const handleDuplicate = async (role: VendorRole) => {
    try {
      await vendorRolesService.duplicateRole(role.id, {
        name: `${role.name}_copy`,
        displayName: `${role.displayName} (Copy)`,
        description: `Copy of ${role.description}`,
      });
      toast.success('Role duplicated successfully');
      fetchRoles();
    } catch (error) {
      toast.error('Failed to duplicate role');
    }
  };

  const handleDelete = async (roleId: string) => {
    try {
      await vendorRolesService.deleteRole(roleId);
      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground">Manage roles and permissions for your vendor team</p>
        </div>
        <Button onClick={() => navigate('/dashboard/vendor/team/roles/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{statistics.totalRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>
                <p className="text-2xl font-bold">{statistics.systemRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Roles</p>
                <p className="text-2xl font-bold">{statistics.activeRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold">{statistics.totalAssignments}</p>
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
                placeholder="Search roles..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.isSystemRole?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('isSystemRole', value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="true">System Roles</SelectItem>
                <SelectItem value="false">Custom Roles</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.isActive?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('isActive', value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : roles.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No roles found</h3>
              <p className="text-muted-foreground">Create your first role to get started</p>
              <Button className="mt-4" onClick={() => navigate('/dashboard/vendor/team/roles/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </CardContent>
          </Card>
        ) : (
          roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{role.displayName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={role.isSystemRole ? 'secondary' : 'outline'}>
                        {role.isSystemRole ? 'System' : 'Custom'}
                      </Badge>
                      <Badge variant={role.isActive ? 'default' : 'destructive'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/team/roles/${role.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {!role.isSystemRole && (
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/team/roles/${role.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDuplicate(role)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(role.id, role.isActive)}>
                        {role.isActive ? (
                          <>
                            <ToggleLeft className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      {!role.isSystemRole && role.userCount === 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(role.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {role.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    <Users className="inline-block mr-1 h-4 w-4" />
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                  </span>
                  <span className="text-muted-foreground">
                    {role.permissionsV2?.length || 0} modules
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorRoleManagement;
