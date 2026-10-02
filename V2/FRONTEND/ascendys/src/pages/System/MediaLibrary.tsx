import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ImageUploader from "@/components/form/ImageUploader";
import Label from "@/components/form/Label";
import { useApi } from "@/hooks/useApi";
import { mediaService } from "@/services/media.service";
import type { MediaFile } from "@/types/content.types";

export default function MediaLibrary() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    title: "",
    description: "",
  });

  const { data: files, isLoading, refetch } = useApi<MediaFile[]>(
    "/media/files/",
    { defaultValue: [] }
  );

  const filteredFiles = files.filter((file) => {
    if (filterType === "all") return true;
    return file.file_type === filterType;
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadData.file);
      formData.append("title", uploadData.title || uploadData.file.name);
      if (uploadData.description) {
        formData.append("description", uploadData.description);
      }

      await mediaService.upload(formData);
      setIsUploadModalOpen(false);
      setUploadData({ file: null, title: "", description: "" });
      refetch();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await mediaService.delete(fileToDelete.id);
      setFileToDelete(null);
      refetch();
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
        return (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "VIDEO":
        return (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case "DOCUMENT":
        return (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <>
      <PageMeta
        title="Médiathèque | Ascendys Connect"
        description="Gérez vos fichiers média"
      />

      <PageHeader
        title="Médiathèque"
        description="Téléchargez et gérez vos fichiers média"
        actions={
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Télécharger un fichier
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {files.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Images</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {files.filter((f) => f.file_type === "IMAGE").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {files.filter((f) => f.file_type === "DOCUMENT").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Taille totale</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {formatFileSize(files.reduce((sum, f) => sum + f.file_size, 0))}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">Tous les fichiers</option>
          <option value="IMAGE">Images</option>
          <option value="VIDEO">Vidéos</option>
          <option value="DOCUMENT">Documents</option>
          <option value="AUDIO">Audio</option>
          <option value="OTHER">Autres</option>
        </select>
      </div>

      {/* Files Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">Aucun fichier trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:border-brand-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Preview */}
              <div className="flex aspect-video items-center justify-center bg-gray-50 dark:bg-gray-800">
                {file.file_type === "IMAGE" ? (
                  <img
                    src={file.file}
                    alt={file.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-500">
                    {getFileIcon(file.file_type)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="truncate font-medium text-gray-800 dark:text-white">
                  {file.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.file_size)} • {file.file_type}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(file.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-2 bg-gradient-to-b from-black/50 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => window.open(file.file, "_blank")}
                  className="rounded-lg bg-white/90 p-1.5 text-gray-800 transition hover:bg-white"
                  title="Télécharger"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => setFileToDelete(file)}
                  className="rounded-lg bg-error-500/90 p-1.5 text-white transition hover:bg-error-600"
                  title="Supprimer"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <FormModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadData({ file: null, title: "", description: "" });
        }}
        title="Télécharger un fichier"
      >
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <Label required>Fichier</Label>
            <ImageUploader
              onImageSelect={(file) => setUploadData({ ...uploadData, file })}
              maxSiz
              
              eMB={10}
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>

          <div>
            <Label htmlFor="title">Titre</Label>
            <input
              id="title"
              type="text"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              placeholder="Laissez vide pour utiliser le nom du fichier"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Description du fichier (optionnel)"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadData({ file: null, title: "", description: "" });
              }}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={!uploadData.file || isUploading}>
              {isUploading ? "Téléchargement..." : "Télécharger"}
            </Button>
          </div>
        </form>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le fichier"
        message={`Êtes-vous sûr de vouloir supprimer "${fileToDelete?.title}" ? Cette action est irréversible.`}
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
