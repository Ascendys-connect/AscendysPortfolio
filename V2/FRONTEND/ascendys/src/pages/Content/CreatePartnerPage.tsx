import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";
import { partnersService } from "@/services/partners.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PartnerForm from "@/components/partners/PartnerForm";
import type { PartnerFormData } from "@/types/content.types";

export default function CreatePartnerPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (data: PartnerFormData) => {
    try {
      await partnersService.create(data);
      showSuccess("Partenaire créé", "Le partenaire a été ajouté avec succès.");
      navigate("/admin/partners");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création du partenaire.";
      showError("Erreur", msg);
      throw error;
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Ajouter un partenaire" />
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Nouveau partenaire
          </h2>
          <PartnerForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/partners")}
          />
        </div>
      </div>
    </>
  );
}
