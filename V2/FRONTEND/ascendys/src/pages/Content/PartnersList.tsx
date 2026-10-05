import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import { partnersService } from "@/services/partners.service";
import type { Partner } from "@/types/content.types";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import FormModal from "@/components/common/FormModal";
import PartnerForm from "@/components/partners/PartnerForm";
import {
  PlusIcon,
  TrashBinIcon,
  PencilIcon,
  GlobeIcon,
  GroupIcon,
} from "@/icons";

export default function PartnersList() {
  const { data: rawPartners, isLoading: loading, refetch } = useApi<any>(
    "/partners/",
    { defaultValue: [] }
  );
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    partner: Partner | null;
  }>({ isOpen: false, partner: null });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    partner: Partner | null;
  }>({ isOpen: false, partner: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const partners: Partner[] = Array.isArray(rawPartners)
    ? rawPartners
    : Array.isArray(rawPartners?.results)
    ? rawPartners.results
    : Array.isArray(rawPartners?.data)
    ? rawPartners.data
    : [];

  const filtered = partners.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const handleCreate = async (data: any) => {
    try {
      await partnersService.create(data);
      setIsCreateModalOpen(false);
      refetch();
      showSuccess("Partenaire ajouté", "Le partenaire a été créé avec succès.");
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
    if (!editModal.partner) return;
    try {
      await partnersService.update(editModal.partner.id, data);
      setEditModal({ isOpen: false, partner: null });
      refetch();
      showSuccess("Partenaire modifié", "Le partenaire a été mis à jour avec succès.");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la modification.";
      showError("Erreur", msg);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.partner) return;
    setIsDeleting(true);
    try {
      await partnersService.delete(deleteModal.partner.id);
      setDeleteModal({ isOpen: false, partner: null });
      refetch();
      showSuccess("Supprimé", "Le partenaire a été supprimé.");
    } catch {
      showError("Erreur", "Impossible de supprimer ce partenaire.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Partenaires" />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: partners.length },
          { label: "Actifs", value: partners.filter((p) => p.is_active).length },
          { label: "En vedette", value: partners.filter((p) => p.is_featured).length },
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
            Liste des partenaires
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
            <GroupIcon className="mb-3 size-12 text-gray-300" />
            <p className="text-gray-500">Aucun partenaire trouvé</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <PlusIcon className="size-4" />
              Ajouter le premier partenaire
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Logo</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Nom</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Site web</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">Vedette</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="h-10 w-20 object-contain"
                        />
                      ) : (
                        <div className="flex h-10 w-20 items-center justify-center rounded border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                          <GroupIcon className="size-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                      {p.description && (
                        <p className="line-clamp-1 text-xs text-gray-500">{p.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.website ? (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-brand-500 hover:underline"
                        >
                          <GlobeIcon className="size-4" />
                          Visiter
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          p.is_active
                            ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {p.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {p.is_featured && (
                        <span className="inline-flex rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                          En vedette
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditModal({ isOpen: true, partner: p })}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/30 dark:hover:text-brand-400"
                          title="Modifier"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, partner: p })}
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
        title="Ajouter un partenaire"
      >
        <PartnerForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Modal modification */}
      <FormModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, partner: null })}
        title="Modifier le partenaire"
      >
        {editModal.partner && (
          <PartnerForm
            key={editModal.partner.id}
            initialData={editModal.partner}
            onSubmit={handleUpdate}
            onCancel={() => setEditModal({ isOpen: false, partner: null })}
          />
        )}
      </FormModal>

      {/* Modal suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, partner: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.partner?.name || ""}
        message="Êtes-vous sûr de vouloir supprimer le partenaire"
      />
    </>
  );
}
