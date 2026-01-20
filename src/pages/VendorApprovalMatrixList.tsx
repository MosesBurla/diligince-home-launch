import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, GitBranch, Users, Eye, Edit, Copy, Trash2, ToggleLeft, ToggleRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { vendorApprovalMatrixService } from '@/services/modules/vendor-approval-matrix';
import type { VendorApprovalMatrix, VendorMatrixFilters } from '@/services/modules/vendor-approval-matrix';

const VendorApprovalMatrixList: React.FC = () => {
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState<VendorApprovalMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VendorMatrixFilters>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [statistics, setStatistics] = useState({
    totalMatrices: 0,
    activeMatrices: 0,
    inactiveMatrices: 0,
    defaultMatrix: 0,
    totalApprovers: 0,
  });

  useEffect(() => {
    fetchMatrices();
  }, [filters]);

  const fetchMatrices = async () => {
    try {
      setLoading(true);
      const response = await vendorApprovalMatrixService.getMatrices(filters);
      if (response.success) {
        setMatrices(response.data.matrices);
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching matrices:', error);
      toast.error('Failed to fetch approval matrices');
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

  const handleToggleStatus = async (matrixId: string, currentStatus: boolean) => {
    try {
      await vendorApprovalMatrixService.toggleStatus(matrixId, { isActive: !currentStatus });
      toast.success(`Matrix ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchMatrices();
    } catch (error) {
      toast.error('Failed to update matrix status');
    }
  };

  const handleDuplicate = async (matrix: VendorApprovalMatrix) => {
    try {
      await vendorApprovalMatrixService.duplicateMatrix(matrix.id, {
        name: `${matrix.name} (Copy)`,
        description: `Copy of ${matrix.description}`,
        copyApprovers: true,
      });
      toast.success('Matrix duplicated successfully');
      fetchMatrices();
    } catch (error) {
      toast.error('Failed to duplicate matrix');
    }
  };

  const handleDelete = async (matrixId: string) => {
    try {
      await vendorApprovalMatrixService.deleteMatrix(matrixId);
      toast.success('Matrix deleted successfully');
      fetchMatrices();
    } catch (error) {
      toast.error('Failed to delete matrix');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approval Matrix</h1>
          <p className="text-muted-foreground">Configure approval workflows for your quotations</p>
        </div>
        <Button onClick={() => navigate('/dashboard/vendor/approval-matrix/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Matrix
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Matrices</p>
                <p className="text-2xl font-bold">{statistics.totalMatrices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{statistics.activeMatrices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold">{statistics.inactiveMatrices}</p>
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
                <p className="text-sm text-muted-foreground">Total Approvers</p>
                <p className="text-2xl font-bold">{statistics.totalApprovers}</p>
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
                placeholder="Search matrices..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.isDefault?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('isDefault', value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="true">Default</SelectItem>
                <SelectItem value="false">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matrices List */}
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
        ) : matrices.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No approval matrices found</h3>
              <p className="text-muted-foreground">Create your first approval matrix to get started</p>
              <Button className="mt-4" onClick={() => navigate('/dashboard/vendor/approval-matrix/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Matrix
              </Button>
            </CardContent>
          </Card>
        ) : (
          matrices.map((matrix) => (
            <Card key={matrix.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{matrix.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {matrix.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                      )}
                      <Badge variant={matrix.isActive ? 'default' : 'destructive'}>
                        {matrix.isActive ? 'Active' : 'Inactive'}
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
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/approval-matrix/${matrix.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/vendor/approval-matrix/${matrix.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Matrix
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(matrix)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(matrix.id, matrix.isActive)}>
                        {matrix.isActive ? (
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
                      {!matrix.isDefault && matrix.statistics.activeWorkflows === 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(matrix.id)}
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
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {matrix.description}
                </p>
                
                {/* Level Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Approval Levels</span>
                    <span className="font-medium">{matrix.statistics.totalLevels}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Approvers</span>
                    <span className="font-medium">{matrix.statistics.totalApprovers}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Workflows</span>
                      <span className="font-medium">{matrix.statistics.activeWorkflows}</span>
                    </div>
                    {matrix.statistics.completedWorkflows > 0 && (
                      <Progress 
                        value={(matrix.statistics.completedWorkflows / (matrix.statistics.activeWorkflows + matrix.statistics.completedWorkflows)) * 100} 
                        className="h-1"
                      />
                    )}
                  </div>
                </div>

                {/* Level Preview */}
                {matrix.levels.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Levels:</p>
                    <div className="flex flex-wrap gap-1">
                      {matrix.levels.slice(0, 3).map((level, index) => (
                        <Badge key={level.id} variant="outline" className="text-xs">
                          L{index + 1}: {level.name}
                        </Badge>
                      ))}
                      {matrix.levels.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{matrix.levels.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorApprovalMatrixList;
