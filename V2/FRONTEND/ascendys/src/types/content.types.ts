/**
 * Content Types for publishable content
 */


export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface PublishableContent {
  status: ContentStatus;
  published_at: string | null;
  is_featured: boolean;
  created_by: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  } | null;
}

export interface ContentFilters {
  status?: ContentStatus;
  created_by?: string;
  is_featured?: boolean;
  search?: string;
}

export const ContentStatusLabels: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: 'Brouillon',
  [ContentStatus.PUBLISHED]: 'Publié',
  [ContentStatus.ARCHIVED]: 'Archivé',
};

export const ContentStatusColors: Record<ContentStatus, string> = {
  [ContentStatus.DRAFT]: 'gray',
  [ContentStatus.PUBLISHED]: 'success',
  [ContentStatus.ARCHIVED]: 'warning',
};

// Training Types
export interface TrainingCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  is_active: boolean;
  trainings_count: number;
  created_at: string;
  updated_at: string;
}

export interface Training extends PublishableContent {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  category: number;
  category_name: string;
  category_slug?: string;
  image: string;
  banner?: string | null;
  objectives: string[];
  prerequisites: string[];
  target_audience: string;
  syllabus: string[];
  duration: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  level_display?: string;
  price: string;
  currency: string;
  start_date: string;
  end_date: string;
  location: string;
  training_mode: 'ONLINE' | 'ONSITE' | 'HYBRID';
  mode_display?: string;
  instructor?: number | null;
  instructor_name?: string | null;
  capacity: number;
  certification: boolean;
  status: ContentStatus;
  status_display?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

// Event Types
export enum EventType {
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  WEBINAR = 'WEBINAR',
  TRAINING = 'TRAINING',
  SALON = 'SALON',
  OTHER = 'OTHER',
}

export const EventTypeLabels: Record<EventType, string> = {
  [EventType.CONFERENCE]: 'Conférence',
  [EventType.WORKSHOP]: 'Atelier',
  [EventType.WEBINAR]: 'Webinaire',
  [EventType.TRAINING]: 'Formation',
  [EventType.SALON]: 'Salon',
  [EventType.OTHER]: 'Autre',
};

export interface Event extends PublishableContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string | null;
  location: string;
  event_type: EventType;
  type_display?: string;
  start_datetime: string;
  end_datetime: string;
  registration_url?: string;
  capacity: number;
  status: ContentStatus;
  status_display?: string;
  is_upcoming?: boolean;
  is_ongoing?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  description: string;
  image?: File | string | null;
  location: string;
  event_type: EventType | string;
  start_datetime: string;
  end_datetime: string;
  registration_url?: string;
  capacity: number;
  status?: ContentStatus | string;
  is_featured: boolean;
}

// Blog Types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  video: string | null;
  category: number | null;
  category_name?: string;
  category_slug?: string;
  author_name?: string;
  tags: Tag[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  status_display?: string;
  is_featured: boolean;
  reading_time: number;
  views_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  cover_image?: File | null;
  video?: File | null;
  category: number | null;
  tags_ids: number[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  is_featured: boolean;
}

// Testimonial Types
export interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  company: string;
  avatar: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  company?: string;
  avatar?: File | null;
  content: string;
  rating: number;
  is_featured?: boolean;
  is_published?: boolean;
  order?: number;
}

// Partner Types
export interface Partner {
  id: string | number;
  name: string;
  logo: string;
  website: string;
  description: string;
  is_featured: boolean;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PartnerFormData {
  name: string;
  logo?: File | null;
  website?: string;
  description?: string;
  is_featured?: boolean;
  is_active?: boolean;
  order?: number;
}

// ── Gallery (Médiathèque) Types ──────────────────────────────────────────────

export type GalleryType = 'PHOTOS' | 'VIDEO';

export interface Gallery {
  id: string;
  title: string;
  description: string;
  gallery_type: GalleryType;
  cover_image_url: string | null;
  photo_1_url?: string | null;
  photo_2_url?: string | null;
  photo_3_url?: string | null;
  photo_4_url?: string | null;
  photo_5_url?: string | null;
  video_url?: string | null;
  photos_count?: number;
  is_published: boolean;
  created_by_name?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface GalleryFormData {
  title: string;
  description: string;
  gallery_type: GalleryType;
  photos?: File[];          // up to 5, only when gallery_type === 'PHOTOS'
  video?: File | null;      // only when gallery_type === 'VIDEO'
  cover_image?: File | null;
  is_published?: boolean;
}

// Legacy - kept for backward compat
export interface MediaFile {
  id: string;
  title: string;
  description?: string;
  file: string;
  file_url?: string;
  media_type: string;
  file_type?: string;
  file_name: string;
  file_size: number;
  file_extension: string;
  folder?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

// ── Company Info Types ───────────────────────────────────────────────────────

export interface CompanyInfo {
  id?: number;
  name: string;
  slogan?: string;
  tagline?: string;
  short_description?: string;
  description?: string;
  full_description?: string;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  favicon_url?: string | null;
  email: string;
  phone?: string;
  phones?: string[];
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  website: string;
  social_links?: Record<string, string>;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  whatsapp_number?: string;
  founded_year?: number | null;
  mission?: string;
  vision?: string;
  values?: string[];
  business_hours?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

// ── Activity Log Types ────────────────────────────────────────────────────────

export type ActivityLogAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'OTHER';

export interface ActivityLog {
  id: string;
  user: number | null;
  user_name: string;
  user_email: string | null;
  user_avatar: string | null;
  action: ActivityLogAction;
  action_display: string;
  description: string;
  content_type: number | null;
  content_type_name: string | null;
  object_id: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
