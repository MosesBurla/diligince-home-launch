import apiService from '../../core/api.service';
import { vendorRFQsRoutes } from './rfqs.routes';
import type {
  RFQBrowseResponse,
  RFQDetailResponse,
  RFQStatsResponse,
  RFQBrowseFilters,
  RFQDetailItem,
  RFQBrowseItem,
} from '@/types/rfq-browse';

class VendorRFQsService {
  /**
   * Browse available RFQs with filters
   */
  async getBrowseRFQs(filters?: RFQBrowseFilters): Promise<RFQBrowseResponse> {
    const response = await apiService.get<RFQBrowseResponse>(
      vendorRFQsRoutes.browse(filters)
    );
    return response;
  }

  /**
   * Get RFQ details
   */
  async getRFQDetails(rfqId: string): Promise<RFQDetailItem> {
    const response = await apiService.get<RFQDetailResponse>(
      vendorRFQsRoutes.getById(rfqId)
    );
    return response.data;
  }

  /**
   * Get RFQ statistics for vendor dashboard
   */
  async getRFQStats(): Promise<RFQStatsResponse> {
    const response = await apiService.get<RFQStatsResponse>(
      vendorRFQsRoutes.stats
    );
    return response;
  }

  /**
   * Toggle save/unsave state of an RFQ
   */
  async toggleSaveRFQ(rfqId: string): Promise<{
    success: boolean;
    message: string;
    data: { rfqId: string; saved: boolean };
  }> {
    const response = await apiService.post<{
      success: boolean;
      message: string;
      data: { rfqId: string; saved: boolean };
    }, Record<string, never>>(
      vendorRFQsRoutes.save(rfqId),
      {}
    );
    return response;
  }

  /**
   * Get saved/bookmarked RFQs
   */
  async getSavedRFQs(): Promise<{
    success: boolean;
    data: { rfqs: RFQBrowseItem[]; total: number };
  }> {
    const response = await apiService.get<{
      success: boolean;
      data: { rfqs: RFQBrowseItem[]; total: number };
    }>(vendorRFQsRoutes.saved);
    return response;
  }

  /**
   * Get applied RFQs (where vendor has submitted quotations)
   */
  async getAppliedRFQs(filters?: RFQBrowseFilters): Promise<RFQBrowseResponse> {
    const response = await apiService.get<RFQBrowseResponse>(
      vendorRFQsRoutes.applied(filters)
    );
    return response;
  }
}

export const vendorRFQsService = new VendorRFQsService();
export default vendorRFQsService;
