import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../config/routes';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { EyeIcon, EyeCloseIcon, ChevronLeftIcon } from '@/icons';
import { useToast } from '@/context/ToastContext';

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  const email = location.state?.email || '';
  const code = location.state?.code || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger si pas d'email ou de code
  React.useEffect(() => {
    if (!email || !code) {
      navigate(ROUTES.FORGOT_PASSWORD);
    }
  }, [email, code, navigate]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showError('Mot de passe invalide', passwordErrors.join('. '));
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      // Le backend attend new_password et new_password_confirm
      await authService.resetPassword(email, code, newPassword, confirmPassword);
      showSuccess(
        'Succès',
        'Votre mot de passe a été réinitialisé avec succès'
      );
      // Rediriger vers la page de connexion
      navigate(ROUTES.SIGN_IN, { 
        state: { 
          message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' 
        } 
      });
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

  const passwordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon'][strength] || '';
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength] || 'bg-gray-300';

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
              Nouveau mot de passe
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Définissez votre nouveau mot de passe
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Nouveau mot de passe <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Force du mot de passe: <strong>{strengthLabel}</strong>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${strengthColor}`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center">
                      <span className={`size-3 me-1 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                      Au moins 8 caractères
                    </li>
                    <li className="flex items-center">
                      <span className={`size-3 me-1 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                      Une lettre majuscule
                    </li>
                    <li className="flex items-center">
                      <span className={`size-3 me-1 ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                      Une lettre minuscule
                    </li>
                    <li className="flex items-center">
                      <span className={`size-3 me-1 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'}`}>✓</span>
                      Un chiffre
                    </li>
                  </ul>
                </div>

                <div>
                  <Label>
                    Confirmer le mot de passe <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
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
                      Réinitialisation...
                    </span>
                  ) : (
                    'Réinitialiser le mot de passe'
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
