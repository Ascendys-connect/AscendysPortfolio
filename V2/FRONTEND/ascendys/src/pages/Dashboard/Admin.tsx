import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import type { DashboardStats } from "@/types/api.types";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.get<DashboardStats>("/dashboard/stats/");
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Tableau de bord | Ascendys Connect"
        description="Gestion de contenu Ascendys Connect"
      />
      
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Bienvenue, {user?.first_name}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Gérez vos contenus et publications
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {/* Formations */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Formations
              </p>
              <h3 className="mt-2 text-title-xl font-semibold text-gray-800 dark:text-white">
                {stats?.trainings_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-success-50 p-3 dark:bg-success-950/30">
              <svg
                className="size-6 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/trainings"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Voir tout →
            </a>
          </div>
        </div>

        {/* Articles de blog */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Articles
              </p>
              <h3 className="mt-2 text-title-xl font-semibold text-gray-800 dark:text-white">
                {stats?.blog_posts_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-orange-50 p-3 dark:bg-orange-950/30">
              <svg
                className="size-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/blog"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Voir tout →
            </a>
          </div>
        </div>

        {/* Événements */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Événements
              </p>
              <h3 className="mt-2 text-title-xl font-semibold text-gray-800 dark:text-white">
                {stats?.events_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-theme-purple-50 p-3 dark:bg-theme-purple-950/30">
              <svg
                className="size-6 text-theme-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="/events"
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              Voir tout →
            </a>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-6">
        <h3 className="mb-4 text-title-md font-semibold text-gray-800 dark:text-white">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <a
            href="/trainings/new"
            className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="rounded-full bg-success-50 p-3 dark:bg-success-950/30">
              <svg
                className="size-6 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Nouvelle formation
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Créer une formation
              </p>
            </div>
          </a>

          <a
            href="/blog/new"
            className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="rounded-full bg-orange-50 p-3 dark:bg-orange-950/30">
              <svg
                className="size-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Nouvel article
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rédiger un article
              </p>
            </div>
          </a>

          <a
            href="/events/new"
            className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="rounded-full bg-theme-purple-50 p-3 dark:bg-theme-purple-950/30">
              <svg
                className="size-6 text-theme-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Nouvel événement
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Créer un événement
              </p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
