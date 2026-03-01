import React from "react";
import { GenericDashboardStats } from "@/components/shared/dashboard/GenericDashboardStats";
import { DashboardStats as DashboardStatsType } from "@/types/industry-dashboard";
import { extractValue } from "@/types/api-common";
import { IndianRupee, ShoppingCart, TrendingUp, PiggyBank } from "lucide-react";

interface DashboardStatsProps {
  data: DashboardStatsType;
}

// Smart Indian rupee formatter: adapts units based on magnitude
const fmtINR = (amount: number): string => {
  if (amount === 0) return "₹0";
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)} L`;
  if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)} K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  // Helper to safely extract numeric values from both flat and enhanced formats
  const getValue = (field: any): number => {
    return extractValue(field) as number ?? 0;
  };

  const stats = [
    {
      title: "Total Procurement Spend",
      value: fmtINR(getValue(data?.totalProcurementSpend)),
      subtitle: data?.period ?? "N/A",
      icon: IndianRupee,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Purchase Orders",
      value: getValue(data?.activePurchaseOrders).toString(),
      subtitle: "in progress",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Budget Utilization",
      value: `${getValue(data?.budgetUtilization)}%`,
      subtitle: "of allocated budget",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Cost Savings",
      value: fmtINR(getValue(data?.costSavings)),
      subtitle: "through competitive bidding",
      icon: PiggyBank,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return <GenericDashboardStats stats={stats} />;
};
