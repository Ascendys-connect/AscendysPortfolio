import { useState, useEffect } from "react";
import { type ServiceFormData } from "@/services/services.service";
import ImageUploader from "@/components/form/ImageUploader";

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => void;
  loading?: boolean;
}

export default function ServiceForm({ initialData, onSubmit, loading }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    short_description: "",
    icon: null,
    image: null,
    features: [],
    is_featured: false,
    is_active: true,
    ...initialData,
  });

  const [mediaError, setMediaError] = useState<string | null>(null);

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
    if (!formData.icon && !formData.image) {
      setMediaError("Vous devez obligatoirement fournir au moins une icône ou une image (soit l'une, soit l'autre, ou les deux).");
      return;
    }
    setMediaError(null);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Titre du service <span className="text-error-500">*</span>
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
              maxLength={200}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500">{formData.short_description?.length || 0}/200 caractères</p>
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
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* En vedette */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="size-4 rounded border-gray-300"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-900 dark:text-white">Service en vedette</label>
          </div>

          {/* Actif */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="size-4 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm text-gray-900 dark:text-white">Service actif</label>
          </div>

          {/* Section Médias obligatoires */}
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Visuels du service <span className="text-error-500">*</span>
              </span>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                Au moins 1 requis
              </span>
            </div>
            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
              Veuillez fournir une icône, une image ou les deux.
            </p>

            {mediaError && (
              <div className="mb-3 rounded-lg border border-error-300 bg-error-50 p-2.5 text-xs font-medium text-error-700 dark:border-error-800/60 dark:bg-error-950/40 dark:text-error-400">
                 {mediaError}
              </div>
            )}

            <div className="space-y-4">
              {/* Icône */}
              <ImageUploader
                label="Icône (SVG, PNG...)"
                currentImage={typeof formData.icon === 'string' ? formData.icon : undefined}
                onImageSelect={(file) => {
                  setFormData(prev => ({ ...prev, icon: file }));
                  if (file || formData.image) setMediaError(null);
                }}
              />

              {/* Image */}
              <ImageUploader
                label="Image de couverture"
                currentImage={typeof formData.image === 'string' ? formData.image : undefined}
                onImageSelect={(file) => {
                  setFormData(prev => ({ ...prev, image: file }));
                  if (file || formData.icon) setMediaError(null);
                }}
              />
            </div>
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
