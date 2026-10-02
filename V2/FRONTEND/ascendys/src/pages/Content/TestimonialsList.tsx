import { useState, useCallback } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateTestimonialForm from "@/components/testimonials/CreateTestimonialForm";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { testimonialsService } from "@/services/testimonials.service";
import type { Testimonial } from "@/types/content.types";

export default function TestimonialsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: testimonials, isLoading, refetch } = useApi<Testimonial[]>(
    "/testimonials/testimonials/",
    { defaultValue: [] }
  );

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const query = searchQuery.toLowerCase();
    return (
      testimonial.client_name.toLowerCase().includes(query) ||
      testimonial.company.toLowerCase().includes(query) ||
      testimonial.content.toLowerCase().includes(query)
    );
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreateTestimonial = async (data: any) => {
    try {
      await testimonialsService.create(data);
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    setIsDeleting(true);
    try {
      await testimonialsService.delete(testimonialToDelete.id);
      setTestimonialToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Testimonial>[] = [
    {
      key: "client_name",
      label: "Client",
      sortable: true,
      render: (testimonial) => (
        <div className="flex items-center gap-3">
          {testimonial.client_photo && (
            <img
              src={testimonial.client_photo}
              alt={testimonial.client_name}
              className="size-10 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-medium text-gray-800 dark:text-white">
              {testimonial.client_name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {testimonial.client_position} - {testimonial.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      label: "Témoignage",
      render: (testimonial) => (
        <div className="max-w-md line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {testimonial.content}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Note",
      sortable: true,
      render: (testimonial) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`size-4 ${
                i < testimonial.rating
                  ? "fill-warning-500 text-warning-500"
                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      sortable: true,
      render: (testimonial) => (
        <StatusBadge status={testimonial.is_active ? "active" : "inactive"} />
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
            onClick={() => setTestimonialToDelete(testimonial)}
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
        title="Gestion des témoignages | Ascendys Connect"
        description="Gérez les témoignages clients"
      />

      <PageHeader
        title="Témoignages"
        description="Gérez les avis de vos clients"
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
            Ajouter un témoignage
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {testimonials.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {testimonials.filter((t) => t.is_active).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Note moyenne</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {testimonials.length > 0
              ? (
                  testimonials.reduce((sum, t) => sum + t.rating, 0) /
                  testimonials.length
                ).toFixed(1)
              : "0.0"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Rechercher par nom, entreprise..."
          onSearch={handleSearch}
        />
      </div>

      <DataTable
        data={filteredTestimonials}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun témoignage trouvé"
      />

      {/* Create Testimonial Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ajouter un témoignage"
      >
        <CreateTestimonialForm
          onSubmit={handleCreateTestimonial}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={handleDeleteTestimonial}
        title="Supprimer le témoignage"
        message={`Êtes-vous sûr de vouloir supprimer le témoignage de "${testimonialToDelete?.client_name}" ? Cette action est irréversible.`}
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
