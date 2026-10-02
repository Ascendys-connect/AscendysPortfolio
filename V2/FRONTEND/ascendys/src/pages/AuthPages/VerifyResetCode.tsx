import { VerifyResetCodeForm } from '../../components/auth/VerifyResetCodeForm';
import PageMeta from '@/components/common/PageMeta';
import AuthLayout from './AuthPageLayout';

const VerifyResetCode = () => {
  return (
    <>
      <PageMeta
        title="Vérification du code | Ascendys Connect Admin"
        description="Vérifiez le code de réinitialisation envoyé à votre email"
      />
      <AuthLayout>
        <VerifyResetCodeForm />
      </AuthLayout>
    </>
  );
};

export default VerifyResetCode;
