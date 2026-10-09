/**
 * Edit Profile Page — Design premium
 * L'utilisateur peut modifier prénom, nom, téléphone.
 * Email et rôle sont en lecture seule.
 */

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { authService } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageMeta from "@/components/common/PageMeta";
import PhoneInput from "@/components/form/input/PhoneInput";

// ── helpers ──────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, { en: string; fr: string }> = {
  SUPER_ADMIN: { en: "Super Admin",      fr: "Super Administrateur" },
  ADMIN:       { en: "Admin",            fr: "Administrateur" },
  EDITOR:      { en: "Editor",           fr: "Éditeur" },
  USER:        { en: "User",             fr: "Utilisateur" },
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/20",
  ADMIN:       "bg-brand-50  text-brand-700  ring-1 ring-brand-200  dark:bg-brand-500/10  dark:text-brand-300  dark:ring-brand-500/20",
  EDITOR:      "bg-blue-50   text-blue-700   ring-1 ring-blue-200   dark:bg-blue-500/10   dark:text-blue-300   dark:ring-blue-500/20",
  USER:        "bg-gray-100  text-gray-600   ring-1 ring-gray-200   dark:bg-white/5       dark:text-gray-300   dark:ring-white/10",
};

// ── icons ─────────────────────────────────────────────────────────────────────

function UserCircleIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
    </svg>
  );
}

// ── read-only field ────────────────────────────────────────────────────────────

