import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import CreateServiceForm from "@/components/services/CreateServiceForm";
import { servicesService } from "@/services/services.service";
import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";

export default function CreateService() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleCreateService = async (data: any) => {
    try {
      await servicesService.create(data);
      showSuccess("Service créé", "Le service a été créé avec succès");
      navigate("/services");
    } catch (error: any) {
      showError("Erreur de création", error.message || "Impossible de créer le service");
      throw error;
    }
  };

  return (
    <>
      <PageMeta title="Créer un service | Ascendys Connect" description="Créer un nouveau service" />
      <PageHeader title="Créer un service" description="Ajoutez un nouveau service à votre catalogue" breadcrumbs={[{ label: "Services", path: "/services" }, { label: "Créer" }]} />
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CreateServiceForm onSubmit={handleCreateService} onCancel={() => navigate("/services")} />
      </div>
    </>
  );
}
