import { useState, useRef } from "react";

interface ImageUploaderProps {
  value?: string;
  currentImage?: string;
  preview?: string;
  onChange?: (file: File | null, previewUrl?: string | null) => void;
  onImageSelect?: (file: File | null) => void; // Alternative simplified callback
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
}

export default function ImageUploader({
  value,
  currentImage,
  preview: externalPreview,
  onChange,
  onImageSelect,
  label = "Image",
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
  disabled = false,
}: ImageUploaderProps) {
  const initialPreview = externalPreview || currentImage || value || null;
  const [preview, setPreview] = useState<string | null>(initialPreview);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/") && !file.type.includes("svg")) {
      setError("Le fichier doit être une image");
      return false;
    }

    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`La taille maximale est ${maxSizeMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      
      // Call appropriate callback
      if (onChange) {
        onChange(file, previewUrl);
      }
      if (onImageSelect) {
        onImageSelect(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    
    // Call appropriate callback
    if (onChange) {
      onChange(null, null);
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition ${
          isDragging
            ? "border-brand-500 bg-brand-50 dark:bg-brand-950/20"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-48 w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute inset-e-2 top-2 flex size-8 items-center justify-center rounded-full bg-error-500 text-white transition hover:bg-error-600 disabled:opacity-50"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <svg
              className="mb-4 size-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Cliquez pour télécharger</span> ou
              glissez-déposez
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, WEBP (max. {maxSizeMB}MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              disabled={disabled}
              onChange={handleInputChange}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
}
