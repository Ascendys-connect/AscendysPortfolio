import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import type { Event } from "@/types/content.types";
import { EventTypeLabels } from "@/types/content.types";
import StatusBadge from "@/components/common/StatusBadge";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit?: () => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onEdit,
}: EventDetailsModalProps) {
  if (!event) return null;

  const formatDateTime = (datetime: string) => {
    try {
      return new Date(datetime).toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return datetime;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="mb-4 h-48 w-full rounded-lg object-cover"
            />
          )}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h2>
              {event.is_featured && (
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400">
                  <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Événement mis en avant
                </span>
              )}
            </div>
            <StatusBadge status={event.status} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {event.description}
            </p>
          </div>

          {/* Type */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Type d'événement
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {EventTypeLabels[event.event_type]}
            </span>
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Date de début
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDateTime(event.start_datetime)}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Date de fin
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDateTime(event.end_datetime)}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Lieu
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Capacité
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {event.capacity} participants
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Modifier l'événement
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
