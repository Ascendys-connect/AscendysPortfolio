import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import type { DashboardStats } from "@/types/api.types";

export default function SuperAdminDashboard() {
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
        title="Tableau de bord Super Admin | Ascendys Connect"
        description="Vue d'ensemble complète de la plateforme Ascendys Connect"
      />
      
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Bienvenue, {user?.first_name}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Voici un aperçu complet de votre plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {/* Utilisateurs */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Utilisateurs
              </p>
              <h3 className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-white">
                {stats?.users_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-brand-50 p-1.5 dark:bg-brand-950/30">
              <svg
                className="size-4 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-success-500">+12%</span>
            <span className="ms-1.5 text-gray-500 dark:text-gray-400">
              ce mois
            </span>
          </div>
        </div>

        {/* Formations */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Formations
              </p>
              <h3 className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-white">
                {stats?.trainings_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-success-50 p-1.5 dark:bg-success-950/30">
              <svg
                className="size-4 text-success-500"
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
          <div className="mt-2 flex items-center text-xs">
            <span className="text-success-500">+8%</span>
            <span className="ms-1.5 text-gray-500 dark:text-gray-400">
              ce mois
            </span>
          </div>
        </div>

        {/* Articles de blog */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Articles
              </p>
              <h3 className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-white">
                {stats?.blog_posts_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-orange-50 p-1.5 dark:bg-orange-950/30">
              <svg
                className="size-4 text-orange-500"
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
          <div className="mt-2 flex items-center text-xs">
            <span className="text-success-500">+5%</span>
            <span className="ms-1.5 text-gray-500 dark:text-gray-400">
              ce mois
            </span>
          </div>
        </div>

        {/* Événements */}
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Événements
              </p>
              <h3 className="mt-0.5 text-xl font-semibold text-gray-800 dark:text-white">
                {stats?.events_count || 0}
              </h3>
            </div>
            <div className="rounded-full bg-theme-purple-50 p-1.5 dark:bg-theme-purple-950/30">
              <svg
                className="size-4 text-theme-purple-500"
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
          <div className="mt-2 flex items-center text-xs">
            <span className="text-success-500">+15%</span>
            <span className="ms-1.5 text-gray-500 dark:text-gray-400">
              ce mois
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="mt-6">
        {/* Statistiques système */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-title-md font-semibold text-gray-800 dark:text-white">
            Statistiques système
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Fichiers média
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats?.media_files_count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Messages de contact
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats?.contact_messages_count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Témoignages
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats?.testimonials_count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Partenaires
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats?.partners_count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Abonnés newsletter
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stats?.newsletter_subscribers_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="mt-6">
        <h3 className="mb-4 text-title-md font-semibold text-gray-800 dark:text-white">
          Accès rapides
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <a
            href="/users"
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="flex items-center gap-3">
              <svg
                className="size-8 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Utilisateurs
              </span>
            </div>
          </a>
          <a
            href="/trainings"
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="flex items-center gap-3">
              <svg
                className="size-8 text-success-500"
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
              <span className="text-sm font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Formations
              </span>
            </div>
          </a>
          <a
            href="/blog"
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="flex items-center gap-3">
              <svg
                className="size-8 text-orange-500"
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
              <span className="text-sm font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Blog
              </span>
            </div>
          </a>
          <a
            href="/media"
            className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="flex items-center gap-3">
              <svg
                className="size-8 text-theme-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-800 group-hover:text-brand-500 dark:text-white">
                Médias
              </span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
