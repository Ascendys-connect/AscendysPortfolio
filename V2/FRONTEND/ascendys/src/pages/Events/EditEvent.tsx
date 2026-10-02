import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import EventConflictModal from "@/components/events/EventConflictModal";
import { useNavigate, useParams } from "react-router";
import { useApi } from "@/hooks/useApi";
import eventsService from "@/services/events.service";
import type { Event, EventFormData } from "@/types/content.types";
import ImageUploader from "@/components/form/ImageUploader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { EventTypeLabels } from "@/types/content.types";

export default function EditEvent() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [conflictingEvents, setConflictingEvents] = useState<Event[]>([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<EventFormData | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    event_type: "OTHER",
    start_datetime: "",
    end_datetime: "",
    registration_url: "",
    capacity: 50,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: allEvents } = useApi<Event[]>("/events/", { defaultValue: [] });

  const checkForConflicts = (data: EventFormData): Event[] => {
    const newStart = new Date(data.start_datetime);
    const newEnd = new Date(data.end_datetime);

    return allEvents.filter(evt => {
      // Skip the current event being edited
      if (evt.id === event?.id) return false;
      
      // Skip archived events
      if (evt.status === 'ARCHIVED') return false;

      const eventStart = new Date(evt.start_datetime);
      const eventEnd = new Date(evt.end_datetime);

      // Check for overlap
      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await eventsService.getBySlug(slug);
        const eventData = response.data;
        
        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            event_type: eventData.event_type,
            start_datetime: eventData.start_datetime?.slice(0, 16) || "",
            end_datetime: eventData.end_datetime?.slice(0, 16) || "",
            registration_url: eventData.registration_url || "",
            capacity: eventData.capacity,
            is_featured: eventData.is_featured,
          });
          setImagePreview(eventData.image || null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "capacity" ? Number(value) : value,
    }));

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

    if (formData.start_datetime && formData.end_datetime) {
      const startDate = new Date(formData.start_datetime);
      const endDate = new Date(formData.end_datetime);

      if (endDate <= startDate) {
        newErrors.end_datetime = "La date de fin doit être postérieure à la date de début";
      }
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "La capacité doit être d'au moins 1 personne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !slug) {
      return;
    }

    // Check for conflicts
    const conflicts = checkForConflicts(formData);
    
    if (conflicts.length > 0) {
      setPendingFormData(formData);
      setConflictingEvents(conflicts);
      setIsConflictModalOpen(true);
      return;
    }

    // No conflicts, proceed with update
    await updateEvent(formData);
  };

  const updateEvent = async (data: EventFormData) => {
    if (!slug) return;

    setIsSubmitting(true);

    try {
      const submitData: EventFormData = {
        ...data,
        image: imageFile || (imagePreview ? imagePreview : null),
      };

      await eventsService.update(slug, submitData);
      navigate("/admin/events");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmWithConflict = async () => {
    if (pendingFormData) {
      await updateEvent(pendingFormData);
      setPendingFormData(null);
      setConflictingEvents([]);
    }
  };

  const handleCancelConflict = () => {
    setIsConflictModalOpen(false);
    setPendingFormData(null);
    setConflictingEvents([]);
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-e-transparent"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-sm text-error-600 dark:text-error-400">
            Événement non trouvé
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Modifier ${event.title} | Ascendys Connect`}
        description="Modifier l'événement"
      />
      <PageHeader
        title="Modifier l'événement"
        description={`Modification de : ${event.title}`}
        breadcrumbs={[
          { label: "Événements", path: "/admin/events" },
          { label: "Modifier" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
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
                min={formData.start_datetime}
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
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="inline-block size-4 animate-spin rounded-full border-2 border-solid border-white border-e-transparent"></span>
                  Modification...
                </>
              ) : (
                "Modifier"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Conflict Modal */}
      <EventConflictModal
        isOpen={isConflictModalOpen}
        onClose={handleCancelConflict}
        conflictingEvents={conflictingEvents}
        onConfirm={handleConfirmWithConflict}
        onCancel={handleCancelConflict}
      />
    </>
  );
}
