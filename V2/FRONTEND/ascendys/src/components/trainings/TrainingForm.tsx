import { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ImageUploader from "@/components/form/ImageUploader";
import Button from "@/components/ui/button/Button";
import { useToast } from "@/context/ToastContext";
import { useApi } from "@/hooks/useApi";
import { usePermissions } from "@/hooks/usePermissions";

interface TrainingCategory {
  id: number;
  name: string;
  slug: string;
}

interface TrainingFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export default function TrainingForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: TrainingFormProps) {
  const { showError } = useToast();
  const { isEditor, canPublish } = usePermissions();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  const { data: categories } = useApi<TrainingCategory[]>("/trainings/categories/", {
    defaultValue: [],
  });

  const [formData, setFormData] = useState({
    // Basic Info
    title: initialData?.title || "",
    short_description: initialData?.short_description || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    
    // Details
    objectives: initialData?.objectives || [""],
    prerequisites: initialData?.prerequisites || [""],
    target_audience: initialData?.target_audience || "",
    syllabus: initialData?.syllabus || [""],
    
    // Duration & Level
    duration: initialData?.duration || "",
    level: initialData?.level || "BEGINNER",
    
    // Pricing
    price: initialData?.price || "0",
    currency: initialData?.currency || "XOF",
    
    // Schedule
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    
    // Location & Mode
    location: initialData?.location || "",
    training_mode: initialData?.training_mode || "ONLINE",
    
    // Capacity & Certification
    capacity: initialData?.capacity || "",
    certification: initialData?.certification || false,
    
    // Status
    status: initialData?.status || "DRAFT",
    is_featured: initialData?.is_featured || false,
  });

  const [images, setImages] = useState<{
    image: File | null;
    banner: File | null;
  }>({
    image: null,
    banner: null,
  });

  const [imagePreviews, setImagePreviews] = useState<{
    image: string | null;
    banner: string | null;
  }>({
    image: initialData?.image || null,
    banner: initialData?.banner || null,
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        description: initialData.description || "",
        category: initialData.category || "",
        objectives: initialData.objectives || [""],
        prerequisites: initialData.prerequisites || [""],
        target_audience: initialData.target_audience || "",
        syllabus: initialData.syllabus || [""],
        duration: initialData.duration || "",
        level: initialData.level || "BEGINNER",
        price: initialData.price || "0",
        currency: initialData.currency || "XOF",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        location: initialData.location || "",
        training_mode: initialData.training_mode || "ONLINE",
        capacity: initialData.capacity || "",
        certification: initialData.certification || false,
        status: initialData.status || "DRAFT",
        is_featured: initialData.is_featured || false,
      });
      
