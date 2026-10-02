import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth.types";
import { ContentStatus } from "@/types/content.types";

interface PublishButtonProps {
  status: ContentStatus;
  onPublish: () => Promise<void>;
  onArchive: () => Promise<void>;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function PublishButton({
  status,
  onPublish,
  onArchive,
  disabled = false,
  size = "sm",
}: PublishButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Only ADMIN and SUPER_ADMIN can publish/archive
  const canPublish = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  if (!canPublish) {
    return null;
  }

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await onPublish();
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    setIsLoading(true);
    try {
      await onArchive();
    } finally {
      setIsLoading(false);
    }
  };

  // Show publish button for DRAFT and ARCHIVED status
  if (status === ContentStatus.DRAFT || status === ContentStatus.ARCHIVED) {
    return (
      <Button
        onClick={handlePublish}
        disabled={disabled || isLoading}
        size={size}
        variant="primary"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="size-4 animate-spin"
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
            Publication...
          </span>
        ) : (
          <>
            <svg
              className="size-4"
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
            Publier
          </>
        )}
      </Button>
    );
  }

  // Show archive button for PUBLISHED status
  if (status === ContentStatus.PUBLISHED) {
    return (
      <Button
        onClick={handleArchive}
        disabled={disabled || isLoading}
        size={size}
        variant="secondary"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="size-4 animate-spin"
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
            Archivage...
          </span>
        ) : (
          <>
            <svg
              className="size-4"
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
            Archiver
          </>
        )}
      </Button>
    );
  }

  return null;
}
