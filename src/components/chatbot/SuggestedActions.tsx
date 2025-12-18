import React from 'react';
import { FileText, BarChart3, Package, HelpCircle, Users, Bot } from 'lucide-react';
import { SuggestedAction } from './types';

const SUGGESTED_ACTIONS: SuggestedAction[] = [
  {
    id: 'create-requirement',
    label: 'Create Requirement',
    message: 'How do I create a new procurement requirement?',
  },
  {
    id: 'approval-workflow',
    label: 'Approval Workflow',
    message: 'How does the approval workflow work?',
  },
  {
    id: 'compare-quotations',
    label: 'Compare Quotes',
    message: 'How can I compare vendor quotations?',
  },
  {
    id: 'track-orders',
    label: 'Track Orders',
    message: 'How do I track my purchase orders?',
  },
];

const getIcon = (id: string) => {
  switch (id) {
    case 'create-requirement':
      return <FileText className="w-3.5 h-3.5" />;
    case 'approval-workflow':
      return <Users className="w-3.5 h-3.5" />;
    case 'compare-quotations':
      return <BarChart3 className="w-3.5 h-3.5" />;
    case 'track-orders':
      return <Package className="w-3.5 h-3.5" />;
    default:
      return <HelpCircle className="w-3.5 h-3.5" />;
  }
};

interface SuggestedActionsProps {
  onActionClick: (message: string) => void;
}

export const SuggestedActions: React.FC<SuggestedActionsProps> = ({ onActionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-5 text-center">
      {/* Welcome Message */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary/80 flex items-center justify-center mb-3 shadow-md">
        <Bot className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-base font-semibold text-foreground mb-1">
        Hi! I'm Diligince AI
      </h3>
      <p className="text-xs text-muted-foreground mb-4 max-w-[260px]">
        Your intelligent procurement assistant. How can I help you today?
      </p>
      
      {/* Quick Actions Grid */}
      <div className="w-full grid grid-cols-2 gap-1.5">
        {SUGGESTED_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.message)}
            className="flex items-center gap-1.5 px-2.5 py-2 bg-muted/40 hover:bg-muted 
                       rounded-lg text-left text-xs transition-all duration-200 
                       hover:shadow-sm border border-transparent hover:border-border/30
                       group"
          >
            <span className="text-brand-primary group-hover:scale-110 transition-transform">
              {getIcon(action.id)}
            </span>
            <span className="text-foreground/70 group-hover:text-foreground font-medium truncate">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
