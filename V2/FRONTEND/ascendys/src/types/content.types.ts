/**
 * Content Types for publishable content
 */

import type { User } from './auth.types';

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
