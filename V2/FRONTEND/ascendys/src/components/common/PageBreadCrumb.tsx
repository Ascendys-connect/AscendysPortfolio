import { Link, useLocation } from "react-router";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
}

const SECTION_MAPPINGS: Record<string, { label: string; path: string }> = {
  testimonials: { label: "Témoignages", path: "/admin/testimonials" },
  partners: { label: "Partenaires", path: "/admin/partners" },
  offers: { label: "Offres d'emploi", path: "/admin/offers" },
  services: { label: "Services", path: "/admin/services" },
  trainings: { label: "Formations", path: "/admin/trainings" },
  events: { label: "Événements", path: "/admin/events" },
  blog: { label: "Blog", path: "/admin/blog/posts" },
  users: { label: "Utilisateurs", path: "/users" },
  galleries: { label: "Médiathèques", path: "/admin/galleries" },
  system: { label: "Système", path: "/admin/system/settings" },
};

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  const location = useLocation();

  // If explicit items provided, use them; otherwise auto-detect intermediate segments
  let breadcrumbItems: BreadcrumbItem[] = [];

  if (items && items.length > 0) {
    breadcrumbItems = items;
  } else {
    const pathParts = location.pathname.split("/").filter(Boolean);
    // Find if any section matches
    for (const part of pathParts) {
      if (SECTION_MAPPINGS[part]) {
        const mapping = SECTION_MAPPINGS[part];
        // If current page is not this section list page itself, add it as intermediate link
        if (location.pathname !== mapping.path) {
          breadcrumbItems.push(mapping);
        }
        break;
      }
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>
      <nav aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {/* Home / Dashboard link */}
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
              to="/dashboard"
            >
              <svg
                className="size-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Separator after Dashboard */}
          <li aria-hidden="true" className="text-gray-400 dark:text-gray-600">
            <svg
              className="size-4 stroke-current rtl:rotate-180"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>

          {/* Intermediate links (e.g. Partenaires, Témoignages) */}
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-gray-500 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  {item.label}
                </span>
              )}
              <svg
                aria-hidden="true"
                className="size-4 text-gray-400 stroke-current rtl:rotate-180 dark:text-gray-600"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          ))}

          {/* Current page (active) */}
          <li
            className="font-medium text-gray-800 dark:text-white/90"
            aria-current="page"
          >
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
