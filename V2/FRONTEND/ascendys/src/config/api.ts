/**
 * API Configuration
 * Centralized API endpoints and configuration for Ascendys Connect Backend
 */

// Base API URL - will be used for all API calls
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/auth/token/refresh/',
    LOGOUT: '/auth/logout/',
    PROFILE: '/auth/profile/',
    UPDATE_PROFILE: '/auth/me/update/',
    CHANGE_PASSWORD: '/auth/change-password/',
    RESET_PASSWORD: '/auth/reset-password/',
    RESET_PASSWORD_CONFIRM: '/auth/reset-password-confirm/',
  },

  // Users (Super Admin only)
  USERS: {
    LIST: '/auth/users/',
    CREATE: '/auth/users/create/',
    DETAIL: (id: string) => `/auth/users/${id}/`,
    UPDATE: (id: string) => `/auth/users/${id}/`,
    DELETE: (id: string) => `/auth/users/${id}/delete/`,
    TOGGLE_STATUS: (id: string) => `/auth/users/${id}/toggle-status/`,
    STATS: '/auth/users/stats/',
  },

  // Company
  COMPANY: {
    INFO: '/company/',
    UPDATE: '/company/',
  },

  // Trainings
  TRAININGS: {
    LIST: '/trainings/',
    CREATE: '/trainings/',
    DETAIL: (slug: string) => `/trainings/${slug}/`,
    UPDATE: (id: string) => `/trainings/${id}/`,
    DELETE: (id: string) => `/trainings/${id}/`,
    PUBLISH: (id: string) => `/trainings/${id}/publish/`,
    ARCHIVE: (id: string) => `/trainings/${id}/archive/`,
    CATEGORIES: '/trainings/categories/',
  },

  // Blog
  BLOG: {
    POSTS: '/blog/posts/',
    POST_DETAIL: (slug: string) => `/blog/posts/${slug}/`,
    POST_CREATE: '/blog/posts/',
    POST_UPDATE: (id: string) => `/blog/posts/${id}/`,
    POST_DELETE: (id: string) => `/blog/posts/${id}/`,
    POST_PUBLISH: (id: string) => `/blog/posts/${id}/publish/`,
    CATEGORIES: '/blog/categories/',
    TAGS: '/blog/tags/',
  },

  // Events
  EVENTS: {
    LIST: '/events/',
    CREATE: '/events/',
    DETAIL: (slug: string) => `/events/${slug}/`,
    UPDATE: (id: string) => `/events/${id}/`,
    DELETE: (id: string) => `/events/${id}/`,
    UPCOMING: '/events/upcoming/',
    FEATURED: '/events/featured/',
  },

  // Services
  SERVICES: {
    LIST: '/services/',
    CREATE: '/services/',
    DETAIL: (slug: string) => `/services/${slug}/`,
    UPDATE: (id: string) => `/services/${id}/`,
    DELETE: (id: string) => `/services/${id}/`,
    FEATURED: '/services/featured/',
  },

  // Offers
  OFFERS: {
    LIST: '/offers/',
    CREATE: '/offers/',
    DETAIL: (id: string) => `/offers/${id}/`,
    UPDATE: (id: string) => `/offers/${id}/`,
    DELETE: (id: string) => `/offers/${id}/`,
    ACTIVE: '/offers/active/',
  },

  // Contact & Newsletter
  CONTACT: {
    MESSAGES: '/contact/messages/',
    MESSAGE_DETAIL: (id: string) => `/contact/messages/${id}/`,
    MESSAGE_RESOLVE: (id: string) => `/contact/messages/${id}/mark_resolved/`,
    MESSAGE_ASSIGN: (id: string) => `/contact/messages/${id}/assign/`,
    NEWSLETTER_SUBSCRIBERS: '/contact/newsletter/',
  },

  // Testimonials & Partners
  TESTIMONIALS: {
    LIST: '/testimonials/',
    CREATE: '/testimonials/',
    UPDATE: (id: string) => `/testimonials/${id}/`,
    DELETE: (id: string) => `/testimonials/${id}/`,
    TOGGLE_PUBLISHED: (id: string) => `/testimonials/${id}/toggle_published/`,
  },

  PARTNERS: {
    LIST: '/partners/',
    CREATE: '/partners/',
    UPDATE: (id: string) => `/partners/${id}/`,
    DELETE: (id: string) => `/partners/${id}/`,
    TOGGLE_FEATURED: (id: string) => `/partners/${id}/toggle_featured/`,
  },

  // Media (Super Admin only)
  MEDIA: {
    LIST: '/media/',
    UPLOAD: '/media/',
    DETAIL: (id: string) => `/media/${id}/`,
    DELETE: (id: string) => `/media/${id}/`,
    STATS: '/media/stats/',
  },

  // Dashboard (Super Admin only)
  DASHBOARD: {
    STATS: '/dashboard/stats/',
    CHARTS: '/dashboard/charts/',
    ACTIVITY_LOGS: '/dashboard/activity-logs/',
  },

  // Search
  SEARCH: {
    GLOBAL: '/search/',
    SITEMAP: '/search/sitemap/',
    SEO_META: '/search/seo-meta/',
  },
} as const;

// API Request Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
