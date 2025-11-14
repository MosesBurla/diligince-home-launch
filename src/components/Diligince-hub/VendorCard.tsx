import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, Award, Star, Eye, Mail } from "lucide-react";
import type { VendorListItem } from "@/types/vendor";
import { useNavigate } from "react-router-dom";

interface VendorCardProps {
  vendor: VendorListItem;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {vendor.avatar ? (
                <img src={vendor.avatar} alt={vendor.name} className="w-12 h-12 rounded-full" />
              ) : (
                getInitials(vendor.companyName)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{vendor.companyName}</h3>
              <p className="text-sm text-muted-foreground truncate">{vendor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {vendor.isVerified && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(vendor.rating)}</div>
          <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({vendor.reviewCount} reviews)</span>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="capitalize">{vendor.vendorType} Vendor</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{vendor.city}, {vendor.state}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Award className="w-4 h-4 mr-2" />
            <span>{vendor.completedProjects} Completed Projects</span>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <p className="text-sm font-medium mb-2">Specializations:</p>
          <div className="flex flex-wrap gap-2">
            {vendor.specialization.slice(0, 3).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {spec}
              </Badge>
            ))}
            {vendor.specialization.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{vendor.specialization.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="pt-2 border-t">
          <Badge className={getAvailabilityColor(vendor.availability)}>
            {vendor.availability.charAt(0).toUpperCase() + vendor.availability.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">
            Response: {vendor.responseTime}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => navigate(`/dashboard/Diligince-hub/vendors/${vendor.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button variant="outline" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </Card>
  );
};
