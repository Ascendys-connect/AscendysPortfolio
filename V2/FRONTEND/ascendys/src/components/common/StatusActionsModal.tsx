import { useState } from "react";
import { ContentStatus } from "@/types/content.types";
import { usePermissions } from "@/hooks/usePermissions";
import { Modal } from "@/components/ui/modal";

interface StatusActionsModalProps {
  status: ContentStatus;
  onPublish: () => Promise<void>;
  onArchive: () => Promise<void>;
  onDraft: () => Promise<void>;
  disabled?: boolean;
}

export default function StatusActionsModal({
  status,
  onPublish,
  onArchive,
  onDraft,
  disabled = false,
}: StatusActionsModalProps) {
  const { canPublish, canSetToDraft, canArchive } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case ContentStatus.PUBLISHED:
        return "text-success-600 bg-success-50 dark:text-success-400 dark:bg-success-950/30";
      case ContentStatus.DRAFT:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800";
      case ContentStatus.ARCHIVED:
        return "text-warning-600 bg-warning-50 dark:text-warning-400 dark:bg-warning-950/30";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case ContentStatus.PUBLISHED:
        return "Publié";
      case ContentStatus.DRAFT:
        return "Brouillon";
      case ContentStatus.ARCHIVED:
        return "Archivé";
      default:
        return status;
    }
  };

  // Build available actions based on permissions and current status
  const availableActions = [];

  if (status !== ContentStatus.PUBLISHED && canPublish) {
    availableActions.push({
      label: "Publier",
      description: "Rendre la formation visible au public",
      icon: (
        <svg
          className="size-5 text-success-600 dark:text-success-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      color: "success",
      onClick: () => handleAction(onPublish),
    });
  }

  if (status !== ContentStatus.DRAFT && canSetToDraft) {
    availableActions.push({
      label: "Mettre en brouillon",
      description: "Retirer la formation du public",
      icon: (
        <svg
          className="size-5 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
      color: "gray",
      onClick: () => handleAction(onDraft),
    });
  }

  if (status !== ContentStatus.ARCHIVED && canArchive) {
    availableActions.push({
      label: "Archiver",
      description: "Archiver la formation sans la supprimer",
      icon: (
        <svg
          className="size-5 text-warning-600 dark:text-warning-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      color: "warning",
      onClick: () => handleAction(onArchive),
    });
  }

  // If no actions available, don't show the button
  if (availableActions.length === 0) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${getStatusColor()}`}
      >
        {getStatusLabel()}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled || isLoading}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 ${getStatusColor()}`}
      >
        {isLoading ? (
          <>
            <svg
              className="size-3 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Traitement...
          </>
        ) : (
          getStatusLabel()
        )}
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        className="max-w-md"
      >
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Changer le statut
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Sélectionnez l'action à effectuer sur cette formation
          </p>

          <div className="space-y-3">
            {availableActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex w-full items-start gap-4 rounded-lg border border-gray-200 p-4 text-start transition hover:border-brand-500 hover:bg-brand-50/50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-950/20"
              >
                <div className="flex-shrink-0">{action.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </div>
                </div>
                <svg
                  className="size-5 flex-shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
