import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useToast } from "@/context/ToastContext";
import { authService } from "@/services/auth.service";
import { ChevronLeftIcon, EyeIcon, EyeCloseIcon } from "@/icons";
import { Link } from "react-router";
import { ROUTES } from "@/config/routes";

interface ChangePasswordFormProps {
  email: string;
}

export default function ChangePasswordForm({ email }: ChangePasswordFormProps) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (): string | null => {
    if (newPassword.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/(?=.*[a-z])/.test(newPassword)) {
      return "Le mot de passe doit contenir au moins une lettre minuscule";
    }
    if (!/(?=.*[A-Z])/.test(newPassword)) {
      return "Le mot de passe doit contenir au moins une lettre majuscule";
    }
    if (!/(?=.*\d)/.test(newPassword)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    if (newPassword !== confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const error = validatePassword();
    if (error) {
      showError("Mot de passe invalide", error);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.firstLoginPasswordChange(email, newPassword, confirmPassword);
      
      // Check if response contains tokens (auto-login)
      if (response.data?.access && response.data?.user) {
        // Store tokens via authService (it handles localStorage)
        authService.setTokens(response.data.access, response.data.refresh);
        authService.setUser(response.data.user);
        
        showSuccess(
          "Bienvenue !",
          "Votre mot de passe a été changé et vous êtes maintenant connecté."
        );
        
        // Reload to reinitialize AuthContext with new auth state
        window.location.href = ROUTES.DASHBOARD;
      } else {
        // Fallback: redirect to signin
        showSuccess(
          "Mot de passe changé",
          "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
        );
        navigate("/signin");
      }
    } catch (err: any) {
      showError(
        "Erreur",
        err.message || "Impossible de changer le mot de passe."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Retour à la connexion
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Créez un mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="new_password">
                  Nouveau mot de passe <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeCloseIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <li>• Au moins 8 caractères</li>
                  <li>• Une lettre majuscule et une minuscule</li>
                  <li>• Au moins un chiffre</li>
                </ul>
              </div>

              <div>
                <Label htmlFor="confirm_password">
                  Confirmer le mot de passe <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeCloseIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
