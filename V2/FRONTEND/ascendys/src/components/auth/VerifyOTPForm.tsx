import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useToast } from "@/context/ToastContext";
import { authService } from "@/services/auth.service";
import { ChevronLeftIcon } from "@/icons";
import { Link } from "react-router";

interface VerifyOTPFormProps {
  email: string;
}

export default function VerifyOTPForm({ email }: VerifyOTPFormProps) {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      showError("Code invalide", "Le code doit contenir 6 chiffres.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyOTP(email, code);
      showSuccess(
        "Code vérifié",
        "Veuillez maintenant créer votre nouveau mot de passe."
      );
      navigate(`/change-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      showError(
        "Erreur de vérification",
        err.message || "Code invalide ou expiré."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCount >= 3) {
      showError(
        "Limite atteinte",
        "Vous avez atteint la limite de renvoi. Contactez l'administrateur."
      );
      return;
    }

    setIsResending(true);

    try {
      const response = await authService.resendOTP(email);
      const remaining = response.data?.remaining_resends ?? (3 - resendCount - 1);
      
      setResendCount(prev => prev + 1);
      
      showInfo(
        "Code renvoyé",
        `Un nouveau code a été envoyé à votre email. (${remaining} renvoi(s) restant(s))`
      );
    } catch (err: any) {
      if (err.response?.status === 429) {
        showError(
          "Limite atteinte",
          "Vous avez atteint la limite de renvoi. Contactez l'administrateur."
        );
      } else {
        showError(
          "Erreur d'envoi",
          err.message || "Impossible de renvoyer le code."
        );
      }
    } finally {
      setIsResending(false);
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
              Vérification OTP
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Un code de vérification à 6 chiffres a été envoyé à{" "}
              <strong className="text-gray-700 dark:text-gray-300">{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="code">
                  Code de vérification <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="code"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(value);
                  }}
                  maxLength={6}
                  required
                  autoFocus
                  className="text-center text-2xl tracking-widest"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Le code est valable pendant 15 minutes
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Vérification...
                  </span>
                ) : (
                  "Vérifier le code"
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vous n&apos;avez pas reçu le code ?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || resendCount >= 3}
                    className="font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    {isResending ? "Envoi en cours..." : "Renvoyer le code"}
                  </button>
                </p>
                {resendCount > 0 && resendCount < 3 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {3 - resendCount} renvoi(s) restant(s)
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
