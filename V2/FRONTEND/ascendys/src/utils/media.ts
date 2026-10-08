/**
 * Media URL Utilities
 * Helpers for handling media URLs from the backend
 */

/**
 * Gets the full URL for a media file from the backend
 * @param path - The media path from the API (can be relative or absolute)
 * @param fallback - Optional fallback URL if path is null/undefined
 * @returns The full media URL or fallback
 */
export function getMediaUrl(path: string | null | undefined, fallback?: string): string | null {
  if (!path) return fallback || null;
  
  // If already absolute URL, return as is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  
  // Get base URL without /api/v1 suffix for media files
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
  const baseUrl = apiBase.replace(/\/api\/v1\/?$/, '');
  
  return `${baseUrl}/${path}`;
}

/**
 * Validates if a price string is a valid numeric value
 * @param price - The price string to validate
 * @returns True if valid numeric price
 */
export function isValidPrice(price: string | null | undefined): boolean {
  if (!price || price === "" || price === "0") return false;
  
  // Check if it's a valid number (allows decimal numbers)
  const numericValue = Number.parseFloat(price.replace(/[^\d.-]/g, ''));
  return !Number.isNaN(numericValue) && numericValue > 0;
}

/**
 * Formats a price with currency
 * @param price - The price string
 * @param currency - The currency code (default: XAF)
 * @param fallback - Fallback text if price is invalid
 * @returns Formatted price string or fallback
 */
export function formatPrice(
  price: string | null | undefined,
  currency: string = 'XAF',
  fallback: string = 'Nous contacter'
): string {
  if (!isValidPrice(price)) {
    return fallback;
  }
  
  return `${price} ${currency}`;
}
