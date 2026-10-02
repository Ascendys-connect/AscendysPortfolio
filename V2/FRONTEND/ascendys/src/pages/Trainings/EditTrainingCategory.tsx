import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ImageUploader from "@/components/form/ImageUploader";
import Button from "@/components/ui/button/Button";
import { useToast } from "@/context/ToastContext";
import { apiService } from "@/services/api.service";

export default function EditTrainingCategory() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>("");

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      
      setIsFetching(true);
      try {
        const response = await apiService.get(`/trainings/categories/${slug}/`);
        const category = response.data;
        
        setFormData({
          name: category.name,
          description: category.description,
          is_active: category.is_active,
        });
        
        if (category.image) {
          setExistingImage(category.image);
          setImagePreview(category.image);
        }
      } catch (error: any) {
        showError(
          "Erreur",
          error.response?.data?.message || "Impossible de charger la catégorie"
        );
        navigate("/admin/trainings/categories");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [slug, navigate, showError]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (existingImage) {
      setImagePreview(existingImage);
    } else {
      setImagePreview("");
    }
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      showError("Erreur de validation", "Le nom est requis");
      return false;
    }

    if (!formData.description.trim()) {
      showError("Erreur de validation", "La description est requise");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("is_active", formData.is_active.toString());

      if (image) {
        submitData.append("image", image);
      }

      await apiService.patch(`/trainings/categories/${slug}/`, submitData);

      showSuccess(
        "Catégorie mise à jour",
        "La catégorie a été mise à jour avec succès"
      );
      navigate("/admin/trainings/categories");
    } catch (error: any) {
      showError(
        "Erreur de mise à jour",
        error.response?.data?.message || error.message || "Impossible de mettre à jour la catégorie"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <svg
            className="size-8 animate-spin text-brand-600"
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
          <span className="text-lg text-gray-600 dark:text-gray-400">
            Chargement...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Modifier une catégorie | Ascendys Connect"
        description="Modifiez une catégorie de formation"
      />

      <PageHeader
        title="Modifier une catégorie de formation"
        description="Modifiez les informations de la catégorie"
        breadcrumbs={[
          { label: "Formations", path: "/admin/trainings" },
          { label: "Catégories", path: "/admin/trainings/categories" },
          { label: "Modifier" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <Label required>Nom de la catégorie</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Développement Web"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label required>Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Décrivez cette catégorie de formation..."
              disabled={isLoading}
              rows={4}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Image */}
          <div>
            <Label>Image de la catégorie</Label>
            <ImageUploader
              onChange={handleImageChange}
              preview={imagePreview}
              disabled={isLoading}
            />
            {existingImage && !image && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Image actuelle affichée. Téléchargez une nouvelle image pour la remplacer.
              </p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              disabled={isLoading}
              className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <Label htmlFor="is_active" className="mb-0">
              Catégorie active
            </Label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/trainings/categories")}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg
                    className="me-2 size-4 animate-spin"
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
                  Mise à jour...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
