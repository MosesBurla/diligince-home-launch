import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Star, MapPin, Briefcase } from "lucide-react";
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
    <div className="sticky top-0 z-10 bg-background border-b pb-4 mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={`Search by name, ${type === 'vendors' ? 'company, specialization' : 'expertise, skills'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-muted-foreground" />
          <Select
            value={localFilters.rating?.toString() || "all"}
            onValueChange={(value) => handleFilterChange('rating', value === 'all' ? undefined : Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category/Expertise Filter */}
        {type === 'vendors' ? (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <Select
              value={localFilters.category || "all"}
              onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="service">Service Vendor</SelectItem>
                <SelectItem value="product">Product Vendor</SelectItem>
                <SelectItem value="logistics">Logistics Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <Select
              value={localFilters.expertise || "all"}
              onValueChange={(value) => handleFilterChange('expertise', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                <SelectItem value="Quality Control & Assurance">Quality Control</SelectItem>
                <SelectItem value="Manufacturing Engineering">Manufacturing</SelectItem>
                <SelectItem value="Supply Chain Management">Supply Chain</SelectItem>
                <SelectItem value="Process Engineering">Process Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <Select
            value={localFilters.location || "all"}
            onValueChange={(value) => handleFilterChange('location', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
              <SelectItem value="Pune">Pune</SelectItem>
              <SelectItem value="Bengaluru">Bengaluru</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Chennai">Chennai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};
