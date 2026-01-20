import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Sparkles, 
  Send,
  Trophy
} from 'lucide-react';
import { RFQStats } from '@/types/rfq-browse';
import { cn } from '@/lib/utils';

interface RFQStatsCardsProps {
  stats: RFQStats | null;
  isLoading?: boolean;
}

const RFQStatsCards: React.FC<RFQStatsCardsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      label: 'Total Available RFQs',
      value: stats?.totalAvailable || 0,
      icon: FileText,
      iconColor: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'AI Recommended',
      value: stats?.aiRecommended || 0,
      icon: Sparkles,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-500/10'
    },
    {
      label: 'Submitted Quotations',
      value: stats?.submittedQuotations || 0,
      icon: Send,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Win Rate',
      value: `${stats?.winRate || 0}%`,
      icon: Trophy,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      isPercentage: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
              <div className="h-6 w-12 bg-muted rounded mb-1" />
              <div className="h-4 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center mb-3",
              item.bgColor
            )}>
              <item.icon className={cn("w-5 h-5", item.iconColor)} />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RFQStatsCards;
