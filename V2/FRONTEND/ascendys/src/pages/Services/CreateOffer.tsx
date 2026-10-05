import { useState } from "react";
import { useNavigate } from "react-router";
import { offersService, type OfferFormData } from "@/services/offers.service";
import { useToast } from "@/context/ToastContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import OfferForm from "@/components/offers/OfferForm";

export default function CreateOffer() {
  const navigate = useNavigate();
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: OfferFormData) => {
    setLoading(true);
    try {
      await offersService.create(data);
      navigate("/admin/offers");
    } catch (error: any) {
      console.error("Erreur création:", error);
      const msg = error.response?.data?.message || error.message || "Erreur lors de la création de l'offre";
      const errorsObj = error.response?.data?.errors;
      const details = errorsObj && typeof errorsObj === 'object'
        ? Object.entries(errorsObj).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
        : '';
      showError("Erreur de création", details ? `${msg} — ${details}` : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Nouvelle offre d'emploi" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <OfferForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </>
  );
}
