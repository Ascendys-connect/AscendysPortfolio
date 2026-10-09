import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import TrainingForm from "@/components/trainings/TrainingForm";
import { useToast } from "@/context/ToastContext";
import { trainingsService } from "@/services/trainings.service";
import type { Training } from "@/types/content.types";

export default function EditTraining() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [training, setTraining] = useState<Training | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch training data
  useEffect(() => {
    const fetchTraining = async () => {
      if (!slug) return;

      setIsFetching(true);
      try {
        const response = await trainingsService.getBySlug(slug);
        const data = (response as any).data ?? response;
        setTraining(data);
      } catch (error: any) {
        showError(
          "Erreur de chargement",
          error.message || "Impossible de charger la formation"
        );
        navigate("/admin/trainings");
      } finally {
        setIsFetching(false);
      }
    };

    fetchTraining();
  }, [slug, navigate, showError]);

  const handleUpdate = async (data: FormData) => {
    if (!slug) return;
    await trainingsService.update(slug, data);
    showSuccess("Formation mise à jour", "La formation a été mise à jour avec succès");
    navigate("/admin/trainings");
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <svg
            className="size-8 animate-spin text-brand-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg text-gray-600 dark:text-gray-400">
            Chargement...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Modifier ${training?.title ?? "la formation"} | Ascendys Connect`}
        description="Modifiez les détails de la formation"
      />

      <PageHeader
        title="Modifier la formation"
        description="Modifiez les détails de la formation"
        breadcrumbs={[
          { label: "Formations", path: "/admin/trainings" },
          { label: training?.title ?? "...", path: "/admin/trainings" },
          { label: "Modifier" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <TrainingForm
          initialData={training}
          onSubmit={handleUpdate}
          onCancel={() => navigate("/admin/trainings")}
          isEditing
        />
      </div>
    </>
  );
}
