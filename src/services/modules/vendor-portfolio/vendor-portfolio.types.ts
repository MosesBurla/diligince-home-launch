export interface ProjectImage {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PortfolioProject {
  _id: string;
  vendorId: string;
  name: string;
  clientName?: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in_progress' | 'planned';
  technologies: string[];
  outcomes?: string;
  projectValue?: number;
  currency?: string;
  image?: ProjectImage;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  clientName?: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'completed' | 'in_progress' | 'planned';
  technologies: string[];
  outcomes?: string;
  projectValue?: number;
  currency?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface PortfolioListResponse {
  projects: PortfolioProject[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}
