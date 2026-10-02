import { useSearchParams } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import AuthLayout from "./AuthPageLayout";

export default function ChangePassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <>
      <PageMeta
        title="Nouveau mot de passe - Ascendys Connect"
        description="Créez votre nouveau mot de passe"
      />
      <AuthLayout>
        <ChangePasswordForm email={email} />
      </AuthLayout>
    </>
  );
}
