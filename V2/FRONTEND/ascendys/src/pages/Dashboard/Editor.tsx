import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { dashboardService, type EditorStats } from "@/services/dashboard.service";

export default function EditorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();
  const [stats, setStats] = useState<EditorStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setError(null);
        const data = await dashboardService.getEditorStats();
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setStats(data);
        }
      } catch (err: any) {
        console.error('Failed to load editor stats:', err);
        const errorMessage = 'Impossible de charger les statistiques';
        
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setError(errorMessage);
          setStats(null);
          // Show user-visible error notification
          showError('Erreur', errorMessage);
        }
      } finally {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMountedRef.current = false;
    };
  }, [showError]);

  const handleRetry = () => {
    // Re-trigger the fetch by remounting effect logic manually
    setLoadingStats(true);
    setError(null);
    
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getEditorStats();
        if (isMountedRef.current) {
          setStats(data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Failed to load editor stats:', err);
        const errorMessage = 'Impossible de charger les statistiques';
        if (isMountedRef.current) {
          setError(errorMessage);
          setStats(null);
          showError('Erreur', errorMessage);
        }
      } finally {
        if (isMountedRef.current) {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
  };

  const renderStatValue = (value: number | undefined) => {
    if (loadingStats) {
      return <span className="inline-block h-7 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />;
    }
    if (error || value === undefined) {
      return '--';
    }
    return value;
  };

  return (
    <>
      <PageMeta 
        title="Dashboard Éditeur | Ascendys Connect"
        description="Tableau de bord pour les éditeurs de contenu"
      />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-title-lg font-semibold text-gray-900 dark:text-white">
            Bienvenue, {user?.first_name} !
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gérez vos contenus et suivez leur statut de publication
          </p>
        </div>

        {/* Stats Cards */}
        {error && (
          <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-900/50 dark:bg-danger-900/20">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <svg
                  className="size-5 text-danger-600 dark:text-danger-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-danger-900 dark:text-danger-200">
                    Erreur de chargement
                  </h3>
                  <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
                    {error}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRetry}
                disabled={loadingStats}
                className="rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Brouillons
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {renderStatValue(stats?.draft_count)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg
                  className="size-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Publiés
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {renderStatValue(stats?.published_count)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-900/30">
                <svg
                  className="size-5 text-success-600 dark:text-success-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {renderStatValue(stats?.total_count)}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                <svg
                  className="size-5 text-brand-600 dark:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Actions rapides
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate('/admin/trainings/create')}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                <svg
                  className="size-5 text-brand-600 dark:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nouvelle formation
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Créer une formation
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/blog/posts/create')}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                <svg
                  className="size-5 text-brand-600 dark:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nouvel article
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Rédiger un article
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/events/create')}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                <svg
                  className="size-5 text-brand-600 dark:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nouvel événement
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Créer un événement
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/services/create')}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                <svg
                  className="size-5 text-brand-600 dark:text-brand-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Nouveau service
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ajouter un service
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-6 dark:border-brand-900/50 dark:bg-brand-900/20">
          <div className="flex gap-3">
            <svg
              className="size-5 text-brand-600 dark:text-brand-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-brand-900 dark:text-brand-200">
                Processus de publication
              </h3>
              <p className="mt-1 text-sm text-brand-700 dark:text-brand-300">
                En tant qu&apos;éditeur, tous vos contenus sont créés en statut{" "}
                <strong>&quot;Brouillon&quot;</strong>. Un administrateur devra valider et
                publier votre contenu avant qu&apos;il ne soit visible publiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
