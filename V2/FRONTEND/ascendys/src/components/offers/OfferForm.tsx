import { useState, useEffect } from "react";
import { type OfferFormData } from "@/services/offers.service";
import ImageUploader from "@/components/form/ImageUploader";

interface OfferFormProps {
  initialData?: Partial<OfferFormData>;
  onSubmit: (data: OfferFormData) => void;
  loading?: boolean;
}

const TYPE_CHOICES = [
  { value: 'TRAINING', label: 'Formation' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'EVENT', label: 'Événement' },
  { value: 'RECRUITMENT', label: 'Recrutement' },
  { value: 'ANNOUNCEMENT', label: 'Annonce' },
  { value: 'OTHER', label: 'Autre' },
];

export default function OfferForm({ initialData, onSubmit, loading }: OfferFormProps) {
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    short_description: "",
    description: "",
    image: null,
    banner: null,
    type: "ANNOUNCEMENT",
    start_date: "",
    end_date: "",
    status: "DRAFT",
    is_featured: false,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
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
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            >
              {TYPE_CHOICES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Date de début</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Date de fin</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
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

          {/* Image */}
          <ImageUploader
            label="Image"
            currentImage={typeof formData.image === 'string' ? formData.image : undefined}
            onImageSelect={(file) => setFormData({ ...formData, image: file })}
          />

          {/* Bannière */}
          <ImageUploader
            label="Bannière"
            currentImage={typeof formData.banner === 'string' ? formData.banner : undefined}
            onImageSelect={(file) => setFormData({ ...formData, banner: file })}
          />

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
