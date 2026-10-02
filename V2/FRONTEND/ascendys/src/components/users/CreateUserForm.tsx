import { useState, type FormEvent } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import PhoneInput from "@/components/form/input/PhoneInput";
import Button from "@/components/ui/button/Button";
import { UserRole } from "@/types/auth.types";
import type { CreateUserData } from "@/types/user.types";
import { EyeIcon, EyeCloseIcon } from "@/icons";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserData) => Promise<void>;
  onCancel: () => void;
}

export default function CreateUserForm({ onSubmit, onCancel }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    role: UserRole.EDITOR,
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Le prénom est requis";
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = "Le prénom doit contenir au moins 2 caractères";
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Le nom est requis";
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = "Le nom doit contenir au moins 2 caractères";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!isPhoneValid) {
      newErrors.phone = "Le numéro de téléphone n'est pas valide";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une lettre minuscule";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une lettre majuscule";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
    }

    // Password confirmation validation
    if (!formData.password_confirm) {
      newErrors.password_confirm = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Les mots de passe ne correspondent pas";
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
    setErrors({}); // Clear previous errors
    setGeneralError(""); // Clear general error
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Handle network errors (backend not responding)
      if (error.response?.status === 0 || !error.response) {
        setGeneralError(
          error.message || 
          "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard."
        );
        return;
      }
      
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors: Record<string, string> = {};
        const errorData = error.response.data.errors;
        
        // Map backend errors to form fields
        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            backendErrors[key] = errorData[key][0];
          } else {
            backendErrors[key] = errorData[key];
          }
        });
        
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        // Handle general error messages from backend
        setGeneralError(error.response.data.message);
      } else {
        // Fallback generic error
        setGeneralError("Une erreur est survenue lors de la création de l'utilisateur.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* General Error Message */}
      {generalError && (
        <div className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-950/30">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 size-5 shrink-0 text-error-600 dark:text-error-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-error-800 dark:text-error-300">
                Erreur
              </h4>
              <p className="mt-1 text-sm text-error-700 dark:text-error-400">
                {generalError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGeneralError("")}
              className="shrink-0 text-error-400 transition hover:text-error-600 dark:hover:text-error-300"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-5 rounded-lg border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Informations personnelles
        </h3>

        {/* Name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label>
              Prénom <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="Jean"
              disabled={isLoading}
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.first_name}
              </p>
            )}
          </div>
          <div>
            <Label>
              Nom <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Dupont"
              disabled={isLoading}
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {errors.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <Label>
            Email <span className="text-error-500">*</span>
          </Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="jean.dupont@ascendysconnect.com"
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label>
            Téléphone <span className="text-error-500">*</span>
          </Label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            onValidationChange={setIsPhoneValid}
            disabled={isLoading}
            required={true}
            defaultCountry="TG"
            placeholder="Ex: +228 90 12 34 56"
            error={errors.phone}
          />
        </div>
      </div>

      {/* Account Information Section */}
      <div className="space-y-5 rounded-lg border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Informations du compte
        </h3>

        {/* Role */}
        <div>
          <Label>
            Rôle <span className="text-error-500">*</span>
          </Label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value as UserRole)}
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Sélectionner un rôle</option>
            <option value={UserRole.EDITOR}>Éditeur</option>
            <option value={UserRole.ADMIN}>Administrateur</option>
            <option value={UserRole.SUPER_ADMIN}>Super Administrateur</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.role}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.role === UserRole.EDITOR && "Peut créer du contenu (brouillons uniquement)"}
            {formData.role === UserRole.ADMIN && "Peut gérer le contenu et publier"}
            {formData.role === UserRole.SUPER_ADMIN && "Accès complet à toutes les fonctionnalités"}
            {!formData.role && "Sélectionnez le niveau d'accès pour cet utilisateur"}
          </p>
        </div>

        {/* Password */}
        <div>
          <Label>
            Mot de passe <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.password}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Au moins 8 caractères avec majuscule, minuscule et chiffre
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <Label>
            Confirmer le mot de passe <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.password_confirm}
              onChange={(e) => handleChange("password_confirm", e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              ) : (
                <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
              )}
            </button>
          </div>
          {errors.password_confirm && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              {errors.password_confirm}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
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
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="size-4 animate-spin"
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
              Création en cours...
            </span>
          ) : (
            "Créer l'utilisateur"
          )}
        </Button>
      </div>
    </form>
  );
}
