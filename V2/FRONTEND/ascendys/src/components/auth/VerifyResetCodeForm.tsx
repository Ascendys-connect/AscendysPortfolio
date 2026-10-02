import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../config/routes';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon } from '@/icons';
import { useToast } from '@/context/ToastContext';

export const VerifyResetCodeForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError, showInfo } = useToast();
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // Rediriger si pas d'email
  React.useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      showError('Champs requis', 'Veuillez entrer le code de vérification');
      return;
    }

    if (code.length !== 6) {
      showError('Code invalide', 'Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyResetCode(email, code);
      showSuccess('Code vérifié', 'Code valide');
      // Rediriger vers la page de réinitialisation du mot de passe
      navigate(ROUTES.RESET_PASSWORD, { state: { email, code } });
    } catch (err: any) {
      showError(
        'Code invalide',
        err.response?.data?.message || 
        err.message ||
        'Code invalide ou expiré. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCount >= 3) {
      showError(
        'Limite atteinte',
        'Nombre maximum de renvois atteint. Veuillez réessayer plus tard.'
      );
      return;
    }

    setIsResending(true);

    try {
      await authService.resendResetCode(email);
      setResendCount(resendCount + 1);
      showSuccess(
        'Code renvoyé',
        'Un nouveau code a été envoyé à votre adresse email'
      );
    } catch (err: any) {
      showError(
        'Erreur',
        err.response?.data?.message || 
        err.message ||
        'Impossible de renvoyer le code. Veuillez réessayer.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <button
          onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Modifier l&apos;email
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Vérification du code
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez le code à 6 chiffres envoyé à <strong>{email}</strong>
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Code de vérification <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest"
                    placeholder="000000"
                    disabled={isLoading}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Le code expire dans 15 minutes
                  </p>
                </div>

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
                      Vérification...
                    </span>
                  ) : (
                    'Vérifier le code'
                  )}
                </Button>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending || resendCount >= 3}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {isResending ? (
                      <span className="flex items-center">
                        <svg
                          className="size-4 animate-spin me-1"
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
                        Renvoi...
                      </span>
                    ) : (
                      `Renvoyer le code ${resendCount > 0 ? `(${3 - resendCount} restants)` : ''}`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
