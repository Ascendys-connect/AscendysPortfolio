import { useState } from "react";
import { Link } from "react-router";
import { offersService, type Offer } from "@/services/offers.service";
import { useApi } from "@/hooks/useApi";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import StatusActionsModal from "@/components/common/StatusActionsModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { ContentStatus } from "@/types/content.types";

const getMediaUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const backendBase = "http://127.0.0.1:8000";
  return `${backendBase}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function OffersList() {
  const { data: response, isLoading, refetch } = useApi<{ results: Offer[] } | Offer[]>("/offers/", {
    defaultValue: { results: [] } as any,
  });

  const rawOffers = (response as any)?.data || response;
  const offers: Offer[] = Array.isArray(rawOffers)
    ? rawOffers
    : rawOffers?.results || [];

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; offer: Offer | null }>({
    isOpen: false,
    offer: null,
  });

  const handleStatusAction = async (offer: Offer, action: string) => {
    try {
      if (action === "publish") await offersService.publish(offer.slug);
      else if (action === "draft") await offersService.setToDraft(offer.slug);
      else if (action === "archive") await offersService.archive(offer.slug);
      refetch();
    } catch (error) {
      console.error("Erreur changement statut:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.offer) return;
    try {
      await offersService.delete(deleteModal.offer.slug);
      setDeleteModal({ isOpen: false, offer: null });
      refetch();
    } catch (error) {
      console.error("Erreur suppression offre:", error);
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "RECRUITMENT":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      case "TRAINING":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800";
      case "PROMOTION":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
      case "EVENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Offres d'emploi" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Offres d'emploi & Recrutement</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Gérez les opportunités de carrière, recrutements et offres de l'entreprise</p>
          </div>
          <Link
            to="/admin/offers/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
          >
            <PlusIcon className="size-4" />
            Nouvelle offre
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Chargement des offres...</div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Aucune offre d'emploi enregistrée pour le moment.</p>
            <Link
              to="/admin/offers/create"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <PlusIcon className="size-4" />
              Créer la première offre
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Visuel</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Titre & Poste</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Période / Échéance</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    {/* Miniature */}
                    <td className="px-6 py-4">
                      {offer.image || offer.banner ? (
                        <img
                          src={getMediaUrl(offer.image || offer.banner) || undefined}
                          alt={offer.title}
                          className="size-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-400 ring-1 ring-dashed ring-gray-200 dark:bg-gray-800/60 dark:ring-gray-700">
                          Offre
                        </div>
                      )}
                    </td>

                    {/* Titre & Description */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{offer.title}</span>
                        {offer.is_featured && (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
                            ⭐ À la une
                          </span>
                        )}
                      </div>
                      {offer.short_description && (
                        <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                          {offer.short_description}
                        </p>
                      )}
                    </td>

                    {/* Type d'offre */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getTypeBadgeClass(offer.type)}`}>
                        {offer.type_display || offer.type}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {offer.start_date || offer.end_date ? (
                        <div className="text-xs space-y-0.5">
                          {offer.start_date && (
                            <div>Début : <span className="font-medium">{new Date(offer.start_date).toLocaleDateString("fr-FR")}</span></div>
                          )}
                          {offer.end_date && (
                            <div className="text-error-600 dark:text-error-400">
                              Fin : <span className="font-medium">{new Date(offer.end_date).toLocaleDateString("fr-FR")}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Permanente</span>
                      )}
                    </td>

                    {/* Statut avec modal d'action */}
                    <td className="px-6 py-4">
                      <StatusActionsModal
                        status={offer.status as ContentStatus}
                        onPublish={() => handleStatusAction(offer, "publish")}
                        onArchive={() => handleStatusAction(offer, "archive")}
                        onDraft={() => handleStatusAction(offer, "draft")}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/offers/edit/${offer.slug}`} 
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          title="Modifier l'offre"
                        >
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, offer })}
                          className="rounded-lg p-2 text-error-500 transition hover:bg-error-50 dark:hover:bg-error-950/20"
                          title="Supprimer l'offre"
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, offer: null })}
        onConfirm={handleDelete}
        title="Supprimer l'offre"
        message={`Êtes-vous sûr de vouloir supprimer l'offre "${deleteModal.offer?.title}" ?`}
      />
    </>
  );
}
