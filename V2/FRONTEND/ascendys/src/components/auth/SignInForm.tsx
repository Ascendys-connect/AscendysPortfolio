import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";

export default function SignInForm() {
  const { login } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Afficher le message de succès si venant de la réinitialisation du mot de passe
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      showSuccess("Succès", message);
      // Nettoyer le state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showSuccess]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation des champs
    if (!email || !password) {
      showError(
        "Champs requis", 
        "Veuillez remplir votre email et votre mot de passe."
      );
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(
        "Email invalide", 
        "Veuillez entrer une adresse email valide."
      );
      return;
    }

    setIsLoading(true);

    try {
      const credentials = { email, password };
      await login(credentials);
      
      // Message de succès
      showSuccess(
        "Connexion réussie", 
        `Bienvenue ! Vous êtes maintenant connecté.`
      );
      
      // La navigation est gérée par AuthContext
    } catch (err: any) {
      // Extract response data (handle both wrapped and unwrapped formats)
      const responseData = err.response?.data || {};
      
      // Check if OTP verification is required
      // Handle both formats: requires_otp: true and requires_otp: [true] or ["True"]
      const requiresOtp = responseData.requires_otp === true || 
                         (Array.isArray(responseData.requires_otp) && 
                          (responseData.requires_otp[0] === true || responseData.requires_otp[0] === 'True' || responseData.requires_otp[0] === 'true'));
      
      if (requiresOtp) {
        const userEmail = Array.isArray(responseData.email) ? responseData.email[0] : responseData.email;
        showInfo(
          "Vérification requise",
          "Veuillez vérifier votre email avec le code OTP envoyé."
        );
        navigate(`/verify-otp?email=${encodeURIComponent(userEmail || email)}`);
        return;
      }
      
      // Check if password change is required
      const requiresPasswordChange = responseData.requires_password_change === true ||
                                    (Array.isArray(responseData.requires_password_change) && 
                                     (responseData.requires_password_change[0] === true || responseData.requires_password_change[0] === 'True' || responseData.requires_password_change[0] === 'true'));
      
      if (requiresPasswordChange) {
        const userEmail = Array.isArray(responseData.email) ? responseData.email[0] : responseData.email;
        showInfo(
          "Changement de mot de passe requis",
          "Vous devez changer votre mot de passe lors de votre première connexion."
        );
        navigate(`/change-password?email=${encodeURIComponent(userEmail || email)}`);
        return;
      }
      
      // Message d'erreur explicite
      showError(
        "Erreur de connexion", 
        err.message || "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Retour à l&apos;accueil
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre email et mot de passe pour vous connecter
            </p>
          </div>
          
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="admin@ascendysconnect.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={rememberMe}
                      onChange={setRememberMe}
                      disabled={isLoading}
                    />
                    <span className="block text-theme-sm font-normal text-gray-700 dark:text-gray-400">
                      Se souvenir de moi
                    </span>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-error-600 hover:text-error-700 dark:text-error-500 dark:hover:text-error-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
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
                        Connexion en cours...
                      </span>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-500 dark:text-gray-400">
                Plateforme d&apos;administration Ascendys Connect
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
