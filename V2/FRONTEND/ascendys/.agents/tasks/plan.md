# Implementation Plan

## Overview
This plan addresses two critical issues:
1. Fix the PaymentPage enrollment loading bug causing "Inscription introuvable" error
2. Create three detail pages for Blog, Events, and Offers following the TrainingDetail pattern

## Root Cause Analysis: PaymentPage Bug

**Problem**: The enrollmentsService.get() method expects the backend to return `{ success, message, data: { enrollment } }` and unwraps it with `response.data!`. However, based on the backend logs showing successful 201/200 responses and comparing with other services (offersService.getBySlug uses `apiService.get<Offer>()` without ApiResponse wrapper), the backend likely returns the enrollment object directly, not wrapped in ApiResponse.

**Evidence**:
- enrollmentsService.get() uses `apiService.get<ApiResponse<Enrollment>>()` then returns `response.data!`
- offersService.getBySlug() uses `apiService.get<Offer>()` directly (no wrapper)
- blogPostsService.getBySlug() uses `apiService.get<BlogPost>()` directly (no wrapper)
- eventsService.getBySlug() uses `apiService.get<Event>()` directly (no wrapper)

The mismatch causes `response.data` to be undefined when the backend returns the enrollment directly, leading to null enrollment and the "Inscription introuvable" message.

## Implementation Steps

- [ ] 1. Fix enrollmentsService.get() to match the actual backend response format.
      Remove the ApiResponse wrapper and return the enrollment directly, consistent with other getBySlug methods.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\services\enrollments.service.ts`
      Verify: Navigate to a payment page URL with a valid enrollment ID and confirm the page loads enrollment details instead of showing "Inscription introuvable". Check browser console for no errors.

- [ ] 2. Create BlogDetail page component following TrainingDetail.tsx pattern.
      Component displays blog post with: cover image hero section, article content with proper typography, category badge, tags list, reading time, author info, related posts section if available, breadcrumb navigation back to blog list.
      Uses useApi hook to fetch from `/blog/{slug}/` endpoint.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Public\BlogDetail.tsx`
      Verify: `npm run build` succeeds with no TypeScript errors. Component renders without console errors.

- [ ] 3. Create EventDetail page component following TrainingDetail.tsx pattern.
      Component displays event with: banner image hero section, event description, location details with icon, event type badge, start/end datetime display, capacity information, registration CTA button (links to registration_url if provided), breadcrumb navigation back to events list.
      Uses useApi hook to fetch from `/events/{slug}/` endpoint.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Public\EventDetail.tsx`
      Verify: `npm run build` succeeds with no TypeScript errors. Component renders without console errors.

- [ ] 4. Create OfferDetail page component following TrainingDetail.tsx pattern.
      Component displays offer with: banner image hero section, offer description, type badge (offer type_display), status badge, start/end dates if applicable, CTA button, breadcrumb navigation back to offers list.
      Uses useApi hook to fetch from `/offers/{slug}/` endpoint.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Public\OfferDetail.tsx`
      Verify: `npm run build` succeeds with no TypeScript errors. Component renders without console errors.

