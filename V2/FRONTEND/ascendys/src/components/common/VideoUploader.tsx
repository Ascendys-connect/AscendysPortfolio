import { useState, useRef } from "react";

interface VideoUploaderProps {
  label?: string;
  currentVideo?: string;
  onVideoSelect: (file: File | null) => void;
}

export default function VideoUploader({ label = "Vidéo", currentVideo, onVideoSelect }: VideoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentVideo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onVideoSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onVideoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      
      {preview ? (
        <div className="relative">
          <video
            src={preview}
            controls
            className="w-full rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 end-2 rounded-full bg-error-500 p-1.5 text-white hover:bg-error-600"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <svg className="mb-2 size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-sm text-gray-500">Cliquer pour télécharger une vidéo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
