import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlighted" | "subtle";
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  variant = "default",
}) => {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variant === "default" && "bg-card border border-border/50 shadow-sm",
        variant === "highlighted" && "bg-primary/5 border border-primary/20 shadow-sm",
        variant === "subtle" && "bg-muted/30",
        className
      )}
    >
      {(title || description) && (
        <div className={cn(
          "px-6 py-4 border-b border-border/50",
          variant === "highlighted" && "border-primary/20"
        )}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                variant === "highlighted" ? "bg-primary/10" : "bg-muted"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  variant === "highlighted" ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
