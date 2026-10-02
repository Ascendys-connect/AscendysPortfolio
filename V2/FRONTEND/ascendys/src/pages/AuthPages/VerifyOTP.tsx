import { useSearchParams } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import VerifyOTPForm from "@/components/auth/VerifyOTPForm";
import AuthLayout from "./AuthPageLayout";

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <>
      <PageMeta
        title="Vérification OTP - Ascendys Connect"
        description="Vérifiez votre adresse email avec le code OTP"
      />
      <AuthLayout>
        <VerifyOTPForm email={email} />
      </AuthLayout>
    </>
  );
}
