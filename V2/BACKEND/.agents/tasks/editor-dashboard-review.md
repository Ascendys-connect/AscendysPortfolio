# Editor dashboard with API-driven statistics and navigation

Added real statistics to the Editor dashboard page, replacing hardcoded placeholder values. Statistics are fetched from a new backend endpoint that aggregates content counts (trainings, blog posts, events, services) by status for the authenticated editor. Quick action buttons now use React Router navigation instead of anchor tags.

Watch for: Navigation routes are hardcoded strings (confirmed).

**Verdict**: APPROVED

## High-level view

The backend filters all four content types by `created_by=user` (or `author=user` for BlogPost) and aggregates draft/published/total counts. The dashboard service sends requests through apiService, which attaches the auth token from localStorage. The component shows skeleton loaders during fetch and an error banner with retry button on failure. Navigation buttons call `navigate()` with hardcoded admin panel route strings.

<details>
<summary>Issues (1)</summary>

1. **Hardcoded navigation routes** — Quick action buttons use string literals like `/admin/trainings/create`. If routes change, these break silently. Consider extracting to a route constants file or using React Router's route object API.

</details>

<details>
<summary>Details</summary>

## Backend aggregation across content types

The `editor_stats` view queries four models (Training, BlogPost, Event, Service) and filters each by the request user's authorship. Training, Event, and Service use `created_by=user`; BlogPost uses `author=user`. Each queryset filters out soft-deleted records with `is_deleted=False` and counts records by status (DRAFT, PUBLISHED). The counts are summed across all content types and returned as `draft_count`, `published_count`, `total_count`.

## Navigation implementation

Quick action buttons changed from `<a href="/trainings/create">` to `<button onClick={() => navigate('/admin/trainings/create')}>`. This prevents full-page reloads and keeps the SPA shell intact. The routes are hardcoded strings. If the routes change, the strings will break silently (no type safety from React Router).

</details>

<details>
<summary>File map</summary>

- `V2/FRONTEND/ascendys/src/pages/Dashboard/Editor.tsx` — added state management, API fetch, loading skeletons, error banner with retry, and replaced anchor tags with navigate() calls
- `V2/FRONTEND/ascendys/src/services/dashboard.service.ts` — new file defining EditorStats interface and getEditorStats method
- `V2/BACKEND/apps/dashboard/views.py` — added editor_stats view with IsStaffOrEditorUser permission, filters by created_by/author, aggregates counts
- `V2/BACKEND/apps/dashboard/urls.py` — registered editor-stats/ endpoint

Full diff: `git diff 83aff33..HEAD` (commits 0dcd421, d3e24e0)

</details>
