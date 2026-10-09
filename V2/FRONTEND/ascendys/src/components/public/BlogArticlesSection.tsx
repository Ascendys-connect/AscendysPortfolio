import { Link } from "react-router";
import { Newspaper } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import type { BlogPost } from "@/types/content.types";

export default function BlogArticlesSection() {
  const { data, isLoading, error } = useApi<BlogPost[]>(
    "/blog/?status=PUBLISHED&page_size=6",
    { defaultValue: [] }
  );

  // Helper for media URL
  const getMediaUrl = (path: string | null | undefined, fallback: string) => {
    if (!path) return fallback;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `http://127.0.0.1:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Newspaper className="size-8 text-brand-600 dark:text-brand-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Articles & Actualités
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Découvrez nos derniers articles sur la formation, la technologie et le digital
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="aspect-[16/9] animate-pulse bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Impossible de charger les articles
            </p>
          </div>
        )}

        {/* Blog Articles Grid */}
        {!isLoading && !error && data.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-950"
              >
                {/* Image or Video Thumbnail */}
                <div className="aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-800">
                  {post.video ? (
                    <div className="relative size-full">
                      <img
                        src={getMediaUrl(
                          post.cover_image,
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop"
                        )}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg
                          className="size-16 text-white opacity-80"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getMediaUrl(
                        post.cover_image,
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop"
                      )}
                      alt={post.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category & Read Time */}
                  <div className="mb-3 flex items-center gap-3 text-sm">
                    {post.category_name && (
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-950/30 dark:text-brand-400">
                        {post.category_name}
                      </span>
                    )}
                    <span className="text-gray-500 dark:text-gray-400">
                      {post.reading_time} min
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(post.published_at)}
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Lire plus
                      <svg
                        className="size-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && data.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Aucun article publié pour le moment
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
