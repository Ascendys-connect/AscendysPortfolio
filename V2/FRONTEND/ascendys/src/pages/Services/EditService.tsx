import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { servicesService, type ServiceFormData } from "@/services/services.service";
import { useToast } from "@/context/ToastContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ServiceForm from "@/components/services/ServiceForm";

export default function EditService() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<ServiceFormData> | null>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      servicesService.getBySlug(slug)
        .then((res) => {
          const service = res.data || res;
          const dataToSet = {
            title: service.title || "",
            description: service.description || "",
            short_description: service.short_description || "",
            icon: service.icon || null,
            image: service.image || null,
            features: service.features || [],
            is_featured: service.is_featured || false,
            is_active: service.is_active ?? true,
          };
          setInitialData(dataToSet);
        })
        .catch((error) => {
          console.error('Error loading service:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (data: ServiceFormData) => {
    if (!slug) return;
    setLoading(true);
    try {
      await servicesService.update(slug, data);
      navigate("/admin/services");
    } catch (error: any) {
      console.error("Erreur mise à jour:", error);
      const msg = error.response?.data?.message || error.message || "Erreur lors de la mise à jour du service";
      const errorsObj = error.response?.data?.errors;
      const details = errorsObj && typeof errorsObj === 'object'
        ? Object.entries(errorsObj).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
        : '';
      showError("Erreur de mise à jour", details ? `${msg} — ${details}` : msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) return <div className="p-6 text-center text-gray-500">Chargement...</div>;

  return (
    <>
      <PageBreadCrumb pageTitle="Modifier le service" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ServiceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  );
}
