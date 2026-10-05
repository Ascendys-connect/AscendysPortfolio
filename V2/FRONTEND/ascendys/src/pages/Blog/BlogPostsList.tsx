import { useState } from "react";
import { Link } from "react-router";
import { blogPostsService, type BlogPost } from "@/services/blog.service";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { PlusIcon, PencilIcon, TrashBinIcon, StarFill } from "@/icons";
import StatusActionsModal from "@/components/common/StatusActionsModal";
import { ContentStatus } from "@/types/content.types";

export default function BlogPostsList() {
  const { data: response = { results: [] }, isLoading: loading, refetch } = useApi<{ results: BlogPost[] }>("/blog/", { defaultValue: { results: [] } });
  const { showSuccess, showError } = useToast();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    post: BlogPost | null;
  }>({ isOpen: false, post: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const posts: BlogPost[] = Array.isArray(response)
    ? response
    : Array.isArray((response as any)?.results)
    ? (response as any).results
    : [];

  const handleStatusAction = async (post: BlogPost, action: string) => {
    try {
      if (action === "publish") {
        await blogPostsService.publish(post.slug);
        showSuccess("Publié", "L'article a été publié.");
      } else if (action === "draft") {
        await blogPostsService.setToDraft(post.slug);
        showSuccess("Brouillon", "L'article a été remis en brouillon.");
      } else if (action === "archive") {
        await blogPostsService.archive(post.slug);
        showSuccess("Archivé", "L'article a été archivé.");
      }
      refetch();
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Erreur lors du changement de statut.";
      showError("Erreur", msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    setIsDeleting(true);
    try {
      await blogPostsService.delete(deleteModal.post.slug);
      setDeleteModal({ isOpen: false, post: null });
      refetch();
      showSuccess("Supprimé", "L'article a été supprimé.");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Impossible de supprimer cet article.";
      showError("Erreur", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Articles de blog" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Articles</h2>
          <Link
            to="/admin/blog/posts/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nouvel article
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Titre</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Catégorie</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Auteur</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Vues</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                      {post.is_featured && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                          <StarFill className="size-3 text-warning-400" />
                          En vedette
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{post.category_name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{post.author_name}</td>
                    <td className="px-6 py-4">
                      <StatusActionsModal
                        status={post.status as ContentStatus}
                        onPublish={() => handleStatusAction(post, "publish")}
                        onArchive={() => handleStatusAction(post, "archive")}
                        onDraft={() => handleStatusAction(post, "draft")}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{post.views_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(post.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/blog/posts/edit/${post.slug}`} 
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          title="Modifier"
                        >
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, post })}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-950/30 dark:hover:text-error-400"
                          title="Supprimer"
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        onConfirm={handleDelete}
        itemName={deleteModal.post?.title || ""}
        message="Êtes-vous sûr de vouloir supprimer l'article"
        isLoading={isDeleting}
      />
    </>
  );
}
