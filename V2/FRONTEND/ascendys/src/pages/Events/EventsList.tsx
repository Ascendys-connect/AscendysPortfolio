import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useNavigate } from "react-router";
import { useApi } from "@/hooks/useApi";
import eventsService from "@/services/events.service";
import type { Event } from "@/types/content.types";
import { EventTypeLabels, ContentStatus } from "@/types/content.types";
import StatusActionsModal from "@/components/common/StatusActionsModal";
import { useState } from "react";

export default function EventsList() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const {
    data: events,
    isLoading,
    error,
    refetch: fetchEvents,
  } = useApi<Event[]>("/events/", { defaultValue: [] });

  const handleStatusAction = async (event: Event, action: string) => {
    try {
      switch (action) {
        case "publish":
          await eventsService.publish(event.slug);
          break;
        case "draft":
          await eventsService.setToDraft(event.slug);
          break;
        case "archive":
          await eventsService.archive(event.slug);
          break;
        case "delete":
          setDeleteTarget(event);
          return;
      }
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de l'action:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await eventsService.delete(deleteTarget.slug);
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDateTime = (datetime: string) => {
    try {
      return new Date(datetime).toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return datetime;
    }
  };

  return (
    <>
      <PageMeta title="Événements | Ascendys Connect" description="Gestion des événements" />
      <PageHeader
        title="Événements"
        description="Gérez tous vos événements"
        breadcrumbs={[{ label: "Événements" }]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2"
              onClick={() => navigate("/admin/events/calendar")}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendrier
            </Button>
            <Button
              size="sm"
              className="inline-flex items-center gap-2"
              onClick={() => navigate("/admin/events/create")}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel événement
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-e-transparent"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-sm text-error-600 dark:text-error-400">
                Erreur lors du chargement des événements
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && events && events.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="mx-auto size-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucun événement</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Commencez par créer votre premier événement
              </p>
              <Button
                size="sm"
                className="mt-6"
                onClick={() => navigate("/admin/events/create")}
              >
                Créer un événement
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && events && events.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Date de début
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Date de fin
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="size-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                          {event.is_featured && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400">
                              <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Mis en avant
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {event.type_display || EventTypeLabels[event.event_type]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDateTime(event.start_datetime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {formatDateTime(event.end_datetime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {event.capacity || 0} participants
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusActionsModal
                        status={event.status as ContentStatus}
                        onPublish={() => handleStatusAction(event, "publish")}
                        onArchive={() => handleStatusAction(event, "archive")}
                        onDraft={() => handleStatusAction(event, "draft")}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/events/edit/${event.slug}`)}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          title="Modifier"
                        >
                          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
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
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title}
      />
    </>
  );
}