- [ ] 5. Add routes for the three detail pages in App.tsx.
      Add routes in the public pages section (before auth routes):
      - `/blog/:slug` → BlogDetail
      - `/events/:slug` → EventDetail  
      - `/offers/:slug` → OfferDetail
      Place these routes before the fallback NotFound route and after the existing `/trainings/:slug` route.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\App.tsx`
      Verify: `npm run build` succeeds. Check that navigating to each route pattern renders the correct component.

- [ ] 6. Update blog, events, and offers list components to link to detail pages.
      In BlogPostsList component (or public blog list), change "Lire plus" / "Voir les détails" buttons to `<Link to={`/blog/${post.slug}`}>`.
      In EventsList component (or public events list), change "En savoir plus" / "Voir les détails" buttons to `<Link to={`/events/${event.slug}`}>`.
      In OffersList component (or public offers list), change "Voir les détails" buttons to `<Link to={`/offers/${offer.slug}`}>`.
      Files: 
      - `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Public\Blog.tsx` (or wherever blog posts are listed on public site)
      - `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Public\Home.tsx` (if events/offers/blog cards shown on home)
      - Any other components rendering blog/events/offers lists
      Verify: `npm run build` succeeds. Click "Lire plus" / "En savoir plus" / "Voir les détails" buttons and confirm navigation to detail pages with correct slug.

- [ ] 7. Final integration test across all pages.
      Test the complete flow: navigate from Home → Trainings → Training detail → Enroll → Payment page (should load enrollment correctly). Navigate to Blog list → Blog detail. Navigate to Events list → Event detail. Navigate to Offers list → Offer detail. Confirm all pages load without errors and display correct data.
      Files: N/A (integration test)
      Verify: Manual testing in browser. All navigation flows work. No console errors. Payment page loads enrollment details. All detail pages display content correctly.

## Design Decisions

**Decision 1: enrollmentsService response format**
The backend returns enrollment objects directly (not wrapped in ApiResponse), consistent with other entity detail endpoints (offers, blog posts, events). Changed enrollmentsService.get() to use `apiService.get<Enrollment>()` instead of `apiService.get<ApiResponse<Enrollment>>()` and removed the `.data!` unwrapping.

**Decision 2: Detail page layout pattern**
All three detail pages follow the TrainingDetail.tsx pattern:
- Hero section with gradient background and banner/cover image
- Sticky navbar during scroll
- Main content in left column (2/3 width on desktop)
- Sidebar with CTA card (1/3 width on desktop)
- Breadcrumb navigation back to list
- Responsive mobile layout (single column)
- Uses PublicNavbar, PublicFooter, PageMeta, and WhatsAppButton components

**Decision 3: Route placement**
Detail routes placed in public pages section of App.tsx, after existing `/trainings/:slug` route and before fallback NotFound route. This groups all public detail pages together and ensures slug patterns match before wildcard routes.

**Decision 4: Navigation updates**
List components updated to use React Router `<Link>` components instead of `<a>` tags for client-side navigation. Slug-based URLs (`/blog/{slug}`, `/events/{slug}`, `/offers/{slug}`) match backend API patterns.

## Project Context

**Build system**: Vite + TypeScript
**Test framework**: None detected in package.json (no test command)
**Build command**: `npm run build` (runs `tsc -b && vite build`)
**Verification**: Build must succeed with no TypeScript errors. Manual browser testing for functionality.

**Key patterns observed**:
- Services use apiService.get/post/put/delete from api.service.ts
- Detail endpoints follow pattern `/resource/{slug}/`
- Most getBySlug methods return entity directly (not wrapped in ApiResponse)
- useApi hook handles both wrapped and unwrapped responses
- Public pages use PublicNavbar, PublicFooter, PageMeta components
- TrainingDetail.tsx uses gradient hero sections, sticky navbar, sidebar layout
- Responsive design with Tailwind CSS using mobile-first approach

**Relevant files**:
- Services: src/services/enrollments.service.ts, blog.service.ts, events.service.ts, offers.service.ts
- Pages: src/pages/Public/TrainingDetail.tsx (reference pattern), PaymentPage.tsx
- Components: src/components/public/PublicNavbar.tsx, PublicFooter.tsx, src/components/common/PageMeta.tsx
- Types: src/types/enrollment.types.ts, content.types.ts, api.types.ts
- Routing: src/App.tsx
- Hooks: src/hooks/useApi.ts

## Notes

- No test framework configured, so verification relies on TypeScript compilation and manual browser testing
- The enrollmentsService bug is a type mismatch between service expectations and actual backend response format
- All three detail pages need similar structure but with entity-specific content fields
- Ensure all "Lire plus" / "En savoir plus" / "Voir les détails" buttons across the site are updated to link to new detail pages
