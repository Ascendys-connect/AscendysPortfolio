import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import CreateUserForm from "@/components/users/CreateUserForm";
import { usersService } from "@/services/users.service";
import { useNavigate } from "react-router";
import type { CreateUserData } from "@/types/user.types";
import { useToast } from "@/context/ToastContext";

export default function CreateUser() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      await usersService.createUser(data);
      showSuccess("Utilisateur créé", `L'utilisateur ${data.email} a été créé avec succès`);
      navigate("/users");
    } catch (error: any) {
      showError("Erreur de création", error.message || "Impossible de créer l'utilisateur");
      throw error;
    }
  };

  return (
    <>
      <PageMeta
        title="Créer un utilisateur | Ascendys Connect"
        description="Créer un nouveau compte utilisateur"
      />

      <PageHeader
        title="Créer un utilisateur"
        description="Ajoutez un nouveau compte utilisateur à la plateforme"
        breadcrumbs={[
          { label: "Utilisateurs", path: "/users" },
          { label: "Créer" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => navigate("/users")}
        />
      </div>
    </>
  );
}
