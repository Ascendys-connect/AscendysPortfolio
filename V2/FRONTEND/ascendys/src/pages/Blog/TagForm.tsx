import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { tagsService } from "@/services/blog.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export default function TagForm() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const isEdit = !!slug;

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (isEdit && slug) {
      tagsService.getBySlug(slug).then((res) => {
        const tag = res; // API returns object directly
        setName(tag.name);
      });
    }
  }, [isEdit, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && slug) {
        await tagsService.update(slug, { name });
      } else {
        await tagsService.create({ name });
      }
      navigate("/admin/blog/tags");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle={isEdit ? "Modifier tag" : "Nouveau tag"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Nom <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
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
              onClick={() => navigate("/admin/blog/tags")}
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
