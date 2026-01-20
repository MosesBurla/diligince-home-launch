/**
 * Formatters Utility
 * 
 * Common formatting functions for currency, dates, etc.
 */

/**
 * Format a number as Indian Rupees currency
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(date);
}

/**
 * Format a date with time
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
  });
}
