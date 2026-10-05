import { Link } from "react-router";
import { servicesService, type Service } from "@/services/services.service";
import { useApi } from "@/hooks/useApi";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useState } from "react";

const getMediaUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const backendBase = "http://127.0.0.1:8000";
  return `${backendBase}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function ServicesList() {
  const { data: rawServices, isLoading, refetch } = useApi<{ results: Service[] } | Service[]>(
    "/services/",
    { defaultValue: { results: [] } as any }
  );

  // DRF may return { count, results: [...] } or a plain array
  const services: Service[] = Array.isArray(rawServices)
    ? rawServices
    : (rawServices as any)?.results ?? [];

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; service: Service | null }>({
    isOpen: false,
    service: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.service) return;
    try {
      await servicesService.delete(deleteModal.service.slug);
      setDeleteModal({ isOpen: false, service: null });
      refetch();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Services" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Services de l'entreprise</h2>
          <Link
            to="/admin/services/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nouveau service
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Icône</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Image</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Nom</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {services.map((service) => (
                  <tr key={service.id}>
                    {/* Icône miniature */}
                    <td className="px-6 py-4">
                      {service.icon ? (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 p-2 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                          <img
                            src={getMediaUrl(service.icon) || undefined}
                            alt={`Icône ${service.title}`}
                            className="size-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-gray-50 text-xs font-medium text-gray-400 ring-1 ring-dashed ring-gray-200 dark:bg-gray-800/40 dark:ring-gray-700">
                          —
                        </div>
                      )}
                    </td>

                    {/* Image miniature */}
                    <td className="px-6 py-4">
                      {service.image ? (
                        <img
                          src={getMediaUrl(service.image) || undefined}
                          alt={service.title}
                          className="size-12 rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-lg bg-gray-50 text-xs font-medium text-gray-400 ring-1 ring-dashed ring-gray-200 dark:bg-gray-800/40 dark:ring-gray-700">
                          —
                        </div>
                      )}
                    </td>

                    {/* Nom */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{service.title}</div>
                      {service.is_featured && (
                        <span className="text-xs font-medium text-brand-500">⭐ En vedette</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {service.short_description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        service.is_active 
                          ? "bg-success-50 text-success-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {service.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/services/edit/${service.slug}`} 
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          title="Modifier"
                        >
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, service })}
                          className="rounded-lg p-2 text-error-500 transition hover:bg-error-50 dark:hover:bg-error-950/20"
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, service: null })}
        onConfirm={handleDelete}
        title="Supprimer le service"
        message={`Êtes-vous sûr de vouloir supprimer le service "${deleteModal.service?.title}" ?`}
      />
    </>
  );
}
