import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import { testimonialsService } from "@/services/testimonials.service";
import type { Testimonial } from "@/types/content.types";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import FormModal from "@/components/common/FormModal";
import CreateTestimonialForm from "@/components/testimonials/CreateTestimonialForm";
import {
  PlusIcon,
  TrashBinIcon,
  PencilIcon,
  StarFill,
  UserCircleIcon,
} from "@/icons";

export default function TestimonialsList() {
  const { data: rawTestimonials, isLoading: loading, refetch } = useApi<any>(
    "/testimonials/",
    { defaultValue: [] }
  );
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    testimonial: Testimonial | null;
  }>({ isOpen: false, testimonial: null });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    testimonial: Testimonial | null;
  }>({ isOpen: false, testimonial: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingTestimonial, setIsLoadingTestimonial] = useState(false);

  const testimonials: Testimonial[] = Array.isArray(rawTestimonials)
    ? rawTestimonials
    : Array.isArray(rawTestimonials?.results)
    ? rawTestimonials.results
    : Array.isArray(rawTestimonials?.data)
    ? rawTestimonials.data
    : [];

  const filtered = testimonials.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name?.toLowerCase().includes(q) ||
      t.company?.toLowerCase().includes(q) ||
      t.content?.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (data: any) => {
    try {
      await testimonialsService.create(data);
      setIsCreateModalOpen(false);
      refetch();
      showSuccess("Témoignage ajouté", "Le témoignage a été créé avec succès.");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création.";
      showError("Erreur", msg);
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editModal.testimonial) return;
    try {
      await testimonialsService.update(editModal.testimonial.id, data);
      setEditModal({ isOpen: false, testimonial: null });
      refetch();
      showSuccess("Témoignage modifié", "Le témoignage a été mis à jour avec succès.");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la modification.";
      showError("Erreur", msg);
      throw error;
    }
  };

  const handleOpenEditModal = async (testimonial: Testimonial) => {
    setIsLoadingTestimonial(true);
    try {
      // Récupérer les détails complets du témoignage
      const response = await testimonialsService.getById(testimonial.id);
      // Extraire les données du wrapper {success, message, data}
      const fullTestimonial = response.data || response;
      setEditModal({ isOpen: true, testimonial: fullTestimonial });
    } catch (error: any) {
      showError("Erreur", "Impossible de charger les détails du témoignage");
    } finally {
      setIsLoadingTestimonial(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.testimonial) return;
    setIsDeleting(true);
    try {
      await testimonialsService.delete(deleteModal.testimonial.id);
      setDeleteModal({ isOpen: false, testimonial: null });
      refetch();
      showSuccess("Supprimé", "Le témoignage a été supprimé.");
    } catch {
      showError("Erreur", "Impossible de supprimer ce témoignage.");
    } finally {
      setIsDeleting(false);
    }
  };

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((s, t) => s + (t.rating || 0), 0) / testimonials.length).toFixed(1)
      : "–";

  return (
    <>
      <PageBreadCrumb pageTitle="Témoignages" />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: testimonials.length },
          { label: "Publiés", value: testimonials.filter((t) => t.is_published).length },
          { label: "Note moyenne", value: avgRating },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liste des témoignages
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <PlusIcon className="size-4" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <UserCircleIcon className="mb-3 size-12 text-gray-300" />
            <p className="text-gray-500">Aucun témoignage trouvé</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <PlusIcon className="size-4" />
              Ajouter le premier témoignage
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Client</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Témoignage</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">Note</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="size-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                            <UserCircleIcon className="size-6 text-brand-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{t.name}</p>
                          <p className="text-xs text-gray-500">
                            {t.role}{t.company ? ` — ${t.company}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {t.content}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarFill
                            key={s}
                            className={`size-4 ${s <= t.rating ? "text-warning-400" : "text-gray-200 dark:text-gray-700"}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          t.is_published
                            ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {t.is_published ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          disabled={isLoadingTestimonial}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 dark:hover:bg-brand-950/30 dark:hover:text-brand-400"
                          title="Modifier"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, testimonial: t })
                          }
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-950/30 dark:hover:text-error-400"
                          title="Supprimer"
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal création */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Ajouter un témoignage"
      >
        <CreateTestimonialForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Modal modification */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, testimonial: null })}
        title="Modifier le témoignage"
      >
        {editModal.testimonial && (
          <CreateTestimonialForm
            key={editModal.testimonial.id}
            initialData={editModal.testimonial}
            onSubmit={handleUpdate}
            onCancel={() => setEditModal({ isOpen: false, testimonial: null })}
          />
        )}
      </FormModal>

      {/* Modal suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, testimonial: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.testimonial?.name || ""}
        message="Êtes-vous sûr de vouloir supprimer le témoignage de"
      />
    </>
  );
}
