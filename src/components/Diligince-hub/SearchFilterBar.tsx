import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Star, MapPin, Briefcase, Filter, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  type: 'vendors' | 'professionals';
  onSearch: (term: string) => void;
  onFilterChange: (filters: any) => void;
  filters: any;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  type,
  onSearch,
  onFilterChange,
  filters,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    const clearedFilters = { rating: undefined, category: undefined, location: undefined };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = searchTerm || localFilters.rating || localFilters.category || localFilters.location;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
          <Input
            type="text"
            placeholder={`Search by name, ${type === 'vendors' ? 'company, specialization' : 'expertise, skills'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-14 rounded-2xl text-base border-2 bg-background/50 backdrop-blur-sm focus:border-primary/50 shadow-sm hover:shadow-md transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Filters</span>
        </div>

        {/* Rating Filter */}
        <div className="relative group/filter">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <Star className="w-4 h-4 text-amber-500" />
            <Select
              value={localFilters.rating?.toString() || "all"}
              onValueChange={(value) => handleFilterChange('rating', value === 'all' ? undefined : Number(value))}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All Ratings</SelectItem>
                <SelectItem value="4" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4+ Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="3" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>3+ Stars</span>
                  </div>
                </SelectItem>
                <SelectItem value="2" className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>2+ Stars</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category/Expertise Filter */}
        {type === 'vendors' ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <Briefcase className="w-4 h-4 text-primary" />
            <Select
              value={localFilters.category || "all"}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
                <SelectItem value="service" className="rounded-lg">Service Vendor</SelectItem>
                <SelectItem value="product" className="rounded-lg">Product Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <Select
              value={localFilters.expertise || "all"}
              onValueChange={(value) => handleFilterChange('expertise', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All Expertise</SelectItem>
                <SelectItem value="Quality Control & Assurance" className="rounded-lg">Quality Control</SelectItem>
                <SelectItem value="Manufacturing Quality Engineer" className="rounded-lg">Quality Engineer</SelectItem>
                <SelectItem value="Quality Control Specialist" className="rounded-lg">QC Specialist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Filter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
          <MapPin className="w-4 h-4 text-primary" />
          <Select
            value={localFilters.location || "all"}
            onValueChange={(value) => handleFilterChange('location', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">All Locations</SelectItem>
              <SelectItem value="Mumbai" className="rounded-lg">Mumbai</SelectItem>
              <SelectItem value="Pune" className="rounded-lg">Pune</SelectItem>
              <SelectItem value="Bengaluru" className="rounded-lg">Bengaluru</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <X className="w-4 h-4 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground">Active:</span>
          {searchTerm && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Search className="w-3 h-3 mr-1" />
              {searchTerm}
            </Badge>
          )}
          {localFilters.rating && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
              {localFilters.rating}+ Stars
            </Badge>
          )}
          {localFilters.category && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full capitalize">
              <Briefcase className="w-3 h-3 mr-1" />
              {localFilters.category}
            </Badge>
          )}
          {localFilters.expertise && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 mr-1" />
              {localFilters.expertise}
            </Badge>
          )}
          {localFilters.location && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1" />
              {localFilters.location}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
