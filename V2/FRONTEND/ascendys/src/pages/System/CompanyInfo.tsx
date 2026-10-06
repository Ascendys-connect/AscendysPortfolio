import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ImageUploader from "@/components/form/ImageUploader";
import PhoneInput from "@/components/form/input/PhoneInput";
import { companyService } from "@/services/company.service";
import { useToast } from "@/context/ToastContext";
import type { CompanyInfo } from "@/types/content.types";

export default function CompanyInfoPage() {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<CompanyInfo | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    email: "",
    whatsapp_number: "",
    website: "",
    address: "",
    city: "",
    country: "Côte d'Ivoire",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
    youtube_url: "",
  });

  // Multiple phone numbers with country code
  const [phones, setPhones] = useState<string[]>([""]);

  // Media files (optional)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing company data
  const loadCompanyData = async () => {
    setIsLoading(true);
    try {
      const data = await companyService.get();
      if (data) {
        setCompany(data);
        setFormData({
          name: data.name || "",
          tagline: data.tagline || data.slogan || "",
          description: data.description || data.short_description || "",
          email: data.email || "",
          whatsapp_number: data.whatsapp_number || data.social_links?.whatsapp || "",
          website: data.website || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "Côte d'Ivoire",
          facebook_url: data.facebook_url || data.social_links?.facebook || "",
          twitter_url: data.twitter_url || data.social_links?.twitter || "",
          linkedin_url: data.linkedin_url || data.social_links?.linkedin || "",
          instagram_url: data.instagram_url || data.social_links?.instagram || "",
          youtube_url: data.youtube_url || data.social_links?.youtube || "",
        });

        // Prefill phones
        if (Array.isArray(data.phones) && data.phones.length > 0) {
          setPhones(data.phones.filter(Boolean));
        } else if (data.phone) {
          setPhones([data.phone]);
        } else {
          setPhones([""]);
        }
      }
    } catch (err: any) {
      console.error("Erreur de chargement des informations :", err);
      showError("Erreur", "Impossible de charger les informations de l'entreprise.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, []);

  // Phone list management
  const handlePhoneChange = (index: number, val: string) => {
    setPhones(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    if (errors[`phone_${index}`]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[`phone_${index}`];
        return next;
      });
    }
  };

  const handleAddPhone = () => {
    setPhones(prev => [...prev, ""]);
  };

  const handleRemovePhone = (index: number) => {
    if (phones.length <= 1) return;
    setPhones(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => {
      const next = { ...prev };
      delete next[`phone_${index}`];
      return next;
    });
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Basic Info
    if (!formData.name.trim()) newErrors.name = "Le nom de l'entreprise est requis.";
    if (!formData.tagline.trim()) newErrors.tagline = "Le slogan est requis.";
    if (!formData.description.trim()) newErrors.description = "La description est requise.";

    // 2. Email
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }

    // 3. Phones (all added phone numbers must be non-empty)
    const validPhones = phones.map(p => p.trim()).filter(Boolean);
    if (validPhones.length === 0) {
      newErrors.phones = "Au moins un numéro de téléphone est requis.";
    }
    phones.forEach((phone, idx) => {
      if (!phone.trim()) {
        newErrors[`phone_${idx}`] = `Le numéro ${idx + 1} est requis.`;
      }
    });

    // 4. WhatsApp
    if (!formData.whatsapp_number.trim()) {
      newErrors.whatsapp_number = "Le numéro WhatsApp est requis.";
    }

    // 5. Contact & Address
    if (!formData.website.trim()) {
      newErrors.website = "Le site web est requis.";
    }
    if (!formData.address.trim()) newErrors.address = "L'adresse physique est requise.";
    if (!formData.city.trim()) newErrors.city = "La ville est requise.";
    if (!formData.country.trim()) newErrors.country = "Le pays est requis.";

    // 6. Social networks (all required per user request)
    if (!formData.facebook_url.trim()) newErrors.facebook_url = "Le lien Facebook est requis.";
    if (!formData.twitter_url.trim()) newErrors.twitter_url = "Le lien Twitter / X est requis.";
    if (!formData.linkedin_url.trim()) newErrors.linkedin_url = "Le lien LinkedIn est requis.";
    if (!formData.instagram_url.trim()) newErrors.instagram_url = "Le lien Instagram est requis.";
    if (!formData.youtube_url.trim()) newErrors.youtube_url = "Le lien YouTube est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Champs manquants", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSaving(true);

    try {
      const submitData = new FormData();
      const validPhones = phones.map(p => p.trim()).filter(Boolean);

      submitData.append("name", formData.name.trim());
      submitData.append("slogan", formData.tagline.trim());
      submitData.append("tagline", formData.tagline.trim());
      submitData.append("short_description", formData.description.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("email", formData.email.trim());

      // Phone numbers
      submitData.append("phones", JSON.stringify(validPhones));
      if (validPhones.length > 0) {
        submitData.append("phone", validPhones[0]);
      }

      submitData.append("whatsapp_number", formData.whatsapp_number.trim());
      submitData.append("website", formData.website.trim());
      submitData.append("address", formData.address.trim());
      submitData.append("city", formData.city.trim());
      submitData.append("country", formData.country.trim());

      // Social Links
      submitData.append("facebook_url", formData.facebook_url.trim());
      submitData.append("twitter_url", formData.twitter_url.trim());
      submitData.append("linkedin_url", formData.linkedin_url.trim());
      submitData.append("instagram_url", formData.instagram_url.trim());
      submitData.append("youtube_url", formData.youtube_url.trim());

      // Media files (optional)
      if (logoFile) {
        submitData.append("logo", logoFile);
      }
      if (faviconFile) {
        submitData.append("favicon", faviconFile);
      }

      const updated = await companyService.update(submitData);
      setCompany(updated);
      showSuccess("Enregistré avec succès", "Les informations de l'entreprise ont été mises à jour.");
      await loadCompanyData();
    } catch (error: any) {
      console.error("Error updating company info:", error);
      let detailError = error.response?.data?.message || error.message || "Impossible d'enregistrer les informations.";
      if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
        const errorList = Object.entries(error.response.data.errors)
          .map(([field, err]) => `${field}: ${Array.isArray(err) ? err.join(' ') : err}`)
          .join(' | ');
        if (errorList) detailError = errorList;
      }
      showError("Erreur d'enregistrement", detailError);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Chargement des informations...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Informations de l'entreprise | Ascendys Connect"
        description="Gérez les coordonnées et l'identité publique de l'entreprise"
      />

      <PageHeader
        title="Informations de l'entreprise"
        description="Modifiez l'identité publique, les coordonnées et les réseaux sociaux affichés sur le site"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Informations de base */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Identité de l'entreprise
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Informations principales visibles par vos visiteurs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name" required>
                Nom de l'entreprise
              </Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="Ex: Ascendys Connect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.name
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.name && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="tagline" required>
                Slogan
              </Label>
              <input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => {
                  setFormData({ ...formData, tagline: e.target.value });
                  if (errors.tagline) setErrors({ ...errors, tagline: "" });
                }}
                placeholder="Ex: Accélérateur d'opportunités et de talents"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.tagline
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.tagline && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.tagline}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description" required>
                Description courte
              </Label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                placeholder="Présentation générale de l'entreprise..."
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.description
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.description && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Coordonnées (avec plusieurs numéros et indicatifs) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Coordonnées & Téléphones
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Numéros de téléphone avec indicatif pays, email et adresse
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddPhone}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-900/50 dark:bg-brand-950/30 dark:text-brand-300 dark:hover:bg-brand-950/50"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un numéro
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Email */}
            <div>
              <Label htmlFor="email" required>
                Email de contact
              </Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="contact@ascendysconnect.com"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.email
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.email && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.email}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <Label htmlFor="whatsapp_number" required>
                Numéro WhatsApp
              </Label>
              <div className="mt-1.5">
                <PhoneInput
                  value={formData.whatsapp_number}
                  onChange={(val) => {
                    setFormData({ ...formData, whatsapp_number: val });
                    if (errors.whatsapp_number) setErrors({ ...errors, whatsapp_number: "" });
                  }}
                  defaultCountry="CI"
                  placeholder="Ex: +225 01 02 03 04 05"
                  required
                />
              </div>
              {errors.whatsapp_number && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.whatsapp_number}</p>}
            </div>

            {/* Multiple Phone Numbers with dial codes */}
            <div className="md:col-span-2 space-y-3">
              <Label required>
                Numéros de téléphone ({phones.length})
              </Label>
              {errors.phones && <p className="text-xs text-error-600 dark:text-error-400">{errors.phones}</p>}

              <div className="space-y-3">
                {phones.map((phone, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      #{index + 1}
                    </div>

                    <div className="flex-1">
                      <PhoneInput
                        value={phone}
                        onChange={(val) => handlePhoneChange(index, val)}
                        defaultCountry="CI"
                        placeholder="Ex: +225 07 08 09 10 11"
                        required
                        error={errors[`phone_${index}`]}
                      />
                    </div>

                    {phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(index)}
                        className="mt-1 rounded-xl p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-950/30 dark:hover:text-error-400"
                        title="Supprimer ce numéro"
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Site web */}
            <div>
              <Label htmlFor="website" required>
                Site web officiel
              </Label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value });
                  if (errors.website) setErrors({ ...errors, website: "" });
                }}
                placeholder="https://ascendysconnect.com"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.website
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.website && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.website}</p>}
            </div>

            {/* Adresse */}
            <div>
              <Label htmlFor="address" required>
                Adresse physique
              </Label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                placeholder="Ex: Cocody Angré 8ème Tranche"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.address
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.address && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.address}</p>}
            </div>

            {/* Ville */}
            <div>
              <Label htmlFor="city" required>
                Ville
              </Label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
                placeholder="Ex: Abidjan"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.city
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.city && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.city}</p>}
            </div>

            {/* Pays */}
            <div>
              <Label htmlFor="country" required>
                Pays
              </Label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => {
                  setFormData({ ...formData, country: e.target.value });
                  if (errors.country) setErrors({ ...errors, country: "" });
                }}
                placeholder="Ex: Côte d'Ivoire"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.country
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.country && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.country}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Réseaux Sociaux (Tous requis) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center gap-2.5 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Réseaux sociaux
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Liens officiels vers vos pages sur les réseaux
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="facebook_url" required>Facebook</Label>
              <input
                id="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => {
                  setFormData({ ...formData, facebook_url: e.target.value });
                  if (errors.facebook_url) setErrors({ ...errors, facebook_url: "" });
                }}
                placeholder="https://facebook.com/ascendysconnect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.facebook_url
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.facebook_url && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.facebook_url}</p>}
            </div>

            <div>
              <Label htmlFor="twitter_url" required>Twitter / X</Label>
              <input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => {
                  setFormData({ ...formData, twitter_url: e.target.value });
                  if (errors.twitter_url) setErrors({ ...errors, twitter_url: "" });
                }}
                placeholder="https://x.com/ascendysconnect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.twitter_url
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.twitter_url && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.twitter_url}</p>}
            </div>

            <div>
              <Label htmlFor="linkedin_url" required>LinkedIn</Label>
              <input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => {
                  setFormData({ ...formData, linkedin_url: e.target.value });
                  if (errors.linkedin_url) setErrors({ ...errors, linkedin_url: "" });
                }}
                placeholder="https://linkedin.com/company/ascendys-connect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.linkedin_url
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.linkedin_url && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.linkedin_url}</p>}
            </div>

            <div>
              <Label htmlFor="instagram_url" required>Instagram</Label>
              <input
                id="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => {
                  setFormData({ ...formData, instagram_url: e.target.value });
                  if (errors.instagram_url) setErrors({ ...errors, instagram_url: "" });
                }}
                placeholder="https://instagram.com/ascendysconnect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.instagram_url
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.instagram_url && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.instagram_url}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="youtube_url" required>YouTube</Label>
              <input
                id="youtube_url"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => {
                  setFormData({ ...formData, youtube_url: e.target.value });
                  if (errors.youtube_url) setErrors({ ...errors, youtube_url: "" });
                }}
                placeholder="https://youtube.com/@ascendysconnect"
                className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                  errors.youtube_url
                    ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                    : "border-gray-200 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700"
                }`}
                required
              />
              {errors.youtube_url && <p className="mt-1 text-xs text-error-600 dark:text-error-400">{errors.youtube_url}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Image de marque (Médias NON requis / Optionnels) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Médias & Image de marque
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Logo et Favicon <span className="font-medium text-gray-400">(Optionnels)</span>
                </p>
              </div>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Facultatif
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Logo officiel</Label>
                <span className="text-xs text-gray-400">Max. 2 MB (PNG, JPG, SVG, WEBP)</span>
              </div>
              <ImageUploader
                currentImage={company?.logo_url || company?.logo || undefined}
                onImageSelect={(file) => setLogoFile(file)}
                maxSizeMB={2}
                accept="image/*"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Favicon</Label>
                <span className="text-xs text-gray-400">Max. 1 MB (.ico, PNG)</span>
              </div>
              <ImageUploader
                currentImage={company?.favicon_url || company?.favicon || undefined}
                onImageSelect={(file) => setFaviconFile(file)}
                maxSizeMB={1}
                accept="image/x-icon,image/png,image/svg+xml"
              />
            </div>
          </div>
        </div>

        {/* Bouton d'enregistrement flottant / bas de page */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6"
          >
            {isSaving ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Enregistrer les modifications</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
