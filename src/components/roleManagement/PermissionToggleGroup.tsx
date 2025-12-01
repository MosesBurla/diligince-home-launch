import React from "react";
import { Eye, Edit3, Trash2, Download, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { PermissionFlags } from "@/services/modules/roles/roles.types";

interface PermissionToggleGroupProps {
  permissions: PermissionFlags;
  onChange: (permissions: PermissionFlags) => void;
  compact?: boolean;
}

const permissionConfig = [
  { 
    key: "read" as const, 
    label: "Read", 
    icon: Eye, 
    activeClass: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 border-blue-600",
    inactiveClass: "bg-background border-border hover:border-blue-500/50 text-muted-foreground hover:text-blue-600"
  },
  { 
    key: "write" as const, 
    label: "Write", 
    icon: FilePlus, 
    activeClass: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20 border-emerald-600",
    inactiveClass: "bg-background border-border hover:border-emerald-500/50 text-muted-foreground hover:text-emerald-600"
  },
  { 
    key: "edit" as const, 
    label: "Edit", 
    icon: Edit3, 
    activeClass: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 border-amber-600",
    inactiveClass: "bg-background border-border hover:border-amber-500/50 text-muted-foreground hover:text-amber-600"
  },
  { 
    key: "delete" as const, 
    label: "Delete", 
    icon: Trash2, 
    activeClass: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/20 border-rose-600",
    inactiveClass: "bg-background border-border hover:border-rose-500/50 text-muted-foreground hover:text-rose-600"
  },
  { 
    key: "download" as const, 
    label: "Download", 
    icon: Download, 
    activeClass: "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-md shadow-violet-500/20 border-violet-600",
    inactiveClass: "bg-background border-border hover:border-violet-500/50 text-muted-foreground hover:text-violet-600"
  },
];

export function PermissionToggleGroup({
  permissions,
  onChange,
  compact = false,
}: PermissionToggleGroupProps) {
  const handleToggle = (key: keyof PermissionFlags) => {
    onChange({
      ...permissions,
      [key]: !permissions[key],
    });
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = permissionConfig.length;

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Permission Actions
          </span>
          <Badge variant="outline" className="text-xs">
            {enabledCount}/{totalCount} enabled
          </Badge>
        </div>
      )}
      
      <TooltipProvider>
        <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
          {permissionConfig.map(({ key, label, icon: Icon, activeClass, inactiveClass }) => {
            const isActive = permissions[key] === true;

            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full border transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      compact ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm font-medium",
                      isActive ? activeClass : inactiveClass
                    )}
                  >
                    <Icon className={cn("h-4 w-4", !compact && "mr-2")} />
                    {!compact && <span>{label}</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {isActive ? `Disable ${label}` : `Enable ${label}`} permission
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
