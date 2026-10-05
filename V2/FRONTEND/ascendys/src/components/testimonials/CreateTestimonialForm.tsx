import { useState, type FormEvent } from "react";
import { StarFill } from "@/icons";
import ImageUploader from "@/components/form/ImageUploader";
import type { Testimonial, TestimonialFormData } from "@/types/content.types";

interface CreateTestimonialFormProps {
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Testimonial | Partial<TestimonialFormData> | null;
}

export default function CreateTestimonialForm({ onSubmit, onCancel, initialData }: CreateTestimonialFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: initialData?.name || "",
    role: initialData?.role || "",
    company: initialData?.company || "",
    content: initialData?.content || "",
    rating: initialData?.rating ?? 5,
    avatar: initialData?.avatar || null,
    is_featured: initialData?.is_featured ?? false,
    is_published: initialData?.is_published ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Le nom doit contenir au moins 2 caractères.";
    if (!formData.role.trim())
      newErrors.role = "La fonction/poste est obligatoire.";
    if (!formData.content.trim() || formData.content.trim().length < 20)
      newErrors.content = "Le témoignage doit contenir au moins 20 caractères.";
    if (formData.rating < 1 || formData.rating > 5)
      newErrors.rating = "La note doit être entre 1 et 5.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erreur création témoignage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: keyof TestimonialFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = (field?: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-gray-900 dark:bg-gray-800 dark:text-white ${
      field && errors[field]
        ? "border-error-500"
        : "border-gray-200 dark:border-gray-700"
    } focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          Nom <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex: Jean Kouassi"
          disabled={isLoading}
          className={inputClass("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
      </div>

      {/* Poste & Entreprise */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            Fonction <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Directeur Général"
            disabled={isLoading}
            className={inputClass("role")}
          />
          {errors.role && <p className="mt-1 text-xs text-error-500">{errors.role}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">Entreprise</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Orange CI"
            disabled={isLoading}
            className={inputClass()}
          />
        </div>
      </div>

      {/* Témoignage */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          Témoignage <span className="text-error-500">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Partagez votre expérience..."
          rows={4}
          disabled={isLoading}
          className={inputClass("content")}
        />
        {errors.content && <p className="mt-1 text-xs text-error-500">{errors.content}</p>}
      </div>

      {/* Note (étoiles) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          Note <span className="text-error-500">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => set("rating", star)}
              disabled={isLoading}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <StarFill
                className={`size-7 ${star <= formData.rating ? "text-warning-400" : "text-gray-200 dark:text-gray-700"}`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">{formData.rating}/5</span>
        </div>
      </div>

      {/* Photo */}
      <div>
        <ImageUploader
          label="Photo du client (optionnel)"
          value={typeof formData.avatar === "string" ? formData.avatar : undefined}
          onImageSelect={(file) => set("avatar", file)}
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => set("is_published", e.target.checked)}
            className="size-4 rounded border-gray-300"
          />
          Publier immédiatement
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="size-4 rounded border-gray-300"
          />
          Mettre en avant
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter le témoignage"}
        </button>
      </div>
    </form>
  );
}
