import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import PageMeta from '@/components/common/PageMeta';
import AuthLayout from './AuthPageLayout';

const ForgotPassword = () => {
  return (
    <>
      <PageMeta
        title="Mot de passe oublié | Ascendys Connect Admin"
        description="Réinitialisez votre mot de passe pour accéder au panneau d'administration"
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
