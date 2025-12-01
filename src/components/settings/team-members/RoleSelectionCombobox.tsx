import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { RoleDetails } from '@/services/modules/team-members';

interface RoleSelectionComboboxProps {
  value: string;
  onChange: (roleId: string) => void;
  roles: RoleDetails[];
  disabled?: boolean;
}

export const RoleSelectionCombobox = ({ 
  value, 
  onChange, 
  roles,
  disabled = false
}: RoleSelectionComboboxProps) => {
  const [selectedRole, setSelectedRole] = useState<RoleDetails | null>(null);

  useEffect(() => {
    if (value && roles?.length > 0) {
      const role = roles.find(r => r.id === value);
      setSelectedRole(role || null);
    }
  }, [value, roles]);

  const defaultRoles = roles?.filter(r => r.isDefault);
  const customRoles = roles?.filter(r => !r.isDefault);

  return (
    <div className="space-y-4">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select a role for this member" />
        </SelectTrigger>
        <SelectContent>
          {defaultRoles?.length > 0 && (
            <>
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground">
                  Default Roles
                </p>
              </div>
              {defaultRoles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          {customRoles?.length > 0 && (
            <>
              <div className="px-2 py-1.5 mt-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Custom Roles
                </p>
              </div>
              {customRoles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Custom
                    </Badge>
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>

      {selectedRole && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {selectedRole.name}
              </CardTitle>
              {selectedRole.isDefault ? (
                <Badge variant="outline">Default Role</Badge>
              ) : (
                <Badge variant="secondary">Custom Role</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {selectedRole.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Permissions Preview:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.entries(selectedRole.permissions || {})
                  .slice(0, 5)
                  .map(([module, actions]) => (
                    <div 
                      key={module} 
                      className="flex items-start gap-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="capitalize">{module.replace(/_/g, ' ')}:</strong>{' '}
                        {(actions as string[]).join(', ')}
                      </span>
                    </div>
                  ))}
              </div>
              {Object.keys(selectedRole.permissions || {}).length > 5 && (
                <p className="text-xs text-muted-foreground italic">
                  + {Object.keys(selectedRole.permissions || {}).length - 5} more modules
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
