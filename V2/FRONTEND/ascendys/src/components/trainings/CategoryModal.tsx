import { useState, useEffect } from 'react';
import FormModal from '@/components/common/FormModal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useToast } from '@/context/ToastContext';
import { apiService } from '@/services/api.service';

interface TrainingCategory {
  id?: number;
  name: string;
  description: string;
  image?: string | null;
  is_active: boolean;
  order: number;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: TrainingCategory | null;
  onSuccess: () => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: CategoryModalProps) {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        order: category.order,
      });
      if (category.image) {
        setImagePreview(category.image);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        is_active: true,
        order: 0,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [category, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Erreur', 'Le nom de la catégorie est requis');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('is_active', formData.is_active.toString());
      submitData.append('order', formData.order.toString());

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (category?.id) {
        // Update existing category
        await apiService.put(`/trainings/categories/${category.id}/`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Succès', 'Catégorie mise à jour avec succès');
      } else {
        // Create new category
        await apiService.post('/trainings/categories/', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showSuccess('Succès', 'Catégorie créée avec succès');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      showError(
        'Erreur',
        error.response?.data?.message || 
        'Une erreur est survenue lors de l\'enregistrement'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Annuler
      </Button>
      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="size-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enregistrement...
          </span>
        ) : (
          category?.id ? 'Mettre à jour' : 'Créer'
        )}
      </Button>
    </div>
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={category?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      size="md"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>
            Nom de la catégorie <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Développement Web"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description de la catégorie..."
            rows={4}
            disabled={isSubmitting}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <Label>Image de la catégorie</Label>
          <div className="mt-2">
            {imagePreview && (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-500 file:me-4 file:rounded-lg file:border-0 file:bg-primary-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-700 dark:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            disabled={isSubmitting}
            className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <Label htmlFor="is_active" className="mb-0">
            Catégorie active (visible publiquement)
          </Label>
        </div>
      </form>
    </FormModal>
  );
}
