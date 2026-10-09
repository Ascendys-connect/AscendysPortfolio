/**
 * Formulaire d'inscription à une formation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { E164Number } from 'libphonenumber-js/core';
import { enrollmentsService } from '@/services/enrollments.service';
import type { EnrollmentFormData, EducationLevel } from '@/types/enrollment.types';
import { EDUCATION_LEVELS } from '@/types/enrollment.types';

interface EnrollmentFormProps {
  trainingId?: string;
  trainingTitle?: string;
  onSuccess?: (enrollmentId: string) => void;
}

export default function EnrollmentForm({ 
  trainingId, 
  trainingTitle,
  onSuccess 
}: EnrollmentFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EnrollmentFormData>({
    training: trainingId || '',
    full_name: '',
    email: '',
    phone: '' as E164Number | '',
    education_level: 'BACHELOR',
    education_level_other: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser l'erreur
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation côté client
      if (!formData.training) {
        throw new Error('Veuillez sélectionner une formation');
      }
      
      if (!formData.full_name || formData.full_name.trim().length < 3) {
        throw new Error('Veuillez entrer votre nom complet (minimum 3 caractères)');
      }
      
      if (!formData.email || !formData.email.includes('@')) {
        throw new Error('Veuillez entrer un email valide');
      }
      
      if (!formData.phone || String(formData.phone).length < 8) {
        throw new Error('Veuillez entrer un numéro de téléphone valide');
      }
      
      if (formData.education_level === 'OTHER' && !formData.education_level_other) {
        throw new Error('Veuillez préciser votre niveau d\'études');
      }

      // Créer l'inscription
      const enrollment = await enrollmentsService.create(formData);

      // Rediriger vers la page de paiement
      if (onSuccess) {
        onSuccess(enrollment.id);
      } else {
        navigate(`/payment/${enrollment.id}`);
      }

    } catch (err: any) {
      console.error('Erreur inscription:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Une erreur est survenue lors de l\'inscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {trainingTitle && (
        <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/30">
          <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
            Formation sélectionnée
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-600 dark:text-brand-400">
            {trainingTitle}
          </p>
        </div>
      )}

      {/* Nom complet */}
      <div>
        <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Ex: Jean Dupont"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="exemple@email.com"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Numéro de téléphone <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          international
          defaultCountry="TG"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Niveau d'études */}
      <div>
        <label htmlFor="education_level" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Niveau d'études <span className="text-red-500">*</span>
        </label>
        <select
          id="education_level"
          name="education_level"
          value={formData.education_level}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          {EDUCATION_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Champ conditionnel "Autre" */}
      {formData.education_level === 'OTHER' && (
        <div>
          <label htmlFor="education_level_other" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Précisez votre niveau <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="education_level_other"
            name="education_level_other"
            value={formData.education_level_other}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Précisez votre niveau d'études"
          />
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Inscription en cours...
          </span>
        ) : (
          'S\'inscrire et procéder au paiement'
        )}
      </button>
    </form>
  );
}
