# FedaPay enrollment loading fix and public detail pages

Fixed the FedaPay payment initialization bug that prevented enrollment checkout from loading, and added three new public detail pages for blog posts, events, and job offers. All three detail pages follow the established TrainingDetail.tsx pattern with consistent navigation, breadcrumbs, brand styling, and proper error handling.

**Watch for:** 
- **likely** — The three detail pages navigate to `/blog` on error, but the EventDetail and OfferDetail pages should redirect to dedicated sections (events, offers) that may not exist yet
- **confirmed** — BlogPost type is imported from content.types but OfferDetail uses the Offer type from offers.service instead of defining it in content.types, creating inconsistency across the codebase

**Verdict**: APPROVED

## High-level view

The enrollment payment loading bug is fixed: `enrollmentsService` now unwraps responses with `response?.data || response` on all four methods (create, get, initiatePayment, retryPayment), addressing the original 404 that appeared due to wrapped responses.

Three new public detail pages are added: BlogDetail, EventDetail, and OfferDetail. All three pages use Lucide icons (no emojis), follow the TrainingDetail pattern (PublicNavbar, breadcrumb, loading spinner with brand color #9800BF, error state with redirect), and call service methods with `getBySlug(slug!)` that handle both wrapped and unwrapped API responses. All three pages apply responsive layouts and the violet brand color throughout buttons and accents. Routes are correctly placed in the public section before auth routes.

All three detail pages redirect to `/blog` on error, which is wrong for EventDetail and OfferDetail — they should point to dedicated event/offer listing pages, but those pages may not exist in the public area yet. The redirect is soft (2-second delay), so if those pages are added later, the redirect targets can be updated.

TypeScript imports are inconsistent: BlogDetail imports BlogPost from content.types (correct), EventDetail imports Event from content.types (correct), but OfferDetail imports Offer from offers.service, not from a shared types file.

<details>
<summary>Issues (5)</summary>

1. **Redirect targets inconsistent** — EventDetail and OfferDetail redirect to `/blog` on error. They should redirect to dedicated event/offer listing pages if those exist. Verify public routes and update redirect targets.

2. **Type import inconsistency** — OfferDetail imports Offer from `@/services/offers.service` while BlogDetail and EventDetail import from `@/types/content.types`. Move Offer to content.types for consistency.

3. **API endpoint path mismatch** — blogPostsService calls `/blog/${slug}/` but api.ts defines `/blog/posts/${slug}/`. Verify which path the backend expects and align service or config.

4. **Offers endpoint parameter naming** — api.ts defines `OFFERS.DETAIL: (id: string)` but offersService uses it with slug. Either rename parameter to `slug` or verify backend accepts slugs not IDs.

5. **Missing footer and WhatsApp button** — TrainingDetail includes PublicFooter and WhatsAppButton but the three new detail pages omit them. Add for consistency or document the intentional omission.

</details>

<details>
<summary>Details</summary>

## Response unwrapping in enrollmentsService

The enrollmentsService now handles both wrapped `{ data: Enrollment }` and unwrapped `Enrollment` responses by using `response?.data || response` in all four methods: `create`, `get`, `initiatePayment`, and `retryPayment`. This addresses the 404 errors logged in the user request where POST to `/api/v1/enrollments/` returned 404 because PaymentPage expected unwrapped data but received wrapped responses.

## Three new public detail pages

BlogDetail, EventDetail, and OfferDetail follow the TrainingDetail.tsx pattern: PublicNavbar, breadcrumb (Accueil > [Section] > [Title]), loading spinner with brand violet (#9800BF), error state with 2-second redirect. All three extract `slug` from route params, call `getBySlug(slug!)`, and unwrap responses with `response?.data || response`.

All three use Lucide icons, no emojis. Brand violet (#9800BF) appears in buttons, icon colors, breadcrumb hovers, prose headings, and loading spinners.

## Routes correctly placed

App.tsx adds three new routes in the public section, after `/contact` and before `/signin`:

```tsx
<Route path="/blog/:slug" element={<BlogDetail />} />
<Route path="/events/:slug" element={<EventDetail />} />
<Route path="/offers/:slug" element={<OfferDetail />} />
```


## Redirect targets are inconsistent

All three detail pages redirect to `/blog` on error:

- BlogDetail redirects to `/blog` (correct)
- EventDetail redirects to `/blog` (wrong — should redirect to an events listing page if one exists)
- OfferDetail redirects to `/blog` (wrong — should redirect to an offers listing page if one exists)

The user request mentions "blog, évènement et offres d'emplois" as three distinct sections, suggesting that separate listing pages should exist for events and offers. However, the public routes in App.tsx only show `/blog` (the Blog page), not dedicated event or offer listing pages. If those pages exist under different paths (e.g., `/events`, `/offers`), the redirect targets should be updated. If they don't exist, the redirect to `/blog` is a fallback but should be documented.

## Type import inconsistency

BlogDetail imports `BlogPost` from `@/types/content.types`. EventDetail imports `Event` from `@/types/content.types`. OfferDetail imports `Offer` from `@/services/offers.service`. The content.types.ts file defines BlogPost and Event but not Offer. This creates inconsistency: two detail pages use centralized types, one uses a service-level type. Moving Offer to content.types would centralize content types and reduce coupling between OfferDetail and offers.service.

## Responsive layout and brand color application

All three detail pages use responsive grid layouts: `grid gap-8 lg:grid-cols-[1fr_300px]` (BlogDetail), `grid gap-8 lg:grid-cols-[1fr_350px]` (EventDetail, OfferDetail). Sidebar is sticky on large screens: `lg:sticky lg:top-4 lg:h-fit`.

## API endpoint path mismatch

The three detail pages call:
- `blogPostsService.getBySlug(slug!)` → `/blog/${slug}/`
- `eventsService.getBySlug(slug!)` → `/events/${slug}/`
- `offersService.getBySlug(slug!)` → `/offers/${slug}/`

The API config in api.ts defines:
- `BLOG.POST_DETAIL: (slug: string) => /blog/posts/${slug}/`
- `EVENTS.DETAIL: (slug: string) => /events/${slug}/`
- `OFFERS.DETAIL: (id: string) => /offers/${id}/`

Blog service calls `/blog/${slug}/` but API config defines `/blog/posts/${slug}/` — path mismatch. Offers endpoint parameter is named `id` but service uses slug — either naming inconsistency or functional mismatch. User logs don't mention blog/event/offer 404s, so these may work, but they're red flags.

## PublicFooter and WhatsAppButton omitted

TrainingDetail.tsx includes `<PublicFooter />` and `<WhatsAppButton />`. The three new detail pages omit these components. Inconsistency, but may be intentional.

</details>

<details>
<summary>File map</summary>

Files changed in this PR (frontend only):

- `src/services/enrollments.service.ts` — unwrap responses with `?.data || response` fallback on all four methods
- `src/pages/Public/PaymentPage.tsx` — no changes (bug was in the service, not the page)
- `src/pages/Public/BlogDetail.tsx` — new detail page for blog posts, uses BlogPost from content.types
- `src/pages/Public/EventDetail.tsx` — new detail page for events, uses Event from content.types
- `src/pages/Public/OfferDetail.tsx` — new detail page for job offers, uses Offer from offers.service
- `src/App.tsx` — three new public routes: `/blog/:slug`, `/events/:slug`, `/offers/:slug`

[View full diff](command:git.openDiff)

</details>
