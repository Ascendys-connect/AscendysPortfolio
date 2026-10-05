import { useState } from "react";
import { useNavigate } from "react-router";
import { offersService, type OfferFormData } from "@/services/offers.service";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import OfferForm from "@/components/offers/OfferForm";

export default function CreateOffer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: OfferFormData) => {
    setLoading(true);
    try {
      await offersService.create(data);
      navigate("/admin/services");
    } catch (error) {
      console.error("Erreur création:", error);
      alert("Erreur lors de la création de l'offre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Nouvelle offre" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <OfferForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}