      setImagePreviews({
        image: initialData.image || null,
        banner: initialData.banner || null,
      });
    }
  }, [initialData, isEditing]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const handleAddArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ""],
    }));
  };

  const handleRemoveArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (field: "image" | "banner", file: File | null) => {
    setImages((prev) => ({ ...prev, [field]: file }));
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = (): boolean => {
    // Basic Information
    if (!formData.title.trim()) {
      showError("Erreur de validation", "Le titre est requis");
      return false;
    }
    if (!formData.short_description.trim()) {
      showError("Erreur de validation", "La description courte est requise");
      return false;
    }
    if (!formData.description.trim()) {
      showError("Erreur de validation", "La description complète est requise");
      return false;
    }
    if (!formData.category) {
      showError("Erreur de validation", "La catégorie est requise");
      return false;
    }
    
    // Image de couverture requise
    if (!isEditing && !images.image && !imagePreviews.image) {
      showError("Erreur de validation", "L'image de couverture est requise");
      return false;
    }
    
    // Details
    const validObjectives = formData.objectives.filter(o => o.trim());
    if (validObjectives.length === 0) {
      showError("Erreur de validation", "Au moins un objectif est requis");
      return false;
    }
    
    const validPrerequisites = formData.prerequisites.filter(p => p.trim());
    if (validPrerequisites.length === 0) {
      showError("Erreur de validation", "Au moins un prérequis est requis");
      return false;
    }
    
    if (!formData.target_audience.trim()) {
      showError("Erreur de validation", "Le public cible est requis");
      return false;
    }
    
    const validSyllabus = formData.syllabus.filter(s => s.trim());
    if (validSyllabus.length === 0) {
      showError("Erreur de validation", "Le programme (syllabus) est requis");
      return false;
    }
    
    // Duration & Level
    if (!formData.duration.trim()) {
      showError("Erreur de validation", "La durée est requise");
      return false;
    }
    
    // Schedule
    if (!formData.start_date) {
      showError("Erreur de validation", "La date de début est requise");
      return false;
    }
    if (!formData.end_date) {
      showError("Erreur de validation", "La date de fin est requise");
      return false;
    }
    
    // Validate dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (startDate < today) {
      showError("Erreur de validation", "La date de début ne peut pas être antérieure à aujourd'hui");
      return false;
    }
    
    if (endDate < startDate) {
      showError("Erreur de validation", "La date de fin doit être postérieure à la date de début");
      return false;
    }
    
    // Location
    if (!formData.location.trim()) {
      showError("Erreur de validation", "Le lieu est requis");
      return false;
    }
    
    // Capacity
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      showError("Erreur de validation", "La capacité doit être supérieure à 0");
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
      
      // Force DRAFT status for editors on creation
      const finalFormData = { ...formData };
      if (isEditor && !isEditing) {
        finalFormData.status = "DRAFT";
      }
      
      // Basic fields
      Object.entries(finalFormData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value.filter(v => v.trim())));
        } else if (typeof value === 'boolean') {
          submitData.append(key, value.toString());
        } else if (value !== null && value !== '') {
          submitData.append(key, value.toString());
        }
      });

      // Images
      if (images.image) submitData.append('image', images.image);
      if (images.banner) submitData.append('banner', images.banner);

      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Informations de base" },
    { id: "details", label: "Détails" },
    { id: "schedule", label: "Planning & Lieu" },
    { id: "media", label: "Médias" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div>
              <Label>
                Titre <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ex: Formation complète en Python"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>
                Description courte <span className="text-error-500">*</span>
              </Label>
              <textarea
                value={formData.short_description}
                onChange={(e) => handleChange("short_description", e.target.value)}
                placeholder="Résumé de la formation (300 caractères max)"
                maxLength={300}
                rows={3}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.short_description.length}/300 caractères
              </p>
            </div>

            <div>
              <Label>
                Description complète <span className="text-error-500">*</span>
              </Label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description détaillée de la formation..."
                rows={6}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>
                  Catégorie <span className="text-error-500">*</span>
                </Label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>
                  Niveau <span className="text-error-500">*</span>
                </Label>
                <select
                  value={formData.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <Label>
                  Durée <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="Ex: 40 heures, 5 jours"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>
                  Prix <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>Devise</Label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>Statut</Label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  disabled={isLoading || (isEditor && !isEditing)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="DRAFT">Brouillon</option>
                  {canPublish && <option value="PUBLISHED">Publié</option>}
                  <option value="ARCHIVED">Archivé</option>
                </select>
                {isEditor && !isEditing && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Les éditeurs ne peuvent créer que des brouillons. Un administrateur devra publier la formation.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleChange("is_featured", e.target.checked)}
                  disabled={isLoading}
                  className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Label htmlFor="is_featured" className="mb-0">
                  Formation mise en avant
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div>
              <Label>
                Objectifs de la formation <span className="text-error-500">*</span>
              </Label>
              {formData.objectives.map((obj, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <Input
                    type="text"
                    value={obj}
                    onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
                    placeholder={`Objectif ${index + 1}`}
                    required
                    disabled={isLoading}
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveArrayItem("objectives", index)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("objectives")}
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className="mt-2"
              >
                + Ajouter un objectif
              </Button>
            </div>

            <div>
              <Label>
                Prérequis <span className="text-error-500">*</span>
              </Label>
              {formData.prerequisites.map((prereq, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <Input
                    type="text"
                    value={prereq}
                    onChange={(e) => handleArrayChange("prerequisites", index, e.target.value)}
                    placeholder={`Prérequis ${index + 1}`}
                    required
                    disabled={isLoading}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveArrayItem("prerequisites", index)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("prerequisites")}
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className="mt-2"
              >
                + Ajouter un prérequis
              </Button>
            </div>

            <div>
              <Label>
                Public cible <span className="text-error-500">*</span>
              </Label>
              <textarea
                value={formData.target_audience}
                onChange={(e) => handleChange("target_audience", e.target.value)}
                placeholder="À qui s'adresse cette formation ?"
                rows={3}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <Label>
                Programme / Syllabus <span className="text-error-500">*</span>
              </Label>
              {formData.syllabus.map((item, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <Input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange("syllabus", index, e.target.value)}
                    placeholder={`Module ${index + 1}`}
                    required
                    disabled={isLoading}
                  />
                  {formData.syllabus.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveArrayItem("syllabus", index)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAddArrayItem("syllabus")}
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className="mt-2"
              >
                + Ajouter un module
              </Button>
            </div>
          </div>
        )}

        {/* Schedule & Location Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>
                  Date de début <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange("start_date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>
                  Date de fin <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange("end_date", e.target.value)}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label>
                Mode de formation <span className="text-error-500">*</span>
              </Label>
              <select
                value={formData.training_mode}
                onChange={(e) => handleChange("training_mode", e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="ONLINE">En ligne</option>
                <option value="ONSITE">Présentiel</option>
                <option value="HYBRID">Hybride</option>
              </select>
            </div>

            <div>
              <Label>
                Lieu <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Ex: Lomé, Togo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label>
                  Capacité (nombre de places) <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", e.target.value)}
                  placeholder="Ex: 20"
                  min="1"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-3 pt-7">
                <input
                  type="checkbox"
                  id="certification"
                  checked={formData.certification}
                  onChange={(e) => handleChange("certification", e.target.checked)}
                  disabled={isLoading}
                  className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <Label htmlFor="certification" className="mb-0">
                  Certification délivrée
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div>
              <ImageUploader
                label="Image de couverture"
                value={imagePreviews.image || undefined}
                onImageSelect={(file) => handleImageChange("image", file)}
                maxSizeMB={5}
              />
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                * Champ requis
              </p>
            </div>

            <div>
              <ImageUploader
                label="Bannière (optionnel)"
                value={imagePreviews.banner || undefined}
                onImageSelect={(file) => handleImageChange("banner", file)}
                maxSizeMB={5}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
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
              {isEditing ? "Mise à jour..." : "Création..."}
            </span>
          ) : (
            isEditing ? "Mettre à jour" : "Créer la formation"
          )}
        </Button>
      </div>
    </form>
  );
}
