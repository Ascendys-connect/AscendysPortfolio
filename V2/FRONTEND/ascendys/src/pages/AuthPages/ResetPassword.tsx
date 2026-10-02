import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import PageMeta from '@/components/common/PageMeta';
import AuthLayout from './AuthPageLayout';

const ResetPassword = () => {
  return (
    <>
      <PageMeta
        title="Réinitialisation du mot de passe | Ascendys Connect Admin"
        description="Définissez votre nouveau mot de passe"
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
