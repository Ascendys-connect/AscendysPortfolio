import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { offersService, type OfferFormData } from "@/services/offers.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import OfferForm from "@/components/offers/OfferForm";

export default function EditOffer() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<OfferFormData> | null>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      offersService.getBySlug(slug)
        .then((res) => {
          const offer = res.data || res;
          const dataToSet = {
            title: offer.title || "",
            short_description: offer.short_description || "",
            description: offer.description || "",
            image: offer.image || null,
            banner: offer.banner || null,
            type: offer.type || "ANNOUNCEMENT",
            start_date: offer.start_date || "",
            end_date: offer.end_date || "",
            status: offer.status || "DRAFT",
            is_featured: offer.is_featured || false,
          };
          setInitialData(dataToSet);
        })
        .catch((error) => {
          console.error('Error loading offer:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (data: OfferFormData) => {
    if (!slug) return;
    setLoading(true);
    try {
      await offersService.update(slug, data);
      navigate("/admin/services");
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      alert("Erreur lors de la mise à jour de l'offre");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) return <div className="p-6 text-center text-gray-500">Chargement...</div>;

  return (
    <>
      <PageBreadCrumb pageTitle="Modifier l'offre" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <OfferForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  );
}
