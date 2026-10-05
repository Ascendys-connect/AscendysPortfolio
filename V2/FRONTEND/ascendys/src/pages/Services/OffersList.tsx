import { Link } from "react-router";
import { offersService, type Offer } from "@/services/offers.service";
import { useApi } from "@/hooks/useApi";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon, PencilIcon } from "@/icons";
import StatusActionsModal from "@/components/common/StatusActionsModal";
import { ContentStatus } from "@/types/content.types";

export default function OffersList() {
  const { data: response = { results: [] }, loading, refetch } = useApi<{ results: Offer[] }>("/offers/", { defaultValue: { results: [] } });

  const offers = response.results || [];

  const handleStatusAction = async (offer: Offer, action: string) => {
    try {
      if (action === "publish") await offersService.publish(offer.slug);
      else if (action === "draft") await offersService.setToDraft(offer.slug);
      else if (action === "archive") await offersService.archive(offer.slug);
      refetch();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Services & Offres" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Offres</h2>
          <Link
            to="/admin/services/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nouvelle offre
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Titre</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Dates</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {offers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{offer.title}</div>
                      {offer.is_featured && (
                        <span className="text-xs text-brand-500">En vedette</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{offer.type_display}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {offer.start_date && offer.end_date ? (
                        <>
                          {new Date(offer.start_date).toLocaleDateString("fr-FR")} - {new Date(offer.end_date).toLocaleDateString("fr-FR")}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusActionsModal
                        status={offer.status as ContentStatus}
                        onPublish={() => handleStatusAction(offer, "publish")}
                        onArchive={() => handleStatusAction(offer, "archive")}
                        onDraft={() => handleStatusAction(offer, "draft")}
                      />
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Link 
                        to={`/admin/services/edit/${offer.slug}`} 
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        title="Modifier"
                      >
                        <PencilIcon className="size-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
