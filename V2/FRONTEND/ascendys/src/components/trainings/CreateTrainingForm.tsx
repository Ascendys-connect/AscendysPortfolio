import { useState, type FormEvent } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import ImageUploader from "@/components/form/ImageUploader";

interface TrainingFormData {
  title: string;
  description: string;
  duration: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  price: number;
  category: string;
  featured_image?: File | null;
}

interface CreateTrainingFormProps {
  onSubmit: (data: TrainingFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateTrainingForm({ onSubmit, onCancel }: CreateTrainingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TrainingFormData>({
    title: "",
    description: "",
    duration: 0,
    level: "BEGINNER",
    price: 0,
    category: "",
    featured_image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "La durée doit être supérieure à 0";
    }

    if (!formData.price || formData.price < 0) {
      newErrors.price = "Le prix doit être positif";
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
      console.error("Error creating training:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof TrainingFormData, value: any) => {
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
          Titre de la formation <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Formation Python Avancé"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>
          Description <span className="text-error-500">*</span>
        </Label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Décrivez la formation..."
          rows={4}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description}</p>
        )}
      </div>

      {/* Duration & Price */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label>
            Durée (heures) <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", parseInt(e.target.value) || 0)}
            placeholder="40"
            min="1"
            disabled={isLoading}
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.duration}</p>
          )}
        </div>
        <div>
          <Label>
            Prix (FCFA) <span className="text-error-500">*</span>
          </Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
            placeholder="150000"
            min="0"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.price}</p>
          )}
        </div>
      </div>

      {/* Level */}
      <div>
        <Label>
          Niveau <span className="text-error-500">*</span>
        </Label>
        <select
          value={formData.level}
          onChange={(e) => handleChange("level", e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="BEGINNER">Débutant</option>
          <option value="INTERMEDIATE">Intermédiaire</option>
          <option value="ADVANCED">Avancé</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <Label>Catégorie</Label>
        <Input
          type="text"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="Développement Web"
          disabled={isLoading}
        />
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
          {isLoading ? "Création..." : "Créer la formation"}
        </Button>
      </div>
    </form>
  );
}
