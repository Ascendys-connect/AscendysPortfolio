import { useState, useCallback } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import FormModal from "@/components/common/FormModal";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateUserForm from "@/components/users/CreateUserForm";
import EditUserRoleForm from "@/components/users/EditUserRoleForm";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { usersService } from "@/services/users.service";
import type { UserListItem, CreateUserData, UpdateUserRoleData } from "@/types/user.types";
import { UserRole } from "@/types/auth.types";
import { API_ENDPOINTS } from "@/config/api";

export default function UsersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null);
  const [userToToggle, setUserToToggle] = useState<UserListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch users from API
  const { data: users, isLoading, refetch } = useApi<UserListItem[]>(API_ENDPOINTS.USERS.LIST, {
    defaultValue: [],
  });

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(query) ||
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query)
    );
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRowClick = (user: UserListItem) => {
    setSelectedUser(user);
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      await usersService.createUser(data);
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const handleUpdateUserRole = async (data: UpdateUserRoleData) => {
    if (!selectedUser) return;

    try {
      await usersService.updateUserRole(selectedUser.id, data);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const handleToggleStatus = async () => {
    if (!userToToggle) return;

    setIsToggling(true);
    setActionError(null);
    try {
      await usersService.toggleUserStatus(userToToggle.id);
      setUserToToggle(null);
      refetch();
    } catch (error: any) {
      setActionError(
        error.response?.data?.message ||
          "Erreur lors du changement de statut."
      );
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setActionError(null);
    try {
      await usersService.deleteUser(userToDelete.id);
      setUserToDelete(null);
      refetch();
    } catch (error: any) {
      setActionError(
        error.response?.data?.message ||
          "Erreur lors de la suppression."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns definition
  const columns: Column<UserListItem>[] = [
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (user) => (
        <div>
          <div className="font-medium text-gray-800 dark:text-white">
            {user.email}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.first_name} {user.last_name}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      sortable: true,
      render: (user) => {
        const roleLabels: Record<UserRole, string> = {
          [UserRole.SUPER_ADMIN]: "Super Admin",
          [UserRole.ADMIN]: "Admin",
          [UserRole.EDITOR]: "Éditeur",
          [UserRole.USER]: "Utilisateur",
        };
        return (
          <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/30 dark:text-brand-400">
            {roleLabels[user.role as UserRole]}
          </span>
        );
      },
    },
    {
      key: "phone",
      label: "Téléphone",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {user.phone || (
            <span className="italic text-gray-400 dark:text-gray-500">Non renseigné</span>
          )}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      sortable: true,
      render: (user) => (
        <StatusBadge status={user.is_active ? "active" : "inactive"} />
      ),
    },
    {
      key: "date_joined",
      label: "Date de création",
      sortable: true,
      render: (user) => {
        if (!user.date_joined) {
          return <span className="text-sm text-gray-400 dark:text-gray-500">-</span>;
        }
        
        try {
          const date = new Date(user.date_joined);
          if (isNaN(date.getTime())) {
            return <span className="text-sm text-gray-400 dark:text-gray-500">-</span>;
          }
          
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          );
        } catch (error) {
          return <span className="text-sm text-gray-400 dark:text-gray-500">-</span>;
        }
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex items-center gap-2">
          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
            }}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Modifier le rôle"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* Toggle status button - disabled for last active SUPER_ADMIN */}
          {!(
            user.role === UserRole.SUPER_ADMIN &&
            user.is_active &&
            users.filter(
              (u) =>
                u.role === UserRole.SUPER_ADMIN &&
                u.is_active &&
                u.id !== user.id
            ).length === 0
          ) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserToToggle(user);
              }}
              className={`rounded-lg p-2 transition ${
                user.is_active
                  ? "text-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
                  : "text-success-400 hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-950/30 dark:hover:text-success-400"
              }`}
              title={user.is_active ? "Suspendre" : "Activer"}
            >
              {user.is_active ? (
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              ) : (
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Delete button - disabled for SUPER_ADMIN */}
          {user.role !== UserRole.SUPER_ADMIN && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserToDelete(user);
              }}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-950/30 dark:hover:text-error-400"
              title="Supprimer"
            >
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Gestion des utilisateurs | Ascendys Connect"
        description="Gérez les utilisateurs de la plateforme Ascendys Connect"
      />

      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes et permissions des utilisateurs"
        actions={
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer un utilisateur
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {users.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Super Admins</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {users.filter((u) => u.role === UserRole.SUPER_ADMIN).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {users.filter((u) => u.role === UserRole.ADMIN).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Éditeurs</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {users.filter((u) => u.role === UserRole.EDITOR).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Actifs</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {users.filter((u) => u.is_active).length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Rechercher par email, prénom ou nom..."
          onSearch={handleSearch}
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun utilisateur trouvé"
        onRowClick={handleRowClick}
      />

      {/* Create User Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un utilisateur"
        size="md"
      >
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Edit User Modal */}
      <FormModal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setActionError(null);
        }}
        title="Modifier l'utilisateur"
        size="md"
      >
        {selectedUser && (
          <EditUserRoleForm
            user={selectedUser}
            onSubmit={handleUpdateUserRole}
            onCancel={() => {
              setSelectedUser(null);
              setActionError(null);
            }}
          />
        )}
      </FormModal>

      {/* Toggle Status Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToToggle}
        onClose={() => {
          setUserToToggle(null);
          setActionError(null);
        }}
        onConfirm={handleToggleStatus}
        title={
          userToToggle?.is_active
            ? "Suspendre l'utilisateur"
            : "Activer l'utilisateur"
        }
        message={
          <>
            {userToToggle?.is_active ? (
              <>
                Êtes-vous sûr de vouloir suspendre l'utilisateur{" "}
                <strong>{userToToggle?.email}</strong> ? L'utilisateur ne
                pourra plus se connecter tant qu'il ne sera pas réactivé.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir activer l'utilisateur{" "}
                <strong>{userToToggle?.email}</strong> ? L'utilisateur pourra à
                nouveau se connecter.
              </>
            )}
            {actionError && (
              <div className="mt-3 rounded-lg bg-error-50 p-3 dark:bg-error-950/30">
                <p className="text-sm text-error-700 dark:text-error-400">
                  {actionError}
                </p>
              </div>
            )}
          </>
        }
        confirmText={userToToggle?.is_active ? "Suspendre" : "Activer"}
        cancelText="Annuler"
        variant={userToToggle?.is_active ? "warning" : "info"}
        isLoading={isToggling}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => {
          setUserToDelete(null);
          setActionError(null);
        }}
        onConfirm={handleDeleteUser}
        title="Supprimer l'utilisateur"
        message={
          <>
            {userToDelete?.role === UserRole.SUPER_ADMIN ? (
              <div className="rounded-lg bg-error-50 p-4 dark:bg-error-950/30">
                <p className="font-medium text-error-700 dark:text-error-400">
                  ⚠️ Impossible de supprimer un SUPER_ADMIN
                </p>
                <p className="mt-2 text-sm text-error-600 dark:text-error-500">
                  Pour des raisons de sécurité, les comptes SUPER_ADMIN ne
                  peuvent pas être supprimés. Vous pouvez uniquement modifier
                  leur rôle ou les suspendre (si un autre SUPER_ADMIN actif
                  existe).
                </p>
              </div>
            ) : (
              <>
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>{userToDelete?.email}</strong> ? Cette action peut être
                annulée par un administrateur.
              </>
            )}
            {actionError && (
              <div className="mt-3 rounded-lg bg-error-50 p-3 dark:bg-error-950/30">
                <p className="text-sm text-error-700 dark:text-error-400">
                  {actionError}
                </p>
              </div>
            )}
          </>
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
