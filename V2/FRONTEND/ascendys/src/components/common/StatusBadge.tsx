import { ContentStatus, ContentStatusLabels, ContentStatusColors } from "@/types/content.types";

interface StatusBadgeProps {
  status: ContentStatus | "active" | "inactive" | "pending";
  label?: string;
}

const additionalStatusConfig = {
  active: {
    label: "Actif",
    className: "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400",
  },
  inactive: {
    label: "Inactif",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
  pending: {
    label: "En attente",
    className: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
  },
};

const contentStatusConfig = {
  [ContentStatus.DRAFT]: {
    label: ContentStatusLabels[ContentStatus.DRAFT],
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
  [ContentStatus.PUBLISHED]: {
    label: ContentStatusLabels[ContentStatus.PUBLISHED],
    className: "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400",
  },
  [ContentStatus.ARCHIVED]: {
    label: ContentStatusLabels[ContentStatus.ARCHIVED],
    className: "bg-warning-50 text-warning-700 dark:bg-warning-950/30 dark:text-warning-400",
  },
};

const statusConfig = {
  ...contentStatusConfig,
  ...additionalStatusConfig,
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  // Fallback si le statut n'est pas reconnu
  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
        {label || status || "Inconnu"}
      </span>
    );
  }
  
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {displayLabel}
    </span>
  );
}
