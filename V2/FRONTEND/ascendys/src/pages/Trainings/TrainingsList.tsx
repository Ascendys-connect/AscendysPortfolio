import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import StatusActionsModal from "@/components/common/StatusActionsModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";
import { trainingsService } from "@/services/trainings.service";
import type { Training } from "@/types/content.types";
import { ContentStatus } from "@/types/content.types";

export default function TrainingsList() {
  const navigate = useNavigate();
  const { canDelete, canEdit } = usePermissions();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch trainings from API
  const { data: trainings, isLoading, refetch } = useApi<Training[]>("/trainings/", {
    defaultValue: [],
  });

  // Filter trainings based on search and status
  const filteredTrainings = trainings.filter((training) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      training.title.toLowerCase().includes(query) ||
      training.description.toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === "ALL" || training.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePublish = async (training: Training) => {
    try {
      await trainingsService.publish(training.slug);
      showSuccess("Formation publiée", `La formation "${training.title}" a été publiée`);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de publier la formation");
    }
  };

  const handleArchive = async (training: Training) => {
    try {
      await trainingsService.archive(training.slug);
      showSuccess("Formation archivée", `La formation "${training.title}" a été archivée`);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible d'archiver la formation");
    }
  };

  const handleDraft = async (training: Training) => {
    try {
      await trainingsService.draft(training.slug);
      showSuccess("Formation en brouillon", `La formation "${training.title}" a été mise en brouillon`);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de mettre la formation en brouillon");
    }
  };

  const handleDeleteTraining = async () => {
    if (!trainingToDelete) return;
    setIsDeleting(true);
    try {
      await trainingsService.delete(trainingToDelete.id);
      showSuccess("Formation supprimée", "La formation a été supprimée avec succès");
      setTrainingToDelete(null);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de supprimer la formation");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns definition
  const columns: Column<Training>[] = [
    {
      key: "title",
      label: "Formation",
      sortable: true,
      render: (training) => (
        <div className="flex items-center gap-3">
          {training.image && (
            <img
              src={training.image}
              alt={training.title}
              className="size-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-gray-800 dark:text-white">
              {training.title}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {training.category_name || "Sans catégorie"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Durée",
      sortable: true,
      render: (training) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {training.duration}
        </span>
      ),
    },
    {
      key: "level",
      label: "Niveau",
      sortable: true,
      render: (training) => {
        const levelLabels: Record<string, string> = {
          BEGINNER: "Débutant",
          INTERMEDIATE: "Intermédiaire",
          ADVANCED: "Avancé",
          EXPERT: "Expert",
        };
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {levelLabels[training.level] || training.level}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (training) => (
        <StatusBadge status={training.status as ContentStatus} />
      ),
    },
    {
      key: "created_at",
      label: "Date de création",
      sortable: true,
      render: (training) => {
        if (!training.created_at) {
          return <span className="text-sm text-gray-400">-</span>;
        }
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(training.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (training) => (
        <div className="flex items-center gap-2">
          <StatusActionsModal
            status={training.status as ContentStatus}
            onPublish={() => handlePublish(training)}
            onArchive={() => handleArchive(training)}
            onDraft={() => handleDraft(training)}
          />
          {canEdit && (
            <button
              onClick={() => navigate(`/admin/trainings/edit/${training.slug}`)}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              title="Modifier"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTrainingToDelete(training);
              }}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-950/30 dark:hover:text-error-400"
              title="Supprimer"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Gestion des formations | Ascendys Connect"
        description="Gérez les formations disponibles sur la plateforme"
      />

      <PageHeader
        title="Formations"
        description="Gérez le catalogue de formations"
        actions={
          <Button 
            size="sm" 
            className="inline-flex items-center gap-2"
            onClick={() => navigate("/admin/trainings/create")}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer une formation
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {trainings.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Publiées</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {trainings.filter((t) => t.status === "PUBLISHED").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Brouillons</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {trainings.filter((t) => t.status === "DRAFT").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Archivées</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {trainings.filter((t) => t.status === "ARCHIVED").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            placeholder="Rechercher une formation..."
            onSearch={handleSearch}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="DRAFT">Brouillons</option>
            <option value="PUBLISHED">Publiées</option>
            <option value="ARCHIVED">Archivées</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredTrainings}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune formation trouvée"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!trainingToDelete}
        onClose={() => setTrainingToDelete(null)}
        onConfirm={handleDeleteTraining}
        title="Supprimer la formation"
        message={`Êtes-vous sûr de vouloir supprimer la formation "${trainingToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
