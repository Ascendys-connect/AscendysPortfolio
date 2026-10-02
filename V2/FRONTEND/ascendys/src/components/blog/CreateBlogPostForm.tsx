import { useState, type FormEvent } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import ImageUploader from "@/components/form/ImageUploader";

interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  featured_image?: File | null;
  tags: string;
}

interface CreateBlogPostFormProps {
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateBlogPostForm({ onSubmit, onCancel }: CreateBlogPostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    excerpt: "",
    content: "",
    status: "DRAFT",
    featured_image: null,
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = "Le titre doit contenir au moins 5 caractères";
    }

    if (!formData.excerpt || formData.excerpt.trim().length < 10) {
      newErrors.excerpt = "L'extrait doit contenir au moins 10 caractères";
    }

    if (!formData.content || formData.content.trim().length < 50) {
      newErrors.content = "Le contenu doit contenir au moins 50 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof BlogPostFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setFormData((prev) => ({ ...prev, featured_image: file }));
    setImagePreview(previewUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <Label>
          Titre de l'article <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Les tendances du digital en 2024"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.title}</p>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <Label>
          Extrait <span className="text-error-500">*</span>
        </Label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          placeholder="Résumé court de l'article..."
          rows={3}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.excerpt}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <Label>
          Contenu <span className="text-error-500">*</span>
        </Label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Rédigez votre article ici..."
          rows={10}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.content}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <Input
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          placeholder="Digital, Innovation, Tech (séparés par des virgules)"
          disabled={isLoading}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Séparez les tags par des virgules
        </p>
      </div>

      {/* Status */}
      <div>
        <Label>
          Statut <span className="text-error-500">*</span>
        </Label>
        <select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="DRAFT">Brouillon</option>
          <option value="PUBLISHED">Publier</option>
        </select>
      </div>

      {/* Featured Image */}
      <div>
        <ImageUploader
          label="Image de couverture"
          value={imagePreview || undefined}
          onChange={handleImageChange}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer l'article"}
        </Button>
      </div>
    </form>
  );
}
