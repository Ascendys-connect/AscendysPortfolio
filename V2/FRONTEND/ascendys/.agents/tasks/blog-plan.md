# Implementation Plan: Blog Page Dynamic Content

## Context

Transform the Blog public page to display 3 separate sections (Blog Articles, Job Offers, Events) with real data from the backend API instead of static content. The current page has hardcoded demo data in `blogPosts` array. The design (hero section, search bar, category filters, and card layouts) must be preserved with the brand colors (#9800BF violet, #FFC000 gold) and Tailwind CSS styling.

## Project Information

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Build command**: `npm run build`
- **Dev command**: `npm run dev`
- **API Service**: `useApi` hook with auto-unwrapping of both DRF paginated `{ results: [...] }` and custom `{ success, message, data: [...] }` responses
- **Date formatting pattern**: `toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })`
- **Media URL helper pattern**: Check if path starts with http or /, otherwise prepend `http://127.0.0.1:8000/`

## Backend Endpoints Confirmed

1. **Blog**: `GET /api/v1/blog/?page_size=6` → DRF paginated `{ count, next, previous, results: [...] }`
2. **Job Offers**: `GET /api/v1/offers/?page_size=6` → DRF paginated `{ count, next, previous, results: [...] }`
3. **Events**: `GET /api/v1/events/?page_size=6` → Custom `{ success, message, data: [...] }`

All 3 endpoints are handled automatically by `useApi<T[]>('/endpoint', { defaultValue: [] })`.

## Implementation Steps

- [ ] 1. **Create TypeScript types for the 3 public entities**
      Add `BlogPostPublic`, `JobOfferPublic`, and `EventPublic` interfaces to `src/types/api.types.ts`. These are simplified public-facing versions (not full admin types). Include all fields returned by the endpoints: `id`, `title`, `slug`, `excerpt/short_description`, `cover_image/image`, `category_name/type_display`, `author_name`, `tags`, `reading_time`, `views_count`, `published_at/start_datetime/end_datetime`, `created_at`, `status`, `is_featured`, `location` (events), `event_type` (events), `type` (offers).
      Files: `src/types/api.types.ts`
      Verify: TypeScript compiles with `npm run build` (no type errors)

- [ ] 2. **Create BlogArticlesSection component**
      Create `src/components/public/BlogArticlesSection.tsx` following the pattern from `TrainingsSection.tsx`. Use `useApi<BlogPostPublic[]>("/api/v1/blog/?page_size=6", { defaultValue: [] })`. Display loading skeleton (3 pulse cards), error state with "Réessayer" button, and empty state message. Format `published_at` dates with `toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })`. Use `getMediaUrl` helper for `cover_image`. Display: category badge (brand-100 bg, brand-600 text), title, excerpt, reading time, publication date, author name, and "Lire plus" link. Grid: `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`. Preserve hover effects (shadow-xl, scale-110 on image).
      Files: `src/components/public/BlogArticlesSection.tsx`
      Verify: `npm run build` succeeds, component renders with skeleton loaders

- [ ] 3. **Create JobOffersSection component**
      Create `src/components/public/JobOffersSection.tsx` following the same pattern. Use `useApi<JobOfferPublic[]>("/api/v1/offers/?page_size=6", { defaultValue: [] })`. Display loading skeleton, error with retry, empty state. Format `start_date` and `end_date` dates (both optional). Use `getMediaUrl` helper for `image`. Display: type badge (RECRUITMENT/INTERNSHIP with type_display), title, short_description, start/end dates, location if available, status badge, and "En savoir plus" link. Use gold-500 accent color for "INTERNSHIP" badges, brand-600 for "RECRUITMENT". Grid: `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`.
      Files: `src/components/public/JobOffersSection.tsx`
      Verify: `npm run build` succeeds, component renders with skeleton loaders

- [ ] 4. **Create EventsSection component**
      Create `src/components/public/EventsSection.tsx` following the same pattern. Use `useApi<EventPublic[]>("/api/v1/events/?page_size=6", { defaultValue: [] })`. Display loading skeleton, error with retry, empty state. Format `start_datetime` and `end_datetime` with both date and time: `toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })`. Use `getMediaUrl` helper for `image`. Display: event type badge (type_display), title, truncated description, start datetime, location, capacity info if relevant, and "S'inscrire" or "Voir détails" link. Use calendar icon from lucide-react or inline SVG. Grid: `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`.
      Files: `src/components/public/EventsSection.tsx`
      Verify: `npm run build` succeeds, component renders with skeleton loaders

- [ ] 5. **Create getMediaUrl utility helper**
      Create `src/utils/media.ts` with `export const getMediaUrl = (path: string | null | undefined, fallback?: string): string` that returns fallback or empty string if path is null, returns path as-is if it starts with "http" or "/", otherwise prepends `http://127.0.0.1:8000/`. This centralizes the media URL logic used across ServicesSection and TrainingsSection.
      Files: `src/utils/media.ts`
      Verify: `npm run build` succeeds, no TypeScript errors

- [ ] 6. **Refactor Blog.tsx to use the 3 new sections**
      Remove the static `blogPosts` array and `categories` array. Remove the search bar, category filter buttons, and the old blog grid. Keep the Hero section (gradient header with title "Notre Blog", subtitle, background image). Replace the blog grid with 3 sections: `<BlogArticlesSection />`, `<JobOffersSection />`, and `<EventsSection />`. Add section dividers (light gray border-t or bg-gray-50 backgrounds to distinguish sections). Update the page subtitle to mention "Articles, Offres d'emploi, et Événements". Each section should have its own heading: "Articles de blog", "Offres d'emploi", "Événements à venir". Preserve dark mode classes, responsive padding, PublicNavbar, PublicFooter, WhatsAppButton.
      Files: `src/pages/Public/Blog.tsx`
      Verify: `npm run build` succeeds, page loads without console errors in browser

- [ ] 7. **Update existing components to use the new getMediaUrl utility**
      Refactor `src/components/public/ServicesSection.tsx` and `src/components/public/TrainingsSection.tsx` to import and use the centralized `getMediaUrl` from `src/utils/media.ts` instead of their inline helpers. This ensures consistency and DRY principle.
      Files: `src/components/public/ServicesSection.tsx`, `src/components/public/TrainingsSection.tsx`
      Verify: `npm run build` succeeds, homepage sections still display images correctly

- [ ] 8. **Test all 3 sections with real API data**
      Start the dev server with `npm run dev`. Navigate to `/blog` in the browser. Verify that Blog Articles, Job Offers, and Events sections all load data from the API. Check loading states (skeleton loaders), error states (click "Réessayer" button if endpoints fail), and empty states (if API returns empty arrays). Verify date formatting is consistent. Verify images display correctly with `getMediaUrl`. Check responsive layout on mobile, tablet, desktop. Test dark mode toggle. Check browser console for errors.
      Files: None (manual testing in browser)
      Verify: All 3 sections display real data, no console errors, responsive design works, dark mode works

## Notes

- **No search or filter functionality**: The original Blog page had search and category filters, but the new design has 3 separate sections pulling from different endpoints. Search/filter can be added in a future iteration if needed per section.
- **Pagination**: The plan uses `page_size=6` to limit results. Pagination controls (Load More, page numbers) are not included in this iteration. Can be added later if required.
- **Link destinations**: Blog article links use `/blog/${slug}`, job offer links use `/careers/${slug}` or `/contact`, event links use `/events/${slug}` or registration URLs. Adjust these based on actual routes (the current routing in App.tsx doesn't define detail pages for blog/offers/events yet).
- **Date formatting**: French locale `"fr-FR"` is used consistently across the app as seen in existing components.
- **Testing endpoints**: Before implementing, manually test each endpoint in the browser or Postman to confirm response structure matches the documented shapes.

## Design Preservation Checklist

- [x] Brand colors: violet `brand-600 (#9800BF)`, gold `gold-500 (#FFC000)`
- [x] Tailwind CSS with dark mode support
- [x] Plus Jakarta Sans font (inherited from global styles)
- [x] Card hover effects: shadow-xl, image scale-110
- [x] Responsive grid: mobile (1 col), tablet (2 cols), desktop (3 cols)
- [x] Hero section gradient: `from-brand-600 to-brand-800`
- [x] Skeleton loaders: pulse animation on gray-200/gray-700 backgrounds
- [x] Error state: centered message with brand-600 retry button
- [x] Empty state: centered "Aucun contenu" message
