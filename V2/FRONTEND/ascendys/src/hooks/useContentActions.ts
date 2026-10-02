/**
 * Hook for common content actions (publish, archive, delete)
 */

import { useToast } from "@/context/ToastContext";

interface ContentService {
  publish: (slug: string) => Promise<any>;
  archive: (slug: string) => Promise<any>;
  delete: (id: string) => Promise<void>;
}

interface ContentItem {
  id: string;
  slug: string;
  title: string;
}

export function useContentActions<T extends ContentItem>(
  service: ContentService,
  refetch: () => void,
  contentType: string = "contenu"
) {
  const { showSuccess, showError } = useToast();

  const handlePublish = async (item: T) => {
    try {
      await service.publish(item.slug);
      showSuccess(
        `${contentType} publié`,
        `Le ${contentType.toLowerCase()} "${item.title}" a été publié`
      );
      refetch();
    } catch (error: any) {
      showError(
        "Erreur de publication",
        error.message || `Impossible de publier le ${contentType.toLowerCase()}`
      );
    }
  };

  const handleArchive = async (item: T) => {
    try {
      await service.archive(item.slug);
      showSuccess(
        `${contentType} archivé`,
        `Le ${contentType.toLowerCase()} "${item.title}" a été archivé`
      );
      refetch();
    } catch (error: any) {
      showError(
        "Erreur d'archivage",
        error.message || `Impossible d'archiver le ${contentType.toLowerCase()}`
      );
    }
  };

  const handleDelete = async (item: T) => {
    try {
      await service.delete(item.id);
      showSuccess(
        `${contentType} supprimé`,
        `Le ${contentType.toLowerCase()} "${item.title}" a été supprimé`
      );
      refetch();
    } catch (error: any) {
      showError(
        "Erreur de suppression",
        error.message || `Impossible de supprimer le ${contentType.toLowerCase()}`
      );
    }
  };

  return {
    handlePublish,
    handleArchive,
    handleDelete,
  };
}
