/**
 * Subscription Routes
 * 
 * API route definitions for subscription plans, add-ons, and GST configuration.
 * 
 * @module subscription.routes
 */

import { API_BASE_PATH, buildQueryString } from '../../core/api.config';
import type { GetPlansParams, GetAddOnsParams } from './subscription.types';

const BASE_PATH = API_BASE_PATH;

export const subscriptionRoutes = {
  /**
   * GET /subscription-plans
   * Fetch all subscription plans, optionally filtered by user type
   */
  plans: (params?: GetPlansParams) => 
    `${BASE_PATH}/subscription-plans${buildQueryString(params)}`,

  /**
   * GET /subscription-plans/:code
   * Fetch a specific plan by its code
   */
  planByCode: (code: string) => 
    `${BASE_PATH}/subscription-plans/${code}`,

  /**
   * GET /add-ons
   * Fetch all add-ons, optionally filtered by user type
   */
  addOns: (params?: GetAddOnsParams) => 
    `${BASE_PATH}/add-ons${buildQueryString(params)}`,

  /**
   * GET /gst-rate
   * Fetch current GST rate and configuration
   */
  gstRate: `${BASE_PATH}/gst-rate`,
};
