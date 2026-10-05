import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { blogCategoriesService, type BlogCategory } from "@/services/blog.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export default function CategoryForm() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEdit = !!slug;

  const [loading, setLoading] = useState(isEdit);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (isEdit && slug) {
      setLoading(true);
      blogCategoriesService.getBySlug(slug)
        .then((res) => {
          const category = res;
          if (category && category.name) {
            setFormData({
              name: category.name,
              description: category.description || "",
              is_active: category.is_active ?? true,
            });
          }
        })
        .catch((error) => {
          console.error('Error loading category:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEdit, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && slug) {
        await blogCategoriesService.update(slug, formData);
      } else {
        await blogCategoriesService.create(formData);
      }
      navigate("/admin/blog/categories");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle={isEdit ? "Modifier catégorie" : "Nouvelle catégorie"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Nom <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="size-4 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm text-gray-900 dark:text-white">Actif</label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/blog/categories")}
              className="rounded-lg border border-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
