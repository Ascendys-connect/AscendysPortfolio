import { useState, useEffect } from "react";
import { type OfferFormData } from "@/services/offers.service";
import { useToast } from "@/context/ToastContext";
import ImageUploader from "@/components/form/ImageUploader";

interface OfferFormProps {
  initialData?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData) => void;
  loading?: boolean;
}

const TYPE_CHOICES = [
  { value: 'RECRUITMENT', label: 'Recrutement / Emploi' },
  { value: 'TRAINING', label: 'Formation' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'EVENT', label: 'Événement' },
  { value: 'ANNOUNCEMENT', label: 'Annonce' },
  { value: 'OTHER', label: 'Autre' },
];

export default function OfferForm({ initialData, onSubmit, loading }: OfferFormProps) {
  const { showError } = useToast();
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    short_description: "",
    description: "",
    image: null,
    banner: null,
    type: "RECRUITMENT",
    start_date: "",
    end_date: "",
    status: "DRAFT",
    is_featured: false,
    ...initialData,
  });

  // Track field-level errors
  const [errors, setErrors] = useState<{
    start_date?: string;
    end_date?: string;
    image?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const hasImage = (): boolean => {
    const img = formData.image;
    const ban = formData.banner;
    return !!(img && img !== "") || !!(ban && ban !== "");
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.start_date) {
      newErrors.start_date = "La date de début est obligatoire.";
    }
    if (!formData.end_date) {
      newErrors.end_date = "La date de fin est obligatoire.";
    }
    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      newErrors.end_date = "La date de fin doit être postérieure à la date de début.";
    }
    if (!hasImage()) {
      newErrors.image = "Veuillez ajouter au moins une image ou une bannière.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showError(
        "Formulaire incomplet",
        Object.values(newErrors)[0]
      );
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full rounded-lg border px-4 py-2 text-gray-900 dark:bg-gray-800 dark:text-white ${
      hasError
        ? "border-error-500 focus:ring-error-300 dark:border-error-500"
        : "border-gray-200 dark:border-gray-800"
    }`;

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
              className={inputClass()}
            />
          </div>

          {/* Description courte */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Description courte <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              required
              maxLength={300}
              rows={3}
              className={inputClass()}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.short_description?.length || 0}/300 caractères</p>
          </div>

          {/* Description complète */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Description complète <span className="text-error-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={12}
              className={inputClass()}
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Type <span className="text-error-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className={inputClass()}
            >
              {TYPE_CHOICES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Date de début */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date de début <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => {
                setFormData({ ...formData, start_date: e.target.value });
                if (errors.start_date) setErrors(prev => ({ ...prev, start_date: undefined }));
              }}
              className={inputClass(errors.start_date)}
            />
            {errors.start_date && (
              <p className="mt-1 text-xs text-error-500">{errors.start_date}</p>
            )}
          </div>

          {/* Date de fin */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date de fin <span className="text-error-500">*</span>
            </label>
            <input
              type="date"
              value={formData.end_date}
              min={formData.start_date || undefined}
              onChange={(e) => {
                setFormData({ ...formData, end_date: e.target.value });
                if (errors.end_date) setErrors(prev => ({ ...prev, end_date: undefined }));
              }}
              className={inputClass(errors.end_date)}
            />
            {errors.end_date && (
              <p className="mt-1 text-xs text-error-500">{errors.end_date}</p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={inputClass()}
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
            <label htmlFor="is_featured" className="text-sm text-gray-900 dark:text-white">Offre en vedette</label>
          </div>

          {/* Image + Bannière — au moins une requise */}
          <div className={`rounded-lg p-3 ${errors.image ? "border border-error-500 bg-error-50 dark:bg-error-900/10" : ""}`}>
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Visuels <span className="text-error-500">*</span>
              <span className="ml-1 text-xs font-normal text-gray-500">(au moins une image ou bannière)</span>
            </p>

            {/* Image */}
            <div className="mb-3">
              <ImageUploader
                label="Image"
                currentImage={typeof formData.image === 'string' ? formData.image : undefined}
                onImageSelect={(file) => {
                  setFormData({ ...formData, image: file });
                  if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
                }}
              />
            </div>

            {/* Bannière */}
            <ImageUploader
              label="Bannière"
              currentImage={typeof formData.banner === 'string' ? formData.banner : undefined}
              onImageSelect={(file) => {
                setFormData({ ...formData, banner: file });
                if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
              }}
            />

            {errors.image && (
              <p className="mt-2 text-xs text-error-500">{errors.image}</p>
            )}
          </div>

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
