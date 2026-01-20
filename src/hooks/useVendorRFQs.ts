import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vendorRFQsService } from '@/services/modules/vendors/rfqs.service';
import {
  RFQBrowseFilters,
  RFQBrowseItem,
  RFQStats,
  RFQBrowsePagination,
  SearchInterpretation
} from '@/types/rfq-browse';

interface UseVendorRFQsReturn {
  rfqs: RFQBrowseItem[];
  stats: RFQStats | null;
  searchInterpretation: SearchInterpretation | null;
  pagination: RFQBrowsePagination | null;
  isLoading: boolean;
  error: string | null;
  filters: RFQBrowseFilters;
  setFilters: (filters: RFQBrowseFilters) => void;
  setQuery: (query: string) => void;
  setAiRecommended: (aiRecommended: boolean) => void;
  clearFilters: () => void;
  toggleSaveRFQ: (rfqId: string) => void;
  refreshRFQs: () => void;
}

const defaultFilters: RFQBrowseFilters = {
  page: 1,
  limit: 12,
  aiRecommended: false
};

export const useVendorRFQs = (): UseVendorRFQsReturn => {
  const [filters, setFiltersState] = useState<RFQBrowseFilters>(defaultFilters);
  const queryClient = useQueryClient();

  // Fetch RFQs with React Query
  const {
    data: browseData,
    isLoading: isLoadingRFQs,
    error: rfqsError,
    refetch
  } = useQuery({
    queryKey: ['vendor-rfqs', 'browse', filters],
    queryFn: () => vendorRFQsService.getBrowseRFQs(filters),
    refetchOnMount: 'always', // Always refetch when component mounts
  });

  // Fetch stats - Moved to Service Vendor Dashboard
  // const {
  //   data: statsData,
  //   isLoading: isLoadingStats
  // } = useQuery({
  //   queryKey: ['vendor-rfqs', 'stats'],
  //   queryFn: () => vendorRFQsService.getRFQStats(),
  //   refetchOnMount: 'always',
  // });

  // Toggle save mutation
  const toggleSaveMutation = useMutation({
    mutationFn: vendorRFQsService.toggleSaveRFQ,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-rfqs'] });
      // Show toast with actual result from API
      if (response.data.saved) {
        toast.success('RFQ saved successfully');
      } else {
        toast.success('RFQ removed from saved list');
      }
    },
  });

  const setFilters = useCallback((newFilters: RFQBrowseFilters) => {
    setFiltersState(newFilters);
  }, []);

  const setQuery = useCallback((query: string) => {
    setFiltersState(prev => ({ ...prev, query: query || undefined, page: 1 }));
  }, []);

  const setAiRecommended = useCallback((aiRecommended: boolean) => {
    setFiltersState(prev => ({ ...prev, aiRecommended, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const toggleSaveRFQ = useCallback((rfqId: string) => {
    toggleSaveMutation.mutate(rfqId);
  }, [toggleSaveMutation]);

  const refreshRFQs = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    rfqs: browseData?.data?.rfqs || [],
    stats: null, // Stats moved to Service Vendor Dashboard
    searchInterpretation: browseData?.data?.searchInterpretation || null,
    pagination: browseData?.data?.pagination || null,
    isLoading: isLoadingRFQs,
    error: rfqsError?.message || null,
    filters,
    setFilters,
    setQuery,
    setAiRecommended,
    clearFilters,
    toggleSaveRFQ,
    refreshRFQs
  };
};

// Hook for single RFQ detail
export const useVendorRFQDetail = (rfqId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor-rfqs', rfqId],
    queryFn: () => vendorRFQsService.getRFQDetails(rfqId),
    enabled: !!rfqId,
  });

  return {
    rfq: data || null,
    isLoading,
    error: error?.message || null
  };
};
