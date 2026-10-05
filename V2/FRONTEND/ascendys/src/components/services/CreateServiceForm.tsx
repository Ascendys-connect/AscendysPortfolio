import { useState } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ImageUploader from "@/components/form/ImageUploader";

interface CreateServiceFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function CreateServiceForm({
  onSubmit,
  onCancel,
}: CreateServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: null as File | null,
    is_featured: false,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    } else if (formData.description.length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("is_featured", formData.is_featured.toString());
      submitData.append("is_active", formData.is_active.toString());
      
      if (formData.icon) {
        submitData.append("icon", formData.icon);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <Label htmlFor="title" required>
          Titre du service
        </Label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Accompagnement stratégique"
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-error-600 dark:text-error-400">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Décrivez le service..."
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-error-600 dark:text-error-400">
            {errors.description}
          </p>
        )}
      </div>

      {/* Icon */}
      <div>
        <Label htmlFor="icon">Icône du service</Label>
        <ImageUploader
          onImageSelect={(file) => setFormData({ ...formData, icon: file })}
          maxSizeMB={2}
          accept="image/svg+xml,image/png,image/jpeg"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Formats acceptés : SVG, PNG, JPEG. Taille max : 2MB
        </p>
      </div>



      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData({ ...formData, is_featured: e.target.checked })
            }
            className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Service à la une
          </span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Service actif
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer le service"}
        </Button>
      </div>
    </Form>
  );
}
