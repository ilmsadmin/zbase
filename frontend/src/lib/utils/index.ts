/**
 * Utility functions for the application
 * This file exports common helpers from various utility modules
 */

// Re-export format utilities which are commonly used
export * from './format';

// Re-export chart optimization utilities
export * from './chart-optimization';

// Common class combining function for Tailwind CSS
export function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Delays execution for a specified amount of time
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Formats a currency value
 * @param value Value to format as currency
 * @param locale Locale to use for formatting (defaults to 'vi-VN')
 * @param currency Currency code (defaults to 'VND')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, locale = 'vi-VN', currency = 'VND'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length before truncating
 * @returns Truncated text string
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
