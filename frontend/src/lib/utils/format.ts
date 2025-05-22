/**
 * Formats a number as currency (VND)
 * @param value The number to format
 * @param currency The currency code (default: VND)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'VND'): string {
  if (typeof value !== 'number') return '0₫';
  
  // Format as VND by default
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  
  // For other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Formats a date string to a localized date string
 * @param dateString The date string to format
 * @param locale The locale to use (default: vi-VN)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'vi-VN'): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

/**
 * Formats a date string to a localized date and time string
 * @param dateString The date string to format
 * @param locale The locale to use (default: vi-VN)
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string, locale: string = 'vi-VN'): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

/**
 * Format a number with thousands separators
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

/**
 * Format a number as a percentage
 * @param value The number to format as percentage (e.g., 0.25 for 25%)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
}
