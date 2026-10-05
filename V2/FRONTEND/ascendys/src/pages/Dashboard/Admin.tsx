import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import type { DashboardStats, GrowthMetric } from "@/types/api.types";
import { Link } from "react-router";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get<DashboardStats>("/dashboard/stats/");
        const apiData = (response as any)?.data || response;
        setStats(apiData);
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

  const GrowthBadge = ({ metric }: { metric?: Partial<GrowthMetric> }) => {
    const formatted = metric?.growth_formatted || "0%";
    const direction = metric?.growth_direction || "neutral";

    if (direction === "up") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-600 dark:text-success-400">
          ↑ {formatted}
        </span>
      );
    } else if (direction === "down") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-error-600 dark:text-error-400">
          ↓ {formatted}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
          — {formatted}
        </span>
      );
    }
  };

  return (
    <>
      <PageMeta
        title="Tableau de bord Admin | Ascendys Connect"
        description="Gestion de contenu et métriques en temps réel Ascendys Connect"
      />
      
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenue, {user?.first_name || "Administrateur"} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez vos contenus, publications et suivez l'engagement
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {/* Formations */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Formations
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.trainings?.total ?? stats?.trainings_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.trainings} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-950/40 dark:text-success-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Publiées: <strong className="text-gray-900 dark:text-white">{stats?.trainings?.published ?? 0}</strong></span>
              <span>Brouillons: <strong className="text-gray-900 dark:text-white">{stats?.trainings?.draft ?? 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Articles de blog */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Articles Blog
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.blog_posts?.total ?? stats?.blog_posts_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.blog_posts} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Publiés: <strong className="text-gray-900 dark:text-white">{stats?.blog_posts?.published ?? 0}</strong></span>
              <span>Brouillons: <strong className="text-gray-900 dark:text-white">{stats?.blog_posts?.draft ?? 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Événements */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Événements
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.events?.total ?? stats?.events_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.events} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>À venir: <strong className="text-gray-900 dark:text-white">{stats?.events?.upcoming ?? 0}</strong></span>
              <span>Passés: <strong className="text-gray-900 dark:text-white">{stats?.events?.past ?? 0}</strong></span>
            </div>
          </div>
        </div>

        {/* Messages de contact */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Messages Contact
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.contact_messages?.total ?? stats?.contact_messages_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.contact_messages} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Nouveaux non lus: <strong className="text-blue-600 dark:text-blue-400">{stats?.contact_messages?.new ?? 0}</strong>
            </span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Abonnés Newsletter
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.newsletter_subscribers?.total ?? stats?.newsletter_subscribers_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.newsletter_subscribers} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Actifs: <strong className="text-success-600 dark:text-success-400">{stats?.newsletter_subscribers?.active ?? 0}</strong>
            </span>
          </div>
        </div>

        {/* Utilisateurs */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Utilisateurs
              </p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.users?.total ?? stats?.users_count ?? 0}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <GrowthBadge metric={stats?.users} />
                <span className="text-xs text-gray-500 dark:text-gray-400">ce mois</span>
              </div>
            </div>
            <div className="flex size-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Admins: <strong className="text-gray-900 dark:text-white">{stats?.users?.admins ?? 0}</strong></span>
              <span>Super: <strong className="text-gray-900 dark:text-white">{stats?.users?.super_admins ?? 0}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/admin/trainings/create"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-success-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-success-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-success-50 text-success-600 transition group-hover:scale-110 dark:bg-success-950/40 dark:text-success-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-success-600 dark:text-white dark:group-hover:text-success-400">
                Nouvelle formation
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Créer un nouveau programme
              </p>
            </div>
          </Link>

          <Link
            to="/admin/blog/create"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-orange-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:scale-110 dark:bg-orange-950/40 dark:text-orange-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                Nouvel article
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Publier une actualité
              </p>
            </div>
          </Link>

          <Link
            to="/admin/events/create"
            className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition hover:border-purple-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:scale-110 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                Nouvel événement
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Organiser une conférence ou atelier
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
