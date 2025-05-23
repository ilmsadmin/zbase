/**
 * Format a number as currency
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: vi-VN)
 * @param currency - The currency code (default: VND)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  locale = 'vi-VN',
  currency = 'VND'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format type
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'long' | 'full' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' ? { year: 'numeric', month: '2-digit', day: '2-digit' } :
    format === 'long' ? { year: 'numeric', month: 'long', day: 'numeric' } :
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  
  return dateObj.toLocaleDateString('vi-VN', options);
};

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param decimalPlaces - Number of decimal places
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  decimalPlaces = 0
): string => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a percentage
 * @param value - The number to format as a percentage (0.1 = 10%)
 * @param decimalPlaces - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercent = (
  value: number,
  decimalPlaces = 1
): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);
};

/**
 * Format a phone number in Vietnamese format
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Vietnamese phone number
  if (cleaned.length !== 10 && cleaned.length !== 11) {
    return phoneNumber; // Return original if not valid
  }
  
  // Format as per Vietnamese standard
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
  }
};
