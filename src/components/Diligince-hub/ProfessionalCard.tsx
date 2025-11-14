import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, Award, Star, Eye, UserPlus, IndianRupee } from "lucide-react";
import type { ProfessionalListItem } from "@/types/professional";
import { useNavigate } from "react-router-dom";

interface ProfessionalCardProps {
  professional: ProfessionalListItem;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
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
              {professional.avatar ? (
                <img src={professional.avatar} alt={professional.name} className="w-12 h-12 rounded-full" />
              ) : (
                getInitials(professional.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{professional.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{professional.expertise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {professional.isVerified && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(professional.rating)}</div>
          <span className="text-sm font-medium">{professional.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({professional.reviewCount} reviews)</span>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-2" />
            <span>{professional.experience} Years Experience</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{professional.city}, {professional.state}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span>{professional.hourlyRate.toLocaleString()}/hour</span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-sm font-medium mb-2">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {professional.topSkills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {professional.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{professional.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Availability & Certifications */}
        <div className="pt-2 border-t flex items-center justify-between">
          <Badge className={getAvailabilityColor(professional.availability)}>
            {professional.availability.charAt(0).toUpperCase() + professional.availability.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {professional.certificationCount} Certifications
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => navigate(`/dashboard/Diligince-hub/professionals/${professional.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button variant="outline" className="flex-1">
            <UserPlus className="w-4 h-4 mr-2" />
            Hire
          </Button>
        </div>
      </div>
    </Card>
  );
};
