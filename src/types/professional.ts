
// Professional-specific type definitions

export interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  expertise: string[];
  experience: number;
  location: string;
  rating: number;
  hourlyRate?: string;
  availability: ProfessionalAvailability;
  skills: string[];
  certifications: Certification[];
  projects: ProfessionalProject[];
  status: ProfessionalStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProfessionalStatus = 'active' | 'inactive' | 'busy' | 'available';

export type ProfessionalAvailability = 'available' | 'busy' | 'unavailable';

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface ProfessionalProject {
  id: string;
  title: string;
  description: string;
  client: string;
  duration: string;
  status: ProjectStatus;
  skills: string[];
  startDate: string;
  endDate?: string;
}

export type ProjectStatus = 'ongoing' | 'completed' | 'paused' | 'cancelled';

// ============= Diligince HUB Types =============

export interface ProfessionalListItem {
  id: string;
  name: string;
  expertise: string[];
  experience: number;
  location: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  currency: string;
  availability: ProfessionalAvailability;
  skills: string[];
  topSkills: string[];
  completedProjects: number;
  responseTime: string;
  certificationCount: number;
  isVerified: boolean;
  avatar?: string;
}

export interface ProfessionalSearchFilters {
  search?: string;
  rating?: number;
  expertise?: string[];
  skills?: string[];
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  minRate?: number;
  maxRate?: number;
  availability?: ProfessionalAvailability;
  page?: number;
  limit?: number;
}

export interface ProfessionalListResponse {
  success: boolean;
  data: {
    professionals: ProfessionalListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    aggregations: {
      totalProfessionals: number;
      averageRating: number;
      averageHourlyRate: number;
      expertiseCounts: Record<string, number>;
      locationCounts: Record<string, number>;
    };
  };
}
