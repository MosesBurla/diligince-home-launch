import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DropdownPanelProps {
  trigger: React.ReactNode;
  title: string;
  titleIcon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  contentClassName?: string;
}

export const DropdownPanel: React.FC<DropdownPanelProps> = ({
  trigger,
  title,
  titleIcon,
  headerExtra,
  footer,
  children,
  open,
  onOpenChange,
  align = 'end',
  side = 'bottom',
  className,
  contentClassName,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        align={align}
        side={side}
        sideOffset={8}
        className={cn(
          "w-[380px] p-0 overflow-hidden",
          // Glassmorphism styling
          "bg-white/98 dark:bg-gray-950/98",
          "backdrop-blur-xl",
          "border border-border/60",
          "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "rounded-xl",
          // Animation
          "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            {titleIcon && (
              <span className="text-primary">{titleIcon}</span>
            )}
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            {headerExtra}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-muted"
            onClick={() => onOpenChange?.(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className={cn("max-h-[60vh]", contentClassName)}>
          {children}
        </ScrollArea>

        {/* Footer */}
        {footer && (
          <div className="border-t border-border/50 bg-muted/20">
            {footer}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DropdownPanel;
