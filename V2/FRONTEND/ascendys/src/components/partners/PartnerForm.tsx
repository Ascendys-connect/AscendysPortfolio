import { useState, type FormEvent } from "react";
import ImageUploader from "@/components/form/ImageUploader";
import type { PartnerFormData } from "@/types/content.types";

interface PartnerFormProps {
  onSubmit: (data: PartnerFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PartnerFormData>;
}

export default function PartnerForm({ onSubmit, onCancel, initialData }: PartnerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    logo: null,
    website: "",
    description: "",
    is_featured: false,
    is_active: true,
    order: 0,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Le nom doit contenir au moins 2 caractères.";
    if (!formData.logo)
      newErrors.logo = "Le logo est obligatoire.";
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
      console.error("Erreur création partenaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: keyof PartnerFormData, value: any) => {
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
          Nom du partenaire <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex: Orange CI"
          disabled={isLoading}
          className={inputClass("name")}
        />
        {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
      </div>

      {/* Site web */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          Site web
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => set("website", e.target.value)}
          placeholder="https://www.example.com"
          disabled={isLoading}
          className={inputClass()}
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Brève description du partenariat..."
          rows={3}
          disabled={isLoading}
          className={inputClass()}
        />
      </div>

      {/* Logo */}
      <div>
        <ImageUploader
          label="Logo du partenaire *"
          value={typeof formData.logo === "string" ? formData.logo : undefined}
          onImageSelect={(file) => set("logo", file)}
        />
        {errors.logo && <p className="mt-1 text-xs text-error-500">{errors.logo}</p>}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => set("is_active", e.target.checked)}
            className="size-4 rounded border-gray-300"
          />
          Actif
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
          {isLoading ? "Enregistrement..." : initialData ? "Mettre à jour" : "Ajouter le partenaire"}
        </button>
      </div>
    </form>
  );
}
