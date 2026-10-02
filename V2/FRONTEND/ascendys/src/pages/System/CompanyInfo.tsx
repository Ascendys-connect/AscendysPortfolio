import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ImageUploader from "@/components/form/ImageUploader";
import { useApi } from "@/hooks/useApi";
import { companyService } from "@/services/company.service";
import type { CompanyInfo } from "@/types/content.types";

export default function CompanyInfoPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: company, isLoading, refetch } = useApi<CompanyInfo>(
    "/company/info/",
    { defaultValue: null as any }
  );

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    website: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
    youtube_url: "",
    whatsapp_number: "",
    logo: null as File | null,
    favicon: null as File | null,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        tagline: company.tagline || "",
        description: company.description || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "",
        website: company.website || "",
        facebook_url: company.facebook_url || "",
        twitter_url: company.twitter_url || "",
        linkedin_url: company.linkedin_url || "",
        instagram_url: company.instagram_url || "",
        youtube_url: company.youtube_url || "",
        whatsapp_number: company.whatsapp_number || "",
        logo: null,
        favicon: null,
      });
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (value instanceof File) {
            submitData.append(key, value);
          } else {
            submitData.append(key, value.toString());
          }
        }
      });

      await companyService.update(submitData);
      setSuccessMessage("Informations mises à jour avec succès !");
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating company info:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Informations de l'entreprise | Ascendys Connect"
        description="Gérez les informations de votre entreprise"
      />

      <PageHeader
        title="Informations de l'entreprise"
        description="Modifiez les informations de votre entreprise"
      />

      {successMessage && (
        <div className="mb-6 rounded-lg border border-success-200 bg-success-50 p-4 text-success-800 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Informations de base
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name" required>
                Nom de l'entreprise
              </Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="tagline">Slogan</Label>
              <input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Image de marque
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Logo</Label>
              {company?.logo && !formData.logo && (
                <div className="mb-2">
                  <img src={company.logo} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
              <ImageUploader
                onImageSelect={(file) => setFormData({ ...formData, logo: file })}
                maxSizeMB={2}
                accept="image/*"
              />
            </div>

            <div>
              <Label>Favicon</Label>
              {company?.favicon && !formData.favicon && (
                <div className="mb-2">
                  <img src={company.favicon} alt="Favicon" className="size-8" />
                </div>
              )}
              <ImageUploader
                onImageSelect={(file) => setFormData({ ...formData, favicon: file })}
                maxSizeMB={1}
                accept="image/x-icon,image/png"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Coordonnées
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="email" required>
                Email
              </Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" required>
                Téléphone
              </Label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="whatsapp_number">WhatsApp</Label>
              <input
                id="whatsapp_number"
                type="tel"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="city">Ville</Label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="country">Pays</Label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Réseaux sociaux
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="facebook_url">Facebook</Label>
              <input
                id="facebook_url"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter / X</Label>
              <input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                placeholder="https://twitter.com/..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/company/..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="instagram_url">Instagram</Label>
              <input
                id="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="youtube_url">YouTube</Label>
              <input
                id="youtube_url"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </>
  );
}
