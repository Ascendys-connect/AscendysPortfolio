import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import { apiService } from "@/services/api.service";

interface TrainingCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  is_active: boolean;
  trainings_count: number;
  created_at: string;
  updated_at: string;
}

export default function TrainingCategories() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<TrainingCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch categories from API
  const { data: categories, isLoading, refetch } = useApi<TrainingCategory[]>(
    "/trainings/categories/",
    { defaultValue: [] }
  );

  // Filter categories based on search
  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    );
  });

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.delete(`/trainings/categories/${categoryToDelete.id}/`);
      showSuccess("Catégorie supprimée", "La catégorie a été supprimée avec succès");
      setCategoryToDelete(null);
      refetch();
    } catch (error: any) {
      showError(
        "Erreur",
        error.response?.data?.message || "Impossible de supprimer la catégorie"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (category: TrainingCategory) => {
    try {
      await apiService.patch(`/trainings/categories/${category.id}/`, {
        is_active: !category.is_active,
      });
      showSuccess(
        category.is_active ? "Catégorie désactivée" : "Catégorie activée",
        `La catégorie "${category.name}" a été ${category.is_active ? "désactivée" : "activée"}`
      );
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de modifier le statut de la catégorie");
    }
  };

  // Table columns definition
  const columns: Column<TrainingCategory>[] = [
    {
      key: "image",
      label: "Image",
      render: (category) => (
        <div className="flex items-center justify-center">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="size-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <svg
                className="size-6 text-gray-400"
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
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Catégorie",
      sortable: true,
      render: (category) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white">
            {category.name}
          </div>
          {category.description && (
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {category.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "trainings_count",
      label: "Formations",
      sortable: true,
      render: (category) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {category.trainings_count}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      sortable: true,
      render: (category) => (
        <button
          onClick={() => handleToggleActive(category)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
            category.is_active
              ? "bg-success-50 text-success-700 hover:bg-success-100 dark:bg-success-950/30 dark:text-success-400"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          <div
            className={`size-2 rounded-full ${
              category.is_active ? "bg-success-500" : "bg-gray-400"
            }`}
          />
          {category.is_active ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "created_at",
      label: "Date de création",
      sortable: true,
      render: (category) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(category.created_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (category) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/trainings/categories/edit/${category.slug}`)}
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
          <button
            onClick={() => setCategoryToDelete(category)}
            disabled={category.trainings_count > 0}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-error-950/30 dark:hover:text-error-400"
            title={category.trainings_count > 0 ? "Impossible de supprimer une catégorie contenant des formations" : "Supprimer"}
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
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Catégories de formations | Ascendys Connect"
        description="Gérez les catégories de formations"
      />

      <PageHeader
        title="Catégories de formations"
        description="Organisez vos formations par catégories"
        breadcrumbs={[
          { label: "Formations", path: "/admin/trainings" },
          { label: "Catégories" },
        ]}
        actions={
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={() => navigate("/admin/trainings/categories/create")}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle catégorie
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total catégories</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {categories.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actives</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {categories.filter((c) => c.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total formations</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {categories.reduce((sum, c) => sum + c.trainings_count, 0)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Rechercher une catégorie..."
          onSearch={setSearchQuery}
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredCategories}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucune catégorie trouvée"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}

