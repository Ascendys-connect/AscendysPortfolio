import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../config/routes';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon } from '@/icons';
import { useToast } from '@/context/ToastContext';

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError('Champs requis', 'Veuillez entrer votre adresse email');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Email invalide', 'Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      showSuccess(
        'Code envoyé',
        'Un code de réinitialisation a été envoyé à votre adresse email'
      );
      // Rediriger vers la page de vérification du code
      navigate(ROUTES.VERIFY_RESET_CODE, { state: { email } });
    } catch (err: any) {
      showError(
        'Erreur',
        err.response?.data?.message || 
        err.message ||
        'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <button
          onClick={() => navigate(ROUTES.SIGN_IN)}
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Retour à la connexion
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Mot de passe oublié ?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrez votre adresse email pour recevoir un code de réinitialisation
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Adresse email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
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
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le code'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
