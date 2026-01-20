import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISearchBarProps {
    value: string;
    onChange: (query: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    className?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Search with AI...',
    isLoading = false,
    className
}) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync external value changes
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localValue, onChange, value]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onChange(localValue);
    }, [localValue, onChange]);

    return (
        <form onSubmit={handleSubmit} className={cn('w-full', className)}>
            <div className="relative">
                {/* AI Indicator */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Sparkles className={cn(
                        "h-4 w-4 text-violet-500",
                        isLoading && "animate-pulse"
                    )} />
                </div>

                {/* Search Input */}
                <Input
                    type="text"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "h-12 pl-12 pr-12 text-base",
                        "bg-background border-border",
                        "focus-visible:ring-1 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50",
                        "placeholder:text-muted-foreground/60"
                    )}
                />

                {/* Search Button */}
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </form>
    );
};

export default AISearchBar;
