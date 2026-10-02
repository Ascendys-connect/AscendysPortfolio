import { useState, useRef, useEffect } from "react";
import { ContentStatus } from "@/types/content.types";
import { usePermissions } from "@/hooks/usePermissions";

interface StatusActionsMenuProps {
  status: ContentStatus;
  onPublish: () => Promise<void>;
  onArchive: () => Promise<void>;
  onDraft: () => Promise<void>;
  disabled?: boolean;
}

export default function StatusActionsMenu({
  status,
  onPublish,
  onArchive,
  onDraft,
  disabled = false,
}: StatusActionsMenuProps) {
  const { canPublish, canSetToDraft, canArchive, isEditor } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
        return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30";
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
      icon: (
        <svg
          className="size-4 text-success-600 dark:text-success-400"
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
      onClick: () => handleAction(onPublish),
    });
  }

  if (status !== ContentStatus.DRAFT && canSetToDraft) {
    availableActions.push({
      label: "Mettre en brouillon",
      icon: (
        <svg
          className="size-4 text-gray-600 dark:text-gray-400"
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
      onClick: () => handleAction(onDraft),
    });
  }

  if (status !== ContentStatus.ARCHIVED && canArchive) {
    availableActions.push({
      label: "Archiver",
      icon: (
        <svg
          className="size-4 text-orange-600 dark:text-orange-400"
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
      onClick: () => handleAction(onArchive),
    });
  }

  // If no actions available (e.g., editor with no permissions), don't show the menu
  if (availableActions.length === 0) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${getStatusColor()}`}>
        {getStatusLabel()}
      </span>
    );
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${getStatusColor()}`}
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
          <>
            {getStatusLabel()}
            <svg
              className="size-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {isOpen && !isLoading && (
        <div className="absolute end-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="py-1">
            {availableActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="flex w-full items-center gap-2 px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
