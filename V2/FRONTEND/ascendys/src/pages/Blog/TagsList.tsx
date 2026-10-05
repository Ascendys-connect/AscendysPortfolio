import { useState } from "react";
import { Link } from "react-router";
import { tagsService, type Tag } from "@/services/blog.service";
import { useApi } from "@/hooks/useApi";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

export default function TagsList() {
  const { data: tags = [], loading, refetch } = useApi<Tag[]>("/blog/tags/", { defaultValue: [] });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tag: Tag | null }>({
    isOpen: false,
    tag: null,
  });

  const handleDeleteClick = (tag: Tag) => {
    setDeleteModal({ isOpen: true, tag });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.tag) return;
    try {
      await tagsService.delete(deleteModal.tag.slug);
      refetch();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Tags" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h2>
          <Link
            to="/admin/blog/tags/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nouveau tag
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Nom</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Articles</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tag.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tag.posts_count}</td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/blog/tags/edit/${tag.slug}`} className="text-blue-light-600 hover:text-blue-light-700">
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(tag)}
                          className="text-error-600 hover:text-error-700"
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
        onClose={() => setDeleteModal({ isOpen: false, tag: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.tag?.name || ""}
        message="Êtes-vous sûr de vouloir supprimer le tag"
      />
    </>
  );
}
