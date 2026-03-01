/**
 * Hub Directory Service
 * Fetches approved/verified vendor and professional profiles for the Diligince Hub.
 */

import api from '@/services/api.service';

export interface HubVendorFilters {
    search?: string;
    vendorType?: string;
    rating?: number;
    state?: string;
    page?: number;
    limit?: number;
}

export interface HubProfessionalFilters {
    search?: string;
    expertise?: string;
    rating?: number;
    state?: string;
    page?: number;
    limit?: number;
}

export interface HubVendor {
    id: string;
    name: string;
    companyName: string;
    vendorType: string;
    specialization: string[];
    category: string;
    city: string;
    state: string;
    location: string;
    rating: number;
    reviewCount: number;
    completedProjects: number;
    yearsInBusiness: number;
    isVerified: boolean;
    verificationStatus: string;
    availability: 'available' | 'busy';
    responseTime: string;
    certificationCount: number;
    qualityStandards: string[];
}

export interface HubProfessional {
    id: string;
    name: string;
    title: string;
    expertise: string[];
    specialization: string;
    skills: string[];
    topSkills: string[];
    experience: number;
    location: string;
    city: string;
    state: string;
    rating: number;
    reviewCount: number;
    completedProjects: number;
    hourlyRate: number;
    currency: string;
    availability: 'available' | 'busy';
    responseTime: string;
    certificationCount: number;
    isVerified: boolean;
    verificationStatus: string;
}

export interface HubVendorResponse {
    success: boolean;
    data: {
        vendors: HubVendor[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface HubProfessionalResponse {
    success: boolean;
    data: {
        professionals: HubProfessional[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class HubService {
    /**
     * Fetch approved vendors from the hub directory.
     */
    async getVendors(filters: HubVendorFilters = {}): Promise<HubVendorResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.vendorType && filters.vendorType !== 'all') params.set('vendorType', filters.vendorType);
        if (filters.rating) params.set('rating', String(filters.rating));
        if (filters.state && filters.state !== 'all') params.set('state', filters.state);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));

        const response = await api.get<HubVendorResponse>(`/api/v1/hub/vendors?${params.toString()}`);
        return response;
    }

    /**
     * Fetch approved professionals from the hub directory.
     */
    async getProfessionals(filters: HubProfessionalFilters = {}): Promise<HubProfessionalResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.expertise && filters.expertise !== 'all') params.set('expertise', filters.expertise);
        if (filters.rating) params.set('rating', String(filters.rating));
        if (filters.state && filters.state !== 'all') params.set('state', filters.state);
        if (filters.page) params.set('page', String(filters.page));
        if (filters.limit) params.set('limit', String(filters.limit));

        const response = await api.get<HubProfessionalResponse>(`/api/v1/hub/professionals?${params.toString()}`);
        return response;
    }
}

export const hubService = new HubService();
export default hubService;
