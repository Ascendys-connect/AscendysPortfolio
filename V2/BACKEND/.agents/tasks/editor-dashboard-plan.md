# Implementation Plan: Editor Dashboard Fixes

## Overview
Fix the Editor dashboard to display real content statistics for the logged-in editor (filtering by `created_by=request.user`) and replace `<a href>` navigation with React Router `useNavigate` for SPA behavior.

**Backend endpoint exists**: `/api/v1/dashboard/stats/` already provides comprehensive stats but doesn't filter by user role or creator. We need a new endpoint specifically for editors.

**Frontend routes confirmed**:
- Trainings: `/admin/trainings/create`
- Blog: `/admin/blog/posts/create`
- Events: `/admin/events/create`
- Services: `/admin/services/create`

**Status field pattern**: Models use `status` field with choices `DRAFT`, `PUBLISHED`, `ARCHIVED` (from `apps.core.models.StatusMixin`).

---

## Implementation Plan

- [ ] 1. Create a new backend endpoint `/api/v1/dashboard/editor-stats/` to return editor-specific statistics.
      Query trainings, blog posts, events, and services created by the authenticated user (`created_by=request.user`), count by status (DRAFT, PENDING if exists, PUBLISHED), and total. Return JSON: `{ "draft_count": N, "pending_count": N, "published_count": N, "total_count": N }`.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\BACKEND\apps\dashboard\views.py`, `e:\ASCENDYS-CONNECT Portfolio\V2\BACKEND\apps\dashboard\urls.py`
      Verify: Start backend server `python manage.py runserver`, authenticate as EDITOR role, GET `/api/v1/dashboard/editor-stats/` returns correct counts for that user's content.

- [ ] 2. Create a frontend service method to call the editor stats endpoint.
      Add `getEditorStats()` method in a new service file `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\services\dashboard.service.ts` using `apiService.get()` pattern (auth token auto-included).
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\services\dashboard.service.ts` (create)
      Verify: Run `npm run build` in `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys` — no TypeScript errors.

- [ ] 3. Update the Editor dashboard component to fetch and display real stats.
      In `Editor.tsx`, use `useEffect` to call `dashboardService.getEditorStats()` on mount, store in state, and replace `"--"` placeholders with actual counts. Show loading state while fetching. Handle errors with fallback message.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Dashboard\Editor.tsx`
      Verify: `npm run build` passes, manually test in browser: login as EDITOR, dashboard shows real counts or "0" instead of "--".

- [ ] 4. Replace `<a href>` quick action buttons with React Router navigation.
      Import `useNavigate` from `react-router`, call `navigate('/admin/trainings/create')` etc. on button click. Change `<a>` to `<button>` with same classes, add `onClick` handlers. Paths already confirmed in `App.tsx`: `/admin/trainings/create`, `/admin/blog/posts/create`, `/admin/events/create`, `/admin/services/create`.
      Files: `e:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys\src\pages\Dashboard\Editor.tsx`
      Verify: `npm run build` passes, manually test: clicking quick action buttons navigates without page reload (React Router SPA behavior).

- [ ] 5. Run full build and verify integration.
      Build frontend (`npm run build`), start backend (`python manage.py runserver`), login as EDITOR, confirm dashboard stats load, quick actions navigate correctly.
      Files: All modified files
      Verify: Frontend builds without errors, backend returns correct editor-filtered stats, navigation works as SPA (no full reload), console has no errors.

---

## Notes

- **PENDING status**: The README indicates `STATUS_CHOICES` are `DRAFT`, `PUBLISHED`, `ARCHIVED`. The "En attente" (pending) card should count items with `DRAFT` status that are awaiting admin approval (editors create content as DRAFT). Adjust label or logic if needed.
- **Aggregation**: Editor stats aggregate across 4 content types (trainings, blog posts, events, services) filtering by `created_by=request.user`.
- **Permissions**: The existing `IsStaffOrEditorUser` permission in `dashboard/views.py` allows `SUPER_ADMIN`, `ADMIN`, `EDITOR` — reuse it for the new endpoint.
- **Error handling**: If the API call fails, display "Impossible de charger les statistiques" instead of "--".
- **Loading state**: Show a spinner or skeleton while fetching to improve UX.
