import { useState, useCallback } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateServiceForm from "@/components/services/CreateServiceForm";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { servicesService } from "@/services/services.service";
import type { Service } from "@/types/content.types";

export default function ServicesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch services from API
  const { data: services, isLoading, refetch } = useApi<Service[]>("/services/services/", {
    defaultValue: [],
  });

  // Filter services based on search
  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase();
    return (
      service.title.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query)
    );
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateService = async (data: any) => {
    try {
      await servicesService.create(data);
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await servicesService.delete(serviceToDelete.id);
      setServiceToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns definition
  const columns: Column<Service>[] = [
    {
      key: "title",
      label: "Service",
      sortable: true,
      render: (service) => (
        <div className="flex items-center gap-3">
          {service.icon && (
            <div className="flex size-12 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-950/30">
              <img
                src={service.icon}
                alt={service.title}
                className="size-6"
              />
            </div>
          )}
          <div className="max-w-md">
            <div className="font-medium text-gray-800 dark:text-white">
              {service.title}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {service.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      sortable: true,
      render: (service) => (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {service.category || "Non catégorisé"}
        </span>
      ),
    },
    {
      key: "order",
      label: "Ordre",
      sortable: true,
      render: (service) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {service.order}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      sortable: true,
      render: (service) => (
        <StatusBadge status={service.is_active ? "active" : "inactive"} />
      ),
    },
    {
      key: "created_at",
      label: "Date de création",
      sortable: true,
      render: (service) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(service.created_at).toLocaleDateString("fr-FR", {
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
      render: () => (
        <div className="flex items-center gap-2">
          <button
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
            className="rounded-lg p-2 text-gray-400 transition hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-950/30 dark:hover:text-success-400"
            title="Déplacer vers le haut"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
          <button
            onClick={() => setServiceToDelete(service)}
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
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Gestion des services | Ascendys Connect"
        description="Gérez les services proposés par la plateforme"
      />

      <PageHeader
        title="Services"
        description="Gérez vos offres de services"
        actions={
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer un service
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {services.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {services.filter((s) => s.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Inactifs</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {services.filter((s) => !s.is_active).length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Rechercher un service..."
          onSearch={handleSearch}
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredServices}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun service trouvé"
      />

      {/* Create Service Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un service"
      >
        <CreateServiceForm
          onSubmit={handleCreateService}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer le service "${serviceToDelete?.title}" ? Cette action est irréversible.`}
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
