import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Briefcase, Award, Star, Eye, UserPlus, IndianRupee, Clock, CheckCircle2, Zap } from "lucide-react";
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
    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/80">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20 shadow-sm">
              {professional.avatar ? (
                <img src={professional.avatar} alt={professional.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                getInitials(professional.name)
              )}
            </div>
            {/* Availability Indicator */}
            {professional.availability === 'available' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
              {professional.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{professional.expertise}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(professional.rating)}</div>
              <span className="text-sm font-semibold">{professional.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({professional.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border">
            <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Experience</p>
              <p className="text-sm font-semibold truncate">{professional.experience} Years</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border">
            <Award className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-sm font-semibold truncate">{professional.completedProjects}</p>
            </div>
          </div>
        </div>

        {/* Location & Rate */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{professional.city}, {professional.state}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-1.5 text-foreground">
              <IndianRupee className="w-4 h-4" />
              <span className="font-bold text-lg">{professional.hourlyRate.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{professional.responseTime}</span>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top Skills</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {professional.topSkills.slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                {skill}
              </Badge>
            ))}
            {professional.topSkills.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{professional.topSkills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Additional Info */}
        {professional.certificationCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{professional.certificationCount} Certifications</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/professionals/${professional.id}`)}
            className="w-full group/btn hover:border-primary/50"
          >
            <Eye className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            View
          </Button>
          <Button
            size="sm"
            onClick={() => navigate(`/professionals/${professional.id}/hire`)}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Hire Now
          </Button>
        </div>
      </div>
    </Card>
  );
};
