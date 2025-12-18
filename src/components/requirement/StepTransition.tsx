import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface StepTransitionProps {
  children: React.ReactNode;
  stepKey: number;
  direction?: "forward" | "backward";
  className?: string;
}

export const StepTransition: React.FC<StepTransitionProps> = ({
  children,
  stepKey,
  direction = "forward",
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayContent, setDisplayContent] = useState(children);
  const prevKeyRef = useRef(stepKey);

  useEffect(() => {
    if (prevKeyRef.current !== stepKey) {
      setIsAnimating(true);
      
      // Small delay for exit animation
      const exitTimer = setTimeout(() => {
        setDisplayContent(children);
        
        // Reset animation state after enter animation
        const enterTimer = setTimeout(() => {
          setIsAnimating(false);
        }, 300);
        
        return () => clearTimeout(enterTimer);
      }, 150);

      prevKeyRef.current = stepKey;
      return () => clearTimeout(exitTimer);
    } else {
      setDisplayContent(children);
    }
  }, [stepKey, children]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isAnimating && direction === "forward" && "animate-slide-in-right",
        isAnimating && direction === "backward" && "animate-slide-in-left",
        className
      )}
    >
      {displayContent}
    </div>
  );
};

export default StepTransition;
