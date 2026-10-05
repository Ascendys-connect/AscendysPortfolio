import { useState } from "react";
import { Link } from "react-router";
import { blogCategoriesService, type BlogCategory } from "@/services/blog.service";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { PlusIcon, PencilIcon, TrashBinIcon } from "@/icons";

export default function CategoriesList() {
  const { data: categories = [], loading, refetch } = useApi<BlogCategory[]>("/blog/categories/", { defaultValue: [] });
  const { showError, showWarning } = useToast();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: BlogCategory | null }>({
    isOpen: false,
    category: null,
  });

  const handleDeleteClick = (category: BlogCategory) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.category) return;
    
    // Check if category has posts
    if (deleteModal.category.posts_count > 0) {
      showWarning(
        "Suppression impossible",
        `Cette catégorie contient ${deleteModal.category.posts_count} article(s) et ne peut pas être supprimée.`
      );
      setDeleteModal({ isOpen: false, category: null });
      return;
    }
    
    try {
      await blogCategoriesService.delete(deleteModal.category.slug);
      refetch();
      setDeleteModal({ isOpen: false, category: null });
    } catch (error) {
      console.error("Erreur suppression:", error);
      showError("Erreur de suppression", "Une erreur est survenue lors de la suppression de la catégorie.");
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Catégories de blog" />
      
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Catégories</h2>
          <Link
            to="/admin/blog/categories/create"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            <PlusIcon className="size-4" />
            Nouvelle catégorie
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
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Description</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Articles</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-end text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{cat.description || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cat.posts_count}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${cat.is_active ? "bg-success-50 text-success-700" : "bg-gray-100 text-gray-600"}`}>
                        {cat.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/blog/categories/edit/${cat.slug}`} className="text-blue-light-600 hover:text-blue-light-700">
                          <PencilIcon className="size-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(cat)}
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
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.category?.name || ""}
        message="Êtes-vous sûr de vouloir supprimer la catégorie"
      />
    </>
  );
}
