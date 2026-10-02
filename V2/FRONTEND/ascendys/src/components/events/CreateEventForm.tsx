import { useState, type FormEvent } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import ImageUploader from "@/components/form/ImageUploader";

interface EventFormData {
  title: string;
  description: string;
  event_type: "WEBINAR" | "WORKSHOP" | "CONFERENCE" | "TRAINING" | "SEMINAR" | "MEETUP";
  start_date: string;
  end_date: string;
  location: string;
  max_attendees?: number;
  is_online: boolean;
  image?: File | null;
}

interface CreateEventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateEventForm({ onSubmit, onCancel }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_type: "WEBINAR",
    start_date: "",
    end_date: "",
    location: "",
    max_attendees: undefined,
    is_online: false,
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = "Le titre doit contenir au moins 5 caractères";
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "La description doit contenir au moins 10 caractères";
    }

    if (!formData.start_date) {
      newErrors.start_date = "La date de début est requise";
    }

    if (!formData.end_date) {
      newErrors.end_date = "La date de fin est requise";
    }

    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = "La date de fin doit être après la date de début";
    }

    if (!formData.location) {
      newErrors.location = "Le lieu est requis";
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
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(previewUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <Label>
          Titre de l'événement <span className="text-error-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Webinar Intelligence Artificielle"
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
          placeholder="Décrivez l'événement..."
          rows={4}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description}</p>
        )}
      </div>

      {/* Event Type */}
      <div>
        <Label>
          Type d'événement <span className="text-error-500">*</span>
        </Label>
        <select
          value={formData.event_type}
          onChange={(e) => handleChange("event_type", e.target.value)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="WEBINAR">Webinaire</option>
          <option value="WORKSHOP">Atelier</option>
          <option value="CONFERENCE">Conférence</option>
          <option value="TRAINING">Formation</option>
          <option value="SEMINAR">Séminaire</option>
          <option value="MEETUP">Rencontre</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label>
            Date de début <span className="text-error-500">*</span>
          </Label>
          <Input
            type="datetime-local"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            disabled={isLoading}
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.start_date}</p>
          )}
        </div>
        <div>
          <Label>
            Date de fin <span className="text-error-500">*</span>
          </Label>
          <Input
            type="datetime-local"
            value={formData.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            disabled={isLoading}
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.end_date}</p>
          )}
        </div>
      </div>

      {/* Location & Online */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label>
            Lieu <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Lomé, Togo"
            disabled={isLoading}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.location}</p>
          )}
        </div>
        <div>
          <Label>Nombre de places max</Label>
          <Input
            type="number"
            value={formData.max_attendees || ""}
            onChange={(e) => handleChange("max_attendees", e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Illimité"
            min="1"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Laissez vide pour illimité
          </p>
        </div>
      </div>

      {/* Is Online */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_online"
          checked={formData.is_online}
          onChange={(e) => handleChange("is_online", e.target.checked)}
          disabled={isLoading}
          className="size-4 rounded border-gray-300 text-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
        />
        <Label htmlFor="is_online" className="mb-0 cursor-pointer">
          Événement en ligne
        </Label>
      </div>

      {/* Image */}
      <div>
        <ImageUploader
          label="Image de l'événement"
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
          {isLoading ? "Création..." : "Créer l'événement"}
        </Button>
      </div>
    </form>
  );
}
