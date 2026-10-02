import { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { useApi } from "@/hooks/useApi";
import { settingsService } from "@/services/settings.service";
import type { Settings } from "@/types/content.types";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: settings, isLoading, refetch } = useApi<Settings>(
    "/core/settings/",
    { defaultValue: null as any }
  );

  const [formData, setFormData] = useState({
    site_name: "",
    site_description: "",
    maintenance_mode: false,
    allow_registration: false,
    email_notifications: true,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    google_analytics_id: "",
    smtp_host: "",
    smtp_port: 587,
    smtp_username: "",
    smtp_use_tls: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || "",
        site_description: settings.site_description || "",
        maintenance_mode: settings.maintenance_mode || false,
        allow_registration: settings.allow_registration || false,
        email_notifications: settings.email_notifications || true,
        seo_title: settings.seo_title || "",
        seo_description: settings.seo_description || "",
        seo_keywords: settings.seo_keywords || "",
        google_analytics_id: settings.google_analytics_id || "",
        smtp_host: settings.smtp_host || "",
        smtp_port: settings.smtp_port || 587,
        smtp_username: settings.smtp_username || "",
        smtp_use_tls: settings.smtp_use_tls !== undefined ? settings.smtp_use_tls : true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      await settingsService.update(formData);
      setSuccessMessage("Paramètres mis à jour avec succès !");
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
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
        title="Paramètres système | Ascendys Connect"
        description="Configurez les paramètres de la plateforme"
      />

      <PageHeader
        title="Paramètres système"
        description="Configurez les paramètres généraux de la plateforme"
      />

      {successMessage && (
        <div className="mb-6 rounded-lg border border-success-200 bg-success-50 p-4 text-success-800 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Paramètres généraux
          </h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="site_name" required>
                Nom du site
              </Label>
              <input
                id="site_name"
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="site_description">Description du site</Label>
              <textarea
                id="site_description"
                rows={3}
                value={formData.site_description}
                onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.maintenance_mode}
                  onChange={(e) =>
                    setFormData({ ...formData, maintenance_mode: e.target.checked })
                  }
                  className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mode maintenance
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allow_registration}
                  onChange={(e) =>
                    setFormData({ ...formData, allow_registration: e.target.checked })
                  }
                  className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Autoriser les inscriptions publiques
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.email_notifications}
                  onChange={(e) =>
                    setFormData({ ...formData, email_notifications: e.target.checked })
                  }
                  className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Activer les notifications par email
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Référencement (SEO)
          </h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="seo_title">Titre SEO</Label>
              <input
                id="seo_title"
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Titre affiché dans les résultats de recherche"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="seo_description">Description SEO</Label>
              <textarea
                id="seo_description"
                rows={3}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Description affichée dans les résultats de recherche"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <Label htmlFor="seo_keywords">Mots-clés SEO</Label>
              <input
                id="seo_keywords"
                type="text"
                value={formData.seo_keywords}
                onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                placeholder="formation, digital, togo..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Séparez les mots-clés par des virgules
              </p>
            </div>

            <div>
              <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
              <input
                id="google_analytics_id"
                type="text"
                value={formData.google_analytics_id}
                onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Configuration SMTP
          </h2>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="smtp_host">Serveur SMTP</Label>
                <input
                  id="smtp_host"
                  type="text"
                  value={formData.smtp_host}
                  onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                  placeholder="smtp.gmail.com"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <Label htmlFor="smtp_port">Port SMTP</Label>
                <input
                  id="smtp_port"
                  type="number"
                  value={formData.smtp_port}
                  onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) || 587 })}
                  placeholder="587"
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="smtp_username">Nom d'utilisateur SMTP</Label>
              <input
                id="smtp_username"
                type="text"
                value={formData.smtp_username}
                onChange={(e) => setFormData({ ...formData, smtp_username: e.target.value })}
                placeholder="votre-email@example.com"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.smtp_use_tls}
                onChange={(e) =>
                  setFormData({ ...formData, smtp_use_tls: e.target.checked })
                }
                className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Utiliser TLS/SSL
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
          </Button>
        </div>
      </form>
    </>
  );
}
