import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import type { Event } from "@/types/content.types";

interface EventConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflictingEvents: Event[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EventConflictModal({
  isOpen,
  onClose,
  conflictingEvents,
  onConfirm,
  onCancel,
}: EventConflictModalProps) {
  const formatDateTime = (datetime: string) => {
    try {
      return new Date(datetime).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return datetime;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        {/* Icon & Title */}
        <div className="mb-4 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-500/20">
            <svg
              className="size-6 text-warning-600 dark:text-warning-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conflit d'événement détecté
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {conflictingEvents.length === 1
                ? "Un événement est déjà prévu"
                : `${conflictingEvents.length} événements sont déjà prévus`}{" "}
              à cette date :
            </p>
          </div>
        </div>

        {/* Conflicting Events List */}
        <div className="mb-6 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          {conflictingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-md bg-white p-3 dark:bg-gray-900"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {event.title}
                </h4>
                <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formatDateTime(event.start_datetime)} - {formatDateTime(event.end_datetime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Message */}
        <div className="mb-6 rounded-lg bg-warning-50 p-4 dark:bg-warning-500/10">
          <p className="text-sm text-warning-800 dark:text-warning-300">
            <strong>Attention :</strong> La création de cet événement peut entraîner des conflits d'horaire.
            Voulez-vous continuer quand même ?
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirmer quand même
          </Button>
        </div>
      </div>
    </Modal>
  );
}
