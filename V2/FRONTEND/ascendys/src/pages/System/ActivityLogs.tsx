import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import Button from "@/components/ui/button/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useApi } from "@/hooks/useApi";
import { logsService } from "@/services/logs.service";
import { useToast } from "@/context/ToastContext";
import type { ActivityLog } from "@/types/content.types";

export default function ActivityLogs() {
  const { showToast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [filters, setFilters] = useState({
    action: "",
    model_name: "",
  });

  const { data: logs, isLoading, error, refetch } = useApi<ActivityLog[]>(
    "/dashboard/activity-logs/",
    { defaultValue: [] }
  );

  // Show error toast if API call fails
  useEffect(() => {
    if (error) {
      showToast("Erreur lors du chargement des journaux d'activité", "error");
    }
  }, [error, showToast]);

  const filteredLogs = logs.filter((log) => {
    if (filters.action && log.action !== filters.action) return false;
    if (filters.model_name && log.model_name !== filters.model_name) return false;
    return true;
  });

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      await logsService.deleteAll();
      showToast("Tous les journaux d'activité ont été effacés avec succès", "success");
      setShowClearDialog(false);
      refetch();
    } catch (error) {
      console.error("Error clearing logs:", error);
      showToast("Erreur lors de l'effacement des journaux d'activité", "error");
    } finally {
      setIsClearing(false);
    }
  };

  // Extract unique values for filters
  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueModels = Array.from(new Set(logs.map((log) => log.model_name)));

  const columns: Column<ActivityLog>[] = [
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      render: (log) => (
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-white">
            {new Date(log.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(log.created_at).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Utilisateur",
      sortable: true,
      render: (log) => (
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-white">
            {log.user.first_name} {log.user.last_name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {log.user.email}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: true,
      render: (log) => {
        const actionColors: Record<string, string> = {
          CREATE: "bg-success-100 text-success-800 dark:bg-success-950/30 dark:text-success-400",
          UPDATE: "bg-warning-100 text-warning-800 dark:bg-warning-950/30 dark:text-warning-400",
          DELETE: "bg-error-100 text-error-800 dark:bg-error-950/30 dark:text-error-400",
          VIEW: "bg-blue-light-100 text-blue-light-800 dark:bg-blue-light-950/30 dark:text-blue-light-400",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
              actionColors[log.action] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {log.action}
          </span>
        );
      },
    },
    {
      key: "model_name",
      label: "Modèle",
      sortable: true,
      render: (log) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {log.model_name}
        </span>
      ),
    },
    {
      key: "ip_address",
      label: "Adresse IP",
      render: (log) => (
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {log.ip_address || "N/A"}
        </span>
      ),
    },
    {
      key: "changes",
      label: "Détails",
      render: (log) => (
        <div className="max-w-xs">
          {log.changes ? (
            <details className="cursor-pointer text-xs text-gray-600 dark:text-gray-400">
              <summary className="text-brand-600 hover:text-brand-700 dark:text-brand-400">
                Voir les modifications
              </summary>
              <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-50 p-2 dark:bg-gray-800">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            </details>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Aucun détail
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Journaux d'activité | Ascendys Connect"
        description="Consultez les journaux d'activité du système"
      />

      <PageHeader
        title="Journaux d'activité"
        description="Historique des actions effectuées sur la plateforme"
        actions={
          <Button
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2 text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-950/30"
            onClick={() => setShowClearDialog(true)}
            disabled={logs.length === 0}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Effacer tous les logs
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {logs.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Créations</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {logs.filter((l) => l.action === "CREATE").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Modifications</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {logs.filter((l) => l.action === "UPDATE").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Suppressions</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {logs.filter((l) => l.action === "DELETE").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <select
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Toutes les actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>

        <select
          value={filters.model_name}
          onChange={(e) => setFilters({ ...filters, model_name: e.target.value })}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Tous les modèles</option>
          {uniqueModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        {(filters.action || filters.model_name) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilters({ action: "", model_name: "" })}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredLogs}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun journal d'activité trouvé"
      />

      {/* Clear Confirmation */}
      <ConfirmDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearLogs}
        title="Effacer tous les logs"
        message="Êtes-vous sûr de vouloir effacer tous les journaux d'activité ? Cette action est irréversible et supprimera l'historique complet."
        variant="danger"
        isLoading={isClearing}
      />
    </>
  );
}
