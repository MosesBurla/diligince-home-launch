// API Configuration & Utilities

export const API_BASE_PATH = '/api/v1';

/**
 * Build query string from parameters object
 */
export function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      // If value is an object/array, serialize as JSON
      if (typeof value === 'object') {
        const serialized = JSON.stringify(value);
        // Only add if object has keys or array has items
        if (serialized !== '{}' && serialized !== '[]') {
          queryParams.append(key, serialized);
        }
      } else {
        queryParams.append(key, String(value));
      }
    }
  }
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Legacy alias for backward compatibility
 */
export const generateQueryParams = buildQueryString;
