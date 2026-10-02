import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/button/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      iconBg: "bg-error-100 dark:bg-error-950/30",
      iconColor: "text-error-600 dark:text-error-400",
      buttonClass: "bg-error-500 hover:bg-error-600",
    },
    warning: {
      iconBg: "bg-warning-100 dark:bg-warning-950/30",
      iconColor: "text-warning-600 dark:text-warning-400",
      buttonClass: "bg-warning-500 hover:bg-warning-600",
    },
    info: {
      iconBg: "bg-brand-100 dark:bg-brand-950/30",
      iconColor: "text-brand-600 dark:text-brand-400",
      buttonClass: "bg-brand-500 hover:bg-brand-600",
    },
  };

  const config = variantConfig[variant];

  const dialogContent = (
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm dark:bg-gray-950/70"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-theme-xl dark:bg-gray-900">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}>
            <svg
              className={`size-6 ${config.iconColor}`}
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
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>

            {/* Message */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${config.buttonClass}`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="me-2 size-4 animate-spin"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Chargement...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
