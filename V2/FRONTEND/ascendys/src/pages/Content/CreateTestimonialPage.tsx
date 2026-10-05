import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";
import { testimonialsService } from "@/services/testimonials.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import CreateTestimonialForm from "@/components/testimonials/CreateTestimonialForm";
import type { TestimonialFormData } from "@/types/content.types";

export default function CreateTestimonialPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (data: TestimonialFormData) => {
    try {
      await testimonialsService.create(data);
      showSuccess("Témoignage créé", "Le témoignage a été ajouté avec succès.");
      navigate("/admin/testimonials");
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création du témoignage.";
      showError("Erreur", msg);
      throw error;
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Ajouter un témoignage" />
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            Nouveau témoignage
          </h2>
          <CreateTestimonialForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/testimonials")}
          />
        </div>
      </div>
    </>
  );
}
