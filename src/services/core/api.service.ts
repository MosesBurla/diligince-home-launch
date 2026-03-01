//API Service tsx
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/cookieService';
const BASE_URL = 'http://13.234.207.18:8020/';

/**
 * API Connection Status Tracker
 * Monitors connectivity to the backend API
 */
export const apiConnectionStatus = {
  isConnected: true,
  lastChecked: null as Date | null,

  /**
   * Check if the API is reachable
   * Caches result for 60 seconds to avoid excessive checks
   */
  async check(): Promise<boolean> {
    // Use cached result if checked within last minute
    if (this.lastChecked && Date.now() - this.lastChecked.getTime() < 60000) {
      return this.isConnected;
    }

    try {
      await axios.get(`${BASE_URL}/api/v1/health`, { timeout: 3000 });
      this.isConnected = true;
      this.lastChecked = new Date();
      return true;
    } catch {
      this.isConnected = false;
      this.lastChecked = new Date();
      return false;
    }
  },

  /**
   * Force recheck of API connection (bypasses cache)
   */
  async forceCheck(): Promise<boolean> {
    this.lastChecked = null;
    return this.check();
  }
};

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh-token`,
            { refresh_token: refreshToken }
          );

          // Backend returns tokens in 'meta' object
          const { access_token, refresh_token: new_refresh_token } = response.data.meta;

          // Update both tokens in localStorage
          localStorage.setItem('authToken', access_token);
          if (new_refresh_token) {
            localStorage.setItem('refreshToken', new_refresh_token);
          }

          console.log('[TokenRefresh] Tokens refreshed successfully');

          // Process queued requests with new token
          processQueue(null, access_token);

          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('[TokenRefresh] Refresh failed:', refreshError);

          // Process queued requests with error
          processQueue(refreshError as Error, null);

          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('roleConfiguration');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('roleConfiguration');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


// Generic GET method
const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse = await api.get(url, config);

  // Check if response has standardized envelope structure
  if (response.data &&
    typeof response.data === 'object' &&
    'success' in response.data &&
    'data' in response.data) {
    return response.data as T;
  }

  // Return raw data for non-enveloped responses
  return response.data as T;
};

// Generic POST method
const post = async <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
  let response: AxiosResponse;

  // If data is FormData, use base axios directly without default JSON headers
  if (data instanceof FormData) {
    const token = localStorage.getItem('authToken');
    response = await axios.post(`${BASE_URL}${url}`, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // No Content-Type - let axios auto-detect multipart/form-data
      },
    });
  } else {
    response = await api.post(url, data, config);
  }

  // Check if response has standardized envelope structure
  if (response.data &&
    typeof response.data === 'object' &&
    'success' in response.data &&
    'data' in response.data) {
    return response.data as T;
  }

  // Return raw data for non-enveloped responses
  return response.data as T;
};

// Generic PUT method
const put = async <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse = await api.put(url, data, config);

  // Check if response has standardized envelope structure
  if (response.data &&
    typeof response.data === 'object' &&
    'success' in response.data &&
    'data' in response.data) {
    return response.data as T;
  }

  // Return raw data for non-enveloped responses
  return response.data as T;
};

// Generic DELETE method
const remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse = await api.delete(url, config);

  // Check if response has standardized envelope structure
  if (response.data &&
    typeof response.data === 'object' &&
    'success' in response.data &&
    'data' in response.data) {
    return response.data as T;
  }

  // Return raw data for non-enveloped responses
  return response.data as T;
};

// Generic PATCH method
const patch = async <T, D>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse = await api.patch(url, data, config);

  // Check if response has standardized envelope structure
  if (response.data &&
    typeof response.data === 'object' &&
    'success' in response.data &&
    'data' in response.data) {
    return response.data as T;
  }

  // Return raw data for non-enveloped responses
  return response.data as T;
};

export default {
  get,
  post,
  put,
  patch,
  remove
};
