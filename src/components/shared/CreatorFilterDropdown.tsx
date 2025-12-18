import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, X, Loader2 } from "lucide-react";

export interface Creator {
    id: string;
    name: string;
    email: string;
    count: number;
}

export interface CreatorFilterDropdownProps {
    creators: Creator[];
    selectedCreatorId: string;
    currentUserId: string;
    onSelect: (creatorId: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const CreatorFilterDropdown: React.FC<CreatorFilterDropdownProps> = ({
    creators,
    selectedCreatorId,
    currentUserId,
    onSelect,
    isLoading = false,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get display label for the selected value
    const getDisplayLabel = (): string | null => {
        if (selectedCreatorId === 'all' || !selectedCreatorId) return null;
        if (selectedCreatorId === 'me') return 'Me';
        
        const creator = creators.find(c => c.id === selectedCreatorId);
        return creator?.name || creator?.email || null;
    };

    // Check if a filter is active (not "all")
    const isActive = selectedCreatorId && selectedCreatorId !== 'all';
    const displayLabel = getDisplayLabel();

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    const clearFilter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect('all');
    };

    // Filter out current user from creators list (covered by "Me" option)
    const filteredCreators = creators.filter(c => c.id !== currentUserId);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                disabled={disabled || isLoading}
                className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm transition-colors duration-200 ${
                    isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                } ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Filter className="w-4 h-4" />
                )}
                <span>Created By</span>
                {isActive && displayLabel && (
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                        isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                        {displayLabel}
                    </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 min-w-48">
                    <div className="p-3 border-b border-border flex justify-between items-center">
                        <span className="font-medium text-foreground">Filter by Creator</span>
                        {isActive && (
                            <button
                                onClick={clearFilter}
                                className="text-destructive hover:text-destructive/80 text-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {/* All option */}
                        <label
                            className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelect('all')}
                        >
                            <input
                                type="radio"
                                name="creator-filter"
                                checked={selectedCreatorId === 'all' || !selectedCreatorId}
                                onChange={() => handleSelect('all')}
                                className="rounded-full border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">All</span>
                        </label>

                        {/* Me option */}
                        <label
                            className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelect('me')}
                        >
                            <input
                                type="radio"
                                name="creator-filter"
                                checked={selectedCreatorId === 'me'}
                                onChange={() => handleSelect('me')}
                                className="rounded-full border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-foreground">Me</span>
                        </label>

                        {/* Team Members section */}
                        {filteredCreators.length > 0 && (
                            <>
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">
                                    Team Members
                                </div>
                                {filteredCreators.map((creator) => (
                                    <label
                                        key={creator.id}
                                        className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                                        onClick={() => handleSelect(creator.id)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="creator-filter"
                                                checked={selectedCreatorId === creator.id}
                                                onChange={() => handleSelect(creator.id)}
                                                className="rounded-full border-border text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-foreground">
                                                {creator.name || creator.email}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground bg-muted px-1.5 rounded-full">
                                            {creator.count}
                                        </span>
                                    </label>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
