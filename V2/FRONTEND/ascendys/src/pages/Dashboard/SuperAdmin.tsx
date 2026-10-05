import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import type { DashboardStats, GrowthMetric } from "@/types/api.types";
import { Link } from "react-router";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get<DashboardStats>("/dashboard/stats/");
        const statsData = (response as any)?.data || response;
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderGrowthBadge = (metric?: Partial<GrowthMetric>) => {
    const formatted = metric?.growth_formatted || "0%";
    const direction = metric?.growth_direction || "neutral";

    if (direction === "up") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-xs font-semibold text-success-600 dark:bg-success-950/40 dark:text-success-400">
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {formatted}
        </span>
      );
    } else if (direction === "down") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-error-50 px-2 py-0.5 text-xs font-semibold text-error-600 dark:bg-error-950/40 dark:text-error-400">
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {formatted}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          {formatted}
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500 dark:border-gray-700"></div>
      </div>
    );
  }

  // Real counts
  const usersTotal = stats?.users?.total ?? stats?.users_count ?? 0;
  const trainingsTotal = stats?.trainings?.total ?? stats?.trainings_count ?? 0;
  const blogPostsTotal = stats?.blog_posts?.total ?? stats?.blog_posts_count ?? 0;
  const eventsTotal = stats?.events?.total ?? stats?.events_count ?? 0;

  return (
    <>
      <PageMeta
        title="Tableau de bord Super Admin | Ascendys Connect"
        description="Vue d'ensemble complète et statistiques réelles de la plateforme Ascendys Connect"
      />
      
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenue, {user?.first_name || "Administrateur"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Aperçu en temps réel des statistiques et de l'activité de votre plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/40">
            <span className="size-2 rounded-full bg-brand-500 animate-pulse"></span>
            Données en temps réel
          </span>
        </div>
      </div>

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Utilisateurs */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Utilisateurs
              </p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {usersTotal}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
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
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {renderGrowthBadge(stats?.users)}
              <span className="text-gray-500 dark:text-gray-400">ce mois</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              +{stats?.users?.this_month ?? 0} nouveau{(stats?.users?.this_month ?? 0) > 1 ? "x" : ""}
            </span>
          </div>
        </div>

        {/* Formations */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Formations
              </p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {trainingsTotal}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-success-50 text-success-600 dark:bg-success-950/40 dark:text-success-400">
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
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {renderGrowthBadge(stats?.trainings)}
              <span className="text-gray-500 dark:text-gray-400">ce mois</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {stats?.trainings?.published ?? 0} publiée{(stats?.trainings?.published ?? 0) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Articles de blog */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Articles Blog
              </p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {blogPostsTotal}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
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
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {renderGrowthBadge(stats?.blog_posts)}
              <span className="text-gray-500 dark:text-gray-400">ce mois</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {stats?.blog_posts?.published ?? 0} publié{(stats?.blog_posts?.published ?? 0) > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Événements */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Événements
              </p>
              <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {eventsTotal}
              </h3>
            </div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
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
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              {renderGrowthBadge(stats?.events)}
              <span className="text-gray-500 dark:text-gray-400">ce mois</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              {stats?.events?.upcoming ?? 0} à venir
            </span>
          </div>
        </div>
      </div>

      {/* Grille de statistiques détaillées */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Métriques système et engagement */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Engagement & Interaction
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Données en temps réel</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Messages de contact */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Messages de contact</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.contact_messages?.new ?? 0} non lu{(stats?.contact_messages?.new ?? 0) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {stats?.contact_messages?.total ?? stats?.contact_messages_count ?? 0}
                </span>
                <div className="mt-0.5">{renderGrowthBadge(stats?.contact_messages)}</div>
              </div>
            </div>

            {/* Abonnés newsletter */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Abonnés Newsletter</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.newsletter_subscribers?.active ?? 0} actifs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {stats?.newsletter_subscribers?.total ?? stats?.newsletter_subscribers_count ?? 0}
                </span>
                <div className="mt-0.5">{renderGrowthBadge(stats?.newsletter_subscribers)}</div>
              </div>
            </div>

            {/* Témoignages */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Témoignages</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.testimonials?.published ?? 0} approuvés & publiés
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats?.testimonials?.total ?? stats?.testimonials_count ?? 0}
              </span>
            </div>

            {/* Partenaires */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Partenaires</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.partners?.active ?? 0} actifs sur le site
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats?.partners?.total ?? stats?.partners_count ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Ressources & Contenu de l'entreprise */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Catalogue & Ressources
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Actifs gérés</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Services de l'entreprise */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Services Entreprise</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.services?.active ?? 0} actifs & visibles
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats?.services?.total ?? stats?.services_count ?? 0}
              </span>
            </div>

            {/* Offres */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Offres & Promotions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.offers?.active ?? 0} en cours
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stats?.offers?.total ?? stats?.offers_count ?? 0}
              </span>
            </div>

            {/* Fichiers média */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Médiathèque</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.media_files?.images ?? 0} images · {stats?.media_files?.documents ?? 0} docs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {stats?.media_files?.total ?? stats?.media_files_count ?? 0}
                </span>
                <div className="mt-0.5">{renderGrowthBadge(stats?.media_files)}</div>
              </div>
            </div>

            {/* Rôles utilisateurs */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Administration</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats?.users?.super_admins ?? 0} super admin{(stats?.users?.super_admins ?? 0) > 1 ? "s" : ""}, {stats?.users?.admins ?? 0} admin{(stats?.users?.admins ?? 0) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {(stats?.users?.super_admins ?? 0) + (stats?.users?.admins ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="mt-8">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          Raccourcis de gestion
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            to="/users"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-brand-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:scale-110 dark:bg-brand-950/40 dark:text-brand-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
              Utilisateurs
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {usersTotal} comptes
            </span>
          </Link>

          <Link
            to="/admin/trainings"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-success-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-success-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-success-50 text-success-600 transition group-hover:scale-110 dark:bg-success-950/40 dark:text-success-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-success-600 dark:text-white dark:group-hover:text-success-400">
              Formations
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {trainingsTotal} cours
            </span>
          </Link>

          <Link
            to="/admin/blog"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-orange-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:scale-110 dark:bg-orange-950/40 dark:text-orange-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
              Articles Blog
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {blogPostsTotal} publications
            </span>
          </Link>

          <Link
            to="/admin/media"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:border-purple-500 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-500"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:scale-110 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-800 group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
              Médiathèque
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {stats?.media_files?.total ?? stats?.media_files_count ?? 0} fichiers
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
