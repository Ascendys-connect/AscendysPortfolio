import { useState, useEffect } from "react";
import { EventType, EventTypeLabels, type EventFormData } from "@/types/content.types";
import ImageUploader from "@/components/form/ImageUploader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

interface EventFormProps {
  initialData?: Partial<EventFormData> & { image?: string };
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    event_type: initialData?.event_type || EventType.OTHER,
    start_datetime: initialData?.start_datetime || "",
    end_datetime: initialData?.end_datetime || "",
    registration_url: initialData?.registration_url || "",
    capacity: initialData?.capacity || 50,
    is_featured: initialData?.is_featured || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof initialData?.image === "string" ? initialData.image : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DDTHH:mm format for min attribute
  const getTodayDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getTodayDateTime();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "capacity" ? Number(value) : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (errors.image) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Le lieu est requis";
    }

    if (!formData.start_datetime) {
      newErrors.start_datetime = "La date de début est requise";
    }

    if (!formData.end_datetime) {
      newErrors.end_datetime = "La date de fin est requise";
    }

    // Date validation
    if (formData.start_datetime && formData.end_datetime) {
      const startDate = new Date(formData.start_datetime);
      const endDate = new Date(formData.end_datetime);
      const now = new Date();

      // Check if start date is not in the past (only for new events)
      if (!isEditing && startDate < now) {
        newErrors.start_datetime = "La date de début ne peut pas être antérieure à aujourd'hui";
      }

      // Check if end date is after start date
      if (endDate <= startDate) {
        newErrors.end_datetime = "La date de fin doit être postérieure à la date de début";
      }
    }

    // Capacity validation
    if (formData.capacity < 1) {
      newErrors.capacity = "La capacité doit être d'au moins 1 personne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: EventFormData = {
        ...formData,
        image: imageFile || (imagePreview ? imagePreview : null),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title" required>
          Titre
        </Label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
            errors.title
              ? "border-error-500 focus:ring-error-500"
              : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
          }`}
          placeholder="Ex: Conférence annuelle 2025"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
            errors.description
              ? "border-error-500 focus:ring-error-500"
              : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
          }`}
          placeholder="Décrivez l'événement en détail..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.description}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <ImageUploader
          label="Image (optionnelle)"
          value={imagePreview || undefined}
          onImageSelect={handleImageChange}
          accept="image/jpeg,image/png,image/webp"
          maxSizeMB={5}
        />
        {errors.image && (
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.image}</p>
        )}
      </div>

      {/* Event Type and Location */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="event_type" required>
            Type d'événement
          </Label>
          <select
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {Object.entries(EventTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="location" required>
            Lieu
          </Label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.location
                ? "border-error-500 focus:ring-error-500"
                : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
            }`}
            placeholder="Ex: Lomé, Togo"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.location}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="start_datetime" required>
            Date et heure de début
          </Label>
          <input
            type="datetime-local"
            id="start_datetime"
            name="start_datetime"
            value={formData.start_datetime}
            onChange={handleChange}
            min={!isEditing ? minDateTime : undefined}
            required
            className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.start_datetime
                ? "border-error-500 focus:ring-error-500"
                : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
            }`}
          />
          {errors.start_datetime && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.start_datetime}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="end_datetime" required>
            Date et heure de fin
          </Label>
          <input
            type="datetime-local"
            id="end_datetime"
            name="end_datetime"
            value={formData.end_datetime}
            onChange={handleChange}
            min={formData.start_datetime || (!isEditing ? minDateTime : undefined)}
            required
            className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.end_datetime
                ? "border-error-500 focus:ring-error-500"
                : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
            }`}
          />
          {errors.end_datetime && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.end_datetime}
            </p>
          )}
        </div>
      </div>

      {/* Capacity and Registration URL */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="capacity" required>
            Capacité (nombre de participants)
          </Label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
            className={`w-full rounded-lg border px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.capacity
                ? "border-error-500 focus:ring-error-500"
                : "border-gray-300 focus:ring-brand-500 dark:border-gray-700"
            }`}
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">{errors.capacity}</p>
          )}
        </div>

        <div>
          <Label htmlFor="registration_url">
            URL d'inscription (optionnelle)
          </Label>
          <input
            type="url"
            id="registration_url"
            name="registration_url"
            value={formData.registration_url}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Is Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_featured"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleChange}
          className="size-4 rounded border-gray-300 text-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-gray-700"
        />
        <Label htmlFor="is_featured" className="mb-0">
          Mettre en avant cet événement
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-solid border-white border-e-transparent"></span>
              {isEditing ? "Modification..." : "Création..."}
            </>
          ) : (
            <>{isEditing ? "Modifier" : "Créer"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
