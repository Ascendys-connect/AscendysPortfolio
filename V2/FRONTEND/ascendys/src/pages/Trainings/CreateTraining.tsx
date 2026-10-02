import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import TrainingForm from "@/components/trainings/TrainingForm";
import { trainingsService } from "@/services/trainings.service";
import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";

export default function CreateTraining() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleCreateTraining = async (data: any) => {
    try {
      await trainingsService.create(data);
      showSuccess("Formation créée", "La formation a été créée avec succès");
      navigate("/admin/trainings");
    } catch (error: any) {
      showError("Erreur de création", error.message || "Impossible de créer la formation");
      throw error;
    }
  };

  return (
    <>
      <PageMeta
        title="Créer une formation | Ascendys Connect"
        description="Ajoutez une nouvelle formation au catalogue"
      />

      <PageHeader
        title="Créer une formation"
        description="Ajoutez une nouvelle formation au catalogue"
        breadcrumbs={[
          { label: "Formations", path: "/admin/trainings" },
          { label: "Créer" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <TrainingForm
          onSubmit={handleCreateTraining}
          onCancel={() => navigate("/admin/trainings")}
        />
      </div>
    </>
  );
}