function ReadOnlyField({
  id, label, value, icon,
}: {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        <span className="ml-0.5 inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:bg-white/5 dark:text-gray-500">
          <LockIcon />
          <span className="leading-none">verrouillé</span>
        </span>
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">{icon}</span>
        <input
          id={id}
          type="text"
          value={value}
          readOnly
          disabled
          className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50/80 py-2.5 pl-10 pr-4 text-sm text-gray-400 focus:outline-none dark:border-gray-700 dark:bg-white/3 dark:text-gray-500"
        />
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { i18n } = useTranslation();
  const lang = (i18n.language?.startsWith("fr") ? "fr" : "en") as "en" | "fr";

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName,  setLastName]  = useState(user?.last_name  || "");
  const [phone,     setPhone]     = useState<string>(user?.phone || "");
  const [isSaving,  setIsSaving]  = useState(false);
  const [isDirty,   setIsDirty]   = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name   || "");
      setPhone(user.phone          || "");
      setIsDirty(false);
    }
  }, [user]);

  // track dirtiness
  useEffect(() => {
    if (!user) return;
    const changed =
      firstName !== (user.first_name || "") ||
      lastName  !== (user.last_name  || "") ||
      phone     !== (user.phone      || "");
    setIsDirty(changed);
  }, [firstName, lastName, phone, user]);

  const handleReset = () => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name   || "");
      setPhone(user.phone          || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      showError("Validation", lang === "fr" ? "Le prénom et le nom sont requis." : "First name and last name are required.");
      return;
    }
    
    setIsSaving(true);
    try {
      const updateData = {
        first_name: firstName.trim(),
        last_name:  lastName.trim(),
        phone:      String(phone || "").trim(),
      };
      
      const response = await authService.updateProfile(updateData);
      if (response.success && response.data) {
        updateUser(response.data);
        showSuccess(
          lang === "fr" ? "Profil mis à jour" : "Profile updated",
          lang === "fr" ? "Vos informations ont été enregistrées." : "Your information has been saved."
        );
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (err: any) {
      showError(lang === "fr" ? "Erreur" : "Error", err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabel = user ? (ROLE_LABELS[user.role]?.[lang] ?? user.role) : "";
  const roleBadge = user ? (ROLE_COLORS[user.role] ?? ROLE_COLORS.USER) : "";
  const fullName  = user ? `${user.first_name} ${user.last_name}`.trim() : "";
  const initials  = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <>
      <PageMeta
        title={lang === "fr" ? "Modifier le profil | Ascendys Connect" : "Edit Profile | Ascendys Connect"}
        description=""
      />

      <div className="min-h-[calc(100vh-80px)] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">

          {/* ── Page title ── */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lang === "fr" ? "Mon profil" : "My Profile"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {lang === "fr"
                ? "Gérez vos informations personnelles et vos préférences."
                : "Manage your personal information and preferences."}
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* ── LEFT: Identity card ── */}
            <div className="flex flex-col gap-4">
              {/* Avatar card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                {/* gradient strip */}
                <div className="h-20 bg-gradient-to-br from-brand-600 via-brand-500 to-purple-500" />

                <div className="flex flex-col items-center px-5 pb-6">
                  {/* avatar */}
                  <div className="-mt-9 mb-3 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-brand-50 text-brand-600 shadow-md dark:border-gray-900 dark:bg-brand-500/10 dark:text-brand-400">
                    {initials
                      ? <span className="text-xl font-bold">{initials}</span>
                      : <UserCircleIcon size={40} />
                    }
                  </div>

                  <h2 className="text-center text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {fullName || "—"}
                  </h2>
                  <p className="mt-0.5 text-center text-xs text-gray-500 dark:text-gray-400 break-all">
                    {user?.email}
                  </p>

                  {/* role badge */}
                  {user?.role && (
                    <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge}`}>
                      {roleLabel}
                    </span>
                  )}
                </div>

                {/* status bar */}
                <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3 dark:border-gray-800">
                  <span className="h-2 w-2 rounded-full bg-success-500 shadow-[0_0_6px] shadow-success-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {lang === "fr" ? "Compte actif" : "Active account"}
                  </span>
                </div>
              </div>

              {/* Tips card */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-500/10 dark:bg-blue-500/5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  {lang === "fr" ? "À savoir" : "Info"}
                </p>
                <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                  {lang === "fr"
                    ? "L'adresse e-mail et le rôle ne peuvent être modifiés que par un administrateur."
                    : "Email address and role can only be changed by an administrator."}
                </p>
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              {/* form header */}
              <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {lang === "fr" ? "Informations personnelles" : "Personal Information"}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {lang === "fr"
                    ? "Modifiez vos informations ci-dessous."
                    : "Update your personal details below."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

                {/* First + Last name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-firstname" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {lang === "fr" ? "Prénom" : "First name"}
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="edit-firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={lang === "fr" ? "Votre prénom" : "Your first name"}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 transition-colors focus:border-brand-400 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-white/3 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-lastname" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {lang === "fr" ? "Nom de famille" : "Last name"}
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <input
                      id="edit-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={lang === "fr" ? "Votre nom" : "Your last name"}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 transition-colors focus:border-brand-400 focus:ring-3 focus:ring-brand-500/10 focus:outline-none dark:border-gray-700 dark:bg-white/3 dark:text-white dark:placeholder:text-white/30 dark:focus:border-brand-600"
                    />
                  </div>
                </div>

                {/* Email — read only */}
                <ReadOnlyField
                  id="edit-email"
                  label={lang === "fr" ? "Adresse e-mail" : "Email address"}
                  value={user?.email || ""}
                  icon={<MailIcon />}
                />

                {/* Phone */}
                <div>
                  <label htmlFor="edit-phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {lang === "fr" ? "Numéro de téléphone" : "Phone number"}
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder={lang === "fr" ? "Entrez votre numéro" : "Enter your number"}
                    defaultCountry="TG"
                  />
                </div>

                {/* Role — read only */}
                <ReadOnlyField
                  id="edit-role"
                  label={lang === "fr" ? "Rôle" : "Role"}
                  value={roleLabel}
                  icon={<ShieldIcon />}
                />

                {/* ── Footer actions ── */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                  {/* dirty indicator */}
                  <div>
                    {isDirty && (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        {lang === "fr" ? "Modifications non enregistrées" : "Unsaved changes"}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSaving || !isDirty}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/5"
                    >
                      {lang === "fr" ? "Annuler" : "Cancel"}
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving || !isDirty}
                      className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm shadow-brand-500/30"
                    >
                      {isSaving ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          {lang === "fr" ? "Enregistrement..." : "Saving..."}
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                          {lang === "fr" ? "Enregistrer" : "Save changes"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
