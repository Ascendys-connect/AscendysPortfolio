import { useState } from "react";
import { useNavigate } from "react-router";
import { servicesService, type ServiceFormData } from "@/services/services.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import ServiceForm from "@/components/services/ServiceForm";

export default function CreateService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    setLoading(true);
    try {
      await servicesService.create(data);
      navigate("/admin/services");
    } catch (error: any) {
      console.error("Erreur création:", error);
      const msg = error.response?.data?.message || error.message || "Erreur lors de la création du service";
      const errorsObj = error.response?.data?.errors;
      const details = errorsObj && typeof errorsObj === 'object'
        ? Object.entries(errorsObj).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
        : '';
      alert(details ? `${msg}\n\n${details}` : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Nouveau service" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ServiceForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}
