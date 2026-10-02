import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { UserRole } from "@/types/auth.types";
import type { UserListItem, UpdateUserRoleData } from "@/types/user.types";

interface EditUserRoleFormProps {
  user: UserListItem;
  onSubmit: (data: UpdateUserRoleData) => Promise<void>;
  onCancel: () => void;
}

export default function EditUserRoleForm({
  user,
  onSubmit,
  onCancel,
}: EditUserRoleFormProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ role });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la modification."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: UserRole.ADMIN, label: "Administrateur" },
    { value: UserRole.EDITOR, label: "Éditeur" },
    { value: UserRole.SUPER_ADMIN, label: "Super Administrateur" },
  ];

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Accès complet à toutes les fonctionnalités";
      case UserRole.ADMIN:
        return "Peut gérer le contenu et publier";
      case UserRole.EDITOR:
        return "Peut créer du contenu en brouillon uniquement";
      default:
        return "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations en lecture seule */}
      <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </Label>
          <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prénom
            </Label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {user.first_name}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom
            </Label>
            <p className="mt-1 text-gray-900 dark:text-white">
              {user.last_name}
            </p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Statut
          </Label>
          <p className="mt-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user.is_active
                  ? "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400"
                  : "bg-error-50 text-error-700 dark:bg-error-950/30 dark:text-error-400"
              }`}
            >
              {user.is_active ? "Actif" : "Suspendu"}
            </span>
          </p>
        </div>
      </div>

      {/* Champ modifiable: Rôle */}
      <div>
        <Label htmlFor="role" required>
          Rôle
        </Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          required
          className="mt-1.5 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pe-11 text-sm shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          {roleOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="dark:bg-gray-900"
            >
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {getRoleDescription(role)}
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-lg bg-error-50 p-4 dark:bg-error-950/30">
          <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || role === user.role}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
