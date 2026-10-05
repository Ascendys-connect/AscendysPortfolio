import { useState, useEffect } from "react";
import { type BlogFormData, type BlogCategory, type Tag } from "@/services/blog.service";
import ImageUploader from "@/components/form/ImageUploader";
import VideoUploader from "@/components/common/VideoUploader";

interface BlogPostFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => void;
  loading?: boolean;
  categories: BlogCategory[];
  tags: Tag[];
}

export default function BlogPostForm({ initialData, onSubmit, loading, categories, tags }: BlogPostFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    cover_image: null,
    video: null,
    category: null,
    tags_ids: [],
    status: "DRAFT",
    is_featured: false,
    ...initialData,
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('BlogPostForm - Updating with initialData:', initialData);
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Titre <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Extrait */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Extrait <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              maxLength={300}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500">{formData.excerpt?.length || 0}/300 caractères</p>
          </div>

          {/* Contenu */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Contenu <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Catégorie */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Catégorie <span className="text-error-500">*</span>
            </label>
            <select
              value={formData.category || ""}
              onChange={(e) => setFormData({ ...formData, category: e.target.value ? Number(e.target.value) : null })}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Sélectionner...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Tags</label>
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.tags_ids.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, tags_ids: [...formData.tags_ids, tag.id] });
                      } else {
                        setFormData({ ...formData, tags_ids: formData.tags_ids.filter((id) => id !== tag.id) });
                      }
                    }}
                    className="size-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            >
              <option value="DRAFT">Brouillon</option>
              <option value="PUBLISHED">Publié</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>

          {/* En vedette */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="size-4 rounded border-gray-300"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-900 dark:text-white">Article en vedette</label>
          </div>

          {/* Image de couverture */}
          <ImageUploader
            label="Image de couverture"
            currentImage={typeof formData.cover_image === 'string' ? formData.cover_image : undefined}
            onImageSelect={(file) => setFormData({ ...formData, cover_image: file })}
          />

          {/* Vidéo */}
          <VideoUploader
            label="Vidéo descriptive"
            currentVideo={typeof formData.video === 'string' ? formData.video : undefined}
            onVideoSelect={(file) => setFormData({ ...formData, video: file })}
          />

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}
