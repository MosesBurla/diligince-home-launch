import { cn } from "@/lib/utils";
import { User, Package, Wrench, Truck, Check } from "lucide-react";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  {
    id: "expert",
    title: "Expert Services",
    description: "Professional consulting & technical expertise",
    icon: <User className="w-4 h-4" />,
  },
  {
    id: "product",
    title: "Products & Materials",
    description: "Equipment, spare parts & raw materials",
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: "service",
    title: "Contract Services",
    description: "Maintenance, construction & support services",
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    id: "logistics",
    title: "Logistics & Transport",
    description: "Transportation, warehousing & distribution",
    icon: <Truck className="w-4 h-4" />,
  },
];

interface CategorySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function CategorySelector({ value = [], onChange, error }: CategorySelectorProps) {
  const isSelected = (categoryId: string) => value.includes(categoryId);

  const handleToggle = (categoryId: string) => {
    if (isSelected(categoryId)) {
      // Remove if already selected
      onChange(value.filter(id => id !== categoryId));
    } else {
      // Add to selection
      onChange([...value, categoryId]);
    }
  };

  const getCategoryColor = (categoryId: string, selected: boolean) => {
    if (!selected) return "border-2 border-corporate-gray-200 bg-white hover:border-corporate-gray-300 text-corporate-gray-700";
    
    switch (categoryId) {
      case "product":
        return "border-2 border-[#722ed1] bg-[#722ed1] text-white";
      case "service":
        return "border-2 border-corporate-info-500 bg-corporate-info-500 text-white";
      case "expert":
        return "border-2 border-corporate-success-500 bg-corporate-success-500 text-white";
      case "logistics":
        return "border-2 border-corporate-warning-500 bg-corporate-warning-500 text-corporate-gray-900";
      default:
        return "border-2 border-corporate-navy-500 bg-corporate-navy-500 text-white";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-2 scrollbar-hide">
        {categories.map((category) => {
          const selected = isSelected(category.id);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleToggle(category.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 h-12 rounded-lg transition-all whitespace-nowrap touch-manipulation min-w-[140px]",
                getCategoryColor(category.id, selected)
              )}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.title}</span>
              {selected && (
                <Check className="w-4 h-4 ml-auto" />
              )}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} categor{value.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
