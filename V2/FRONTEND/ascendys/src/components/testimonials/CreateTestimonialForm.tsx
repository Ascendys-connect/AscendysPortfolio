import { useState, type FormEvent } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import RatingInput from "@/components/form/RatingInput";
import ImageUploader from "@/components/form/ImageUploader";

interface TestimonialFormData {
  client_name: string;
  client_position: string;
  company: string;
  content: string;
  rating: number;
  client_photo?: File | null;
}

interface CreateTestimonialFormProps {
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateTestimonialForm({ onSubmit, onCancel }: CreateTestimonialFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    client_name: "",
    client_position: "",
    company: "",
    content: "",
    rating: 5,
    client_photo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.client_name || formData.client_name.trim().length < 3) {
      newErrors.client_name = "Le nom doit contenir au moins 3 caractères";
    }

    if (!formData.company || formData.company.trim().length < 2) {
      newErrors.company = "L'entreprise doit contenir au moins 2 caractères";
    }

    if (!formData.content || formData.content.trim().length < 20) {
      newErrors.content = "Le témoignage doit contenir au moins 20 caractères";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "La note doit être entre 1 et 5";
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
      console.error("Error creating testimonial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof TestimonialFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoChange = (file: File | null, previewUrl: string | null) => {
    setFormData((prev) => ({ ...prev, client_photo: file }));
    setPhotoPreview(previewUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Client Name */}
      <div>
        <Label>
          Nom du client <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.client_name}
          onChange={(e) => handleChange("client_name", e.target.value)}
          placeholder="Ex: Jean Kouassi"
          disabled={isLoading}
        />
        {errors.client_name && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.client_name}</p>
        )}
      </div>

      {/* Position & Company */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label>Poste</Label>
          <Input
            type="text"
            value={formData.client_position}
            onChange={(e) => handleChange("client_position", e.target.value)}
            placeholder="Directeur Général"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label>
            Entreprise <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder="Orange CI"
            disabled={isLoading}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.company}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <Label>
          Témoignage <span className="text-error-500">*</span>
        </Label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Partagez votre expérience avec Ascendys Connect..."
          rows={5}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.content}</p>
        )}
      </div>

      {/* Rating */}
      <div>
        <RatingInput
          label="Note"
          value={formData.rating}
          onChange={(rating) => handleChange("rating", rating)}
          disabled={isLoading}
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.rating}</p>
        )}
      </div>

      {/* Client Photo */}
      <div>
        <ImageUploader
          label="Photo du client"
          value={photoPreview || undefined}
          onChange={handlePhotoChange}
          accept="image/jpeg,image/png,image/webp"
          maxSizeMB={2}
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
          {isLoading ? "Création..." : "Ajouter le témoignage"}
        </Button>
      </div>
    </form>
  );
}
