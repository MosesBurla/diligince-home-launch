import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, X, Star, MapPin, Briefcase, Filter, Sparkles, Truck
} from "lucide-react";
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

const VENDOR_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'ServiceVendor', label: 'Service Vendor' },
  { value: 'ProductVendor', label: 'Product Vendor' },
  { value: 'LogisticsVendor', label: 'Logistics Vendor' },
];

const VENDOR_TYPE_ICONS: Record<string, React.ElementType> = {
  ServiceVendor: Briefcase,
  ProductVendor: Briefcase,
  LogisticsVendor: Truck,
};

const INDIA_STATES = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat',
  'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Andhra Pradesh',
  'Madhya Pradesh', 'Punjab', 'Haryana', 'Kerala', 'Odisha',
];

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
    }, 350);
    return () => clearTimeout(debounce);
  }, [searchTerm, onSearch]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    const cleared = { rating: undefined, vendorType: undefined, expertise: undefined, state: undefined };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const activeVendorTypeLabel = VENDOR_TYPES.find(t => t.value === localFilters.vendorType)?.label;
  const hasActiveFilters = searchTerm || localFilters.rating || localFilters.vendorType || localFilters.expertise || localFilters.state;

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors z-10" />
          <Input
            type="text"
            placeholder={type === 'vendors'
              ? 'Search by company name, specialization, category...'
              : 'Search by name, expertise, skills...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-12 h-14 rounded-2xl text-base border-2 bg-background/50 backdrop-blur-sm focus:border-primary/50 shadow-sm hover:shadow-md transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted z-10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Filters</span>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
          <Star className="w-4 h-4 text-amber-500" />
          <Select
            value={localFilters.rating?.toString() || 'all'}
            onValueChange={(v) => handleFilterChange('rating', v === 'all' ? undefined : Number(v))}
          >
            <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
              <SelectValue placeholder="All Ratings" />
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
            </SelectContent>
          </Select>
        </div>

        {/* Vendor Type Filter (vendors only) */}
        {type === 'vendors' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <Truck className="w-4 h-4 text-primary" />
            <Select
              value={localFilters.vendorType || 'all'}
              onValueChange={(v) => handleFilterChange('vendorType', v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {VENDOR_TYPES.map(vt => (
                  <SelectItem key={vt.value} value={vt.value} className="rounded-lg">
                    {vt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Expertise Filter (professionals only) */}
        {type === 'professionals' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <Select
              value={localFilters.expertise || 'all'}
              onValueChange={(v) => handleFilterChange('expertise', v === 'all' ? undefined : v)}
            >
              <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
                <SelectValue placeholder="All Expertise" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All Expertise</SelectItem>
                <SelectItem value="Quality Control" className="rounded-lg">Quality Control</SelectItem>
                <SelectItem value="Manufacturing" className="rounded-lg">Manufacturing</SelectItem>
                <SelectItem value="Supply Chain" className="rounded-lg">Supply Chain</SelectItem>
                <SelectItem value="Engineering" className="rounded-lg">Engineering</SelectItem>
                <SelectItem value="Procurement" className="rounded-lg">Procurement</SelectItem>
                <SelectItem value="Logistics" className="rounded-lg">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* State/Location Filter */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
          <MapPin className="w-4 h-4 text-primary" />
          <Select
            value={localFilters.state || 'all'}
            onValueChange={(v) => handleFilterChange('state', v === 'all' ? undefined : v)}
          >
            <SelectTrigger className="border-0 h-auto p-0 focus:ring-0 bg-transparent [&>svg]:hidden">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">All States</SelectItem>
              {INDIA_STATES.map(s => (
                <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
              ))}
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

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-muted-foreground">Active:</span>
          {searchTerm && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Search className="w-3 h-3 mr-1" />{searchTerm}
            </Badge>
          )}
          {localFilters.rating && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
              {localFilters.rating}+ Stars
            </Badge>
          )}
          {localFilters.vendorType && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Truck className="w-3 h-3 mr-1" />
              {VENDOR_TYPES.find(t => t.value === localFilters.vendorType)?.label}
            </Badge>
          )}
          {localFilters.expertise && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <Sparkles className="w-3 h-3 mr-1" />{localFilters.expertise}
            </Badge>
          )}
          {localFilters.state && (
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              <MapPin className="w-3 h-3 mr-1" />{localFilters.state}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
