/**
 * Routes Configuration
 * All application routes with permission requirements
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  roles: UserRole[];
  children?: RouteConfig[];
}

// Application Routes
export const ROUTES = {
  // Public Routes
  SIGN_IN: '/signin',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_CONFIRM: '/reset-password-confirm',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_RESET_CODE: '/verify-reset-code',
  VERIFY_OTP: '/verify-otp',
  CHANGE_PASSWORD_FIRST: '/change-password-first',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Users Management (Super Admin Only)
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_EDIT: (id: string) => `/users/${id}/edit`,

  // Trainings
  TRAININGS: '/trainings',
  TRAINING_CREATE: '/trainings/create',
  TRAINING_EDIT: (id: string) => `/trainings/${id}/edit`,

  // Blog
  BLOG_POSTS: '/blog/posts',
  BLOG_POST_CREATE: '/blog/posts/create',
  BLOG_POST_EDIT: (id: string) => `/blog/posts/${id}/edit`,
  BLOG_CATEGORIES: '/blog/categories',
  BLOG_TAGS: '/blog/tags',

  // Events
  EVENTS: '/events',
  EVENT_CREATE: '/events/create',
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,

  // Services
  SERVICES: '/services',
  SERVICE_CREATE: '/services/create',
  SERVICE_EDIT: (id: string) => `/services/${id}/edit`,

  // Offers
  OFFERS: '/offers',
  OFFER_CREATE: '/offers/create',
  OFFER_EDIT: (id: string) => `/offers/${id}/edit`,

  // Contact & Newsletter
  CONTACT_MESSAGES: '/contact/messages',
  NEWSLETTER_SUBSCRIBERS: '/newsletter/subscribers',

  // Testimonials & Partners
  TESTIMONIALS: '/testimonials',
  PARTNERS: '/partners',

  // Media Library (Super Admin Only)
  MEDIA: '/media',

  // Activity Logs (Super Admin Only)
  ACTIVITY_LOGS: '/activity-logs',

  // Settings (Super Admin Only)
  SETTINGS: '/settings',
  SETTINGS_COMPANY: '/settings/company',
  SETTINGS_SYSTEM: '/settings/system',

  // Profile
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
} as const;

// Sidebar Menu Configuration
export const SIDEBAR_MENU: RouteConfig[] = [
  {
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    path: ROUTES.USERS,
    label: 'Users',
    icon: 'users',
    roles: ['SUPER_ADMIN'], // Only Super Admin
  },
  {
    path: ROUTES.TRAININGS,
    label: 'Trainings',
    icon: 'trainings',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    path: ROUTES.BLOG_POSTS,
    label: 'Blog',
    icon: 'blog',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    children: [
      {
        path: ROUTES.BLOG_POSTS,
        label: 'Posts',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        path: ROUTES.BLOG_CATEGORIES,
        label: 'Categories',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        path: ROUTES.BLOG_TAGS,
        label: 'Tags',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
    ],
  },
  {
    path: ROUTES.EVENTS,
    label: 'Events',
    icon: 'events',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    path: ROUTES.SERVICES,
    label: 'Services',
    icon: 'services',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    path: ROUTES.OFFERS,
    label: 'Offers',
    icon: 'offers',
    roles: ['SUPER_ADMIN', 'ADMIN'],
  },
  {
    path: ROUTES.CONTACT_MESSAGES,
    label: 'Contact & Newsletter',
    icon: 'contact',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    children: [
      {
        path: ROUTES.CONTACT_MESSAGES,
        label: 'Messages',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        path: ROUTES.NEWSLETTER_SUBSCRIBERS,
        label: 'Newsletter',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
    ],
  },
  {
    path: ROUTES.TESTIMONIALS,
    label: 'Social Proof',
    icon: 'social',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    children: [
      {
        path: ROUTES.TESTIMONIALS,
        label: 'Testimonials',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        path: ROUTES.PARTNERS,
        label: 'Partners',
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
    ],
  },
  {
    path: ROUTES.MEDIA,
    label: 'Media Library',
    icon: 'media',
    roles: ['SUPER_ADMIN'], // Only Super Admin
  },
  {
    path: ROUTES.ACTIVITY_LOGS,
    label: 'Activity Logs',
    icon: 'logs',
    roles: ['SUPER_ADMIN'], // Only Super Admin
  },
  {
    path: ROUTES.SETTINGS,
    label: 'Settings',
    icon: 'settings',
    roles: ['SUPER_ADMIN'], // Only Super Admin
    children: [
      {
        path: ROUTES.SETTINGS_COMPANY,
        label: 'Company Info',
        roles: ['SUPER_ADMIN'],
      },
      {
        path: ROUTES.SETTINGS_SYSTEM,
        label: 'System Settings',
        roles: ['SUPER_ADMIN'],
      },
    ],
  },
];

// Permission Helper Functions
export const hasPermission = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (userRole: UserRole, route: RouteConfig): boolean => {
  return hasPermission(userRole, route.roles);
};

export const getAccessibleRoutes = (userRole: UserRole): RouteConfig[] => {
  return SIDEBAR_MENU.filter(route => canAccessRoute(userRole, route));
};
