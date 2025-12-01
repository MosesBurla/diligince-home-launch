import React from "react";
import { Shield, ShieldCheck, Users, Activity } from "lucide-react";
import type { RoleStatistics } from "@/services/modules/roles/roles.types";

interface RoleStatisticsBarProps {
  statistics: RoleStatistics;
}

export function RoleStatisticsBar({ statistics }: RoleStatisticsBarProps) {
  const stats = [
    {
      label: "Total Roles",
      value: statistics.totalRoles,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "System Roles",
      value: statistics.systemRoles,
      icon: ShieldCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Custom Roles",
      value: statistics.customRoles,
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Assignments",
      value: statistics.totalAssignments,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
