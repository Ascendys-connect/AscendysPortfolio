# Public sections and pages now load from API

Frontend sections and pages for services and trainings were hardcoded with static data. This change connects them to the backend API, introducing skeleton loaders and error states while preserving visual appearance. The change also adds a `page_size=6` limit for homepage sections and enrollment modal functionality to training detail pages.

The home page sections now fetch only 6 items and provide "View all" links. Full catalog pages load all published items with filtering. Training detail pages replaced navigation links with enrollment modal triggers at 4 call-to-action locations.

**Watch for:** None — all requirements met. Skeleton loaders, error states, `page_size=6` limits, "View all" buttons, and enrollment modal integration are all in place.

**Verdict**: APPROVED

---

## High-level view

ServicesSection and TrainingsSection correctly add `page_size=6` to their API calls and display up to 6 cards on the homepage. ServicesSection adds a "View all" button linking to `/services`; TrainingsSection already had one. Both use skeleton loaders during fetch and error states with retry buttons.

Services.tsx loads all active services via `/services/?is_active=true` and alternates visual card layouts (purple gradient vs light background) using the index parity pattern from the original. It references `service.features` correctly, not `service.items`.

Trainings.tsx fetches published trainings from `/trainings/?status=PUBLISHED`, removes the local interface definition, imports `Training` from `content.types.ts`, and filters by `training.category_name` (string comparison) instead of `category.id`. Price display uses `formatPrice(training.price, training.currency)` which expects string inputs.

TrainingDetail.tsx switches all four "S'inscrire" CTAs from `<Link to="/contact">` to `<button onClick={() => setIsEnrollModalOpen(true)}>` and renders an `<EnrollmentForm>` modal when the state is true. The endpoint remains `/trainings/${slug}/` with no behavioral changes to loading or error states.

---

<details>
<summary>Issues (0)</summary>

No blocking issues identified. All requirements have been met:
- ServicesSection and TrainingsSection use `page_size=6` and include "View all" buttons
- Services.tsx and Trainings.tsx load from API with proper filtering
- TrainingDetail.tsx enrollment modal integration is complete with verified component
- Skeleton loaders and error states are present throughout
- Type safety is maintained

</details>

---

<details>
<summary>Details</summary>

## API integration in ServicesSection

ServicesSection calls `useApi<Service[]>("/services/?is_active=true&page_size=6", { defaultValue: [] })` to fetch up to 6 active services. The original hardcoded data had an `items` array; the new code uses `service.features` instead, matching the backend schema.

A "View all" button appears at the bottom with the text "Voir tous nos services" linking to `/services`.

## API integration in TrainingsSection

TrainingsSection fetches from `/trainings/?status=PUBLISHED&page_size=6` and filters client-side by category. The `useMemo` hook extracts unique category names and the filter compares `training.category_name?.toLowerCase() === activeCategory` (string comparison, not numeric ID lookup).

Training cards display `formatPrice(training.price, training.currency)`. The duration is displayed via `training.duration` (a string), not computed from `duration_value` and `duration_unit`.

## Full catalog in Services.tsx

Services.tsx loads all services via `/services/?is_active=true` (no `page_size` limit). Every other service gets `lg:order-2` or `lg:order-1` applied to swap content and visual card positions on large screens, preserving the original alternating visual pattern. The visual cards use `i % 2 === 0` to alternate between purple gradient and light gray backgrounds.

## Full catalog in Trainings.tsx

Trainings.tsx fetches `/trainings/?status=PUBLISHED` without a `page_size` parameter, loading all published trainings. The component removes the local `Training` interface definition and imports `Training` from `@/types/content.types`.

Category filtering uses `training.category_name?.toLowerCase() === selectedCategory` instead of `training.category.id === selectedCategory` (string comparison, not numeric).

## Enrollment modal in TrainingDetail

TrainingDetail replaces four "S'inscrire" CTAs that previously linked to `/contact` with buttons that trigger `onClick={() => setIsEnrollModalOpen(true)}`:

1. Hero section: large yellow button "S'inscrire maintenant"
2. Sticky mini CTA: smaller brand-colored button in the top bar on scroll
3. Sidebar pricing card: primary CTA inside the pricing box
4. Bottom CTA section: large yellow button before the footer

When `isEnrollModalOpen` is true, a fixed overlay modal renders with `<EnrollmentForm trainingId={training.id} trainingTitle={training.title} />`. The component exists at `@/components/trainings/EnrollmentForm` and accepts optional `trainingId?: string` and `trainingTitle?: string` props, matching the usage.

## TypeScript compliance

The `Training` type defines `price: string` and `currency: string`, so `formatPrice(training.price, training.currency)` should not cause type errors. The `Service` type includes `features?: string[]`, so `(service.features || [])` is type-safe.

</details>

---

## File map

<details>
<summary>5 files changed</summary>

- **src/components/public/ServicesSection.tsx** — Fetches services from API with `page_size=6`, adds skeleton loader, error state, and "View all" button
- **src/components/public/TrainingsSection.tsx** — Fetches trainings from API with `page_size=6`, adds skeleton loader and error state, already had "View all" button
- **src/pages/Public/Services.tsx** — Loads all services from API, replaces static data, preserves alternating layout pattern, uses `service.features`
- **src/pages/Public/Trainings.tsx** — Loads all published trainings, removes local interface, filters by `category_name` string, uses `formatPrice` for price display
- **src/pages/Public/TrainingDetail.tsx** — Replaces 4 contact links with enrollment modal triggers, adds `EnrollmentForm` modal component

</details>
