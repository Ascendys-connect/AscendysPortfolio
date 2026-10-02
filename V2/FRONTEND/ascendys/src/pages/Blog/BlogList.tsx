import { useState, useCallback } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchBar from "@/components/common/SearchBar";
import StatusBadge from "@/components/common/StatusBadge";
import PublishButton from "@/components/common/PublishButton";
import FormModal from "@/components/common/FormModal";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CreateBlogPostForm from "@/components/blog/CreateBlogPostForm";
import Button from "@/components/ui/button/Button";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import { blogService } from "@/services/blog.service";
import type { BlogPost } from "@/types/content.types";
import { ContentStatus } from "@/types/content.types";

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch blog posts from API
  const { data: posts, isLoading, refetch } = useApi<BlogPost[]>("/blog/posts/", {
    defaultValue: [],
  });

  // Filter posts based on search and status
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCreatePost = async (data: any) => {
    try {
      await blogService.create(data);
      showSuccess("Article créé", "L'article a été créé avec succès");
      setIsCreateModalOpen(false);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de créer l'article");
      throw error;
    }
  };

  const handlePublish = async (post: BlogPost) => {
    try {
      await blogService.publish(post.slug);
      showSuccess("Article publié", `L'article "${post.title}" a été publié`);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de publier l'article");
    }
  };

  const handleArchive = async (post: BlogPost) => {
    try {
      await blogService.archive(post.slug);
      showSuccess("Article archivé", `L'article "${post.title}" a été archivé`);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible d'archiver l'article");
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await blogService.delete(postToDelete.id);
      showSuccess("Article supprimé", "L'article a été supprimé avec succès");
      setPostToDelete(null);
      refetch();
    } catch (error) {
      showError("Erreur", "Impossible de supprimer l'article");
    } finally {
      setIsDeleting(false);
    }
  };

  // Table columns definition
  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      label: "Article",
      sortable: true,
      render: (post) => (
        <div className="flex items-center gap-3">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="size-16 rounded-lg object-cover"
            />
          )}
          <div className="max-w-md">
            <div className="font-medium text-gray-800 dark:text-white">
              {post.title}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {post.excerpt}
            </div>
            <div className="mt-1 flex items-center gap-2">
              {post.category_names?.slice(0, 2).map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "author_name",
      label: "Auteur",
      sortable: true,
      render: (post) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {post.author_name}
        </span>
      ),
    },
    {
      key: "views_count",
      label: "Vues",
      sortable: true,
      render: (post) => (
        <div className="flex items-center gap-1">
          <svg
            className="size-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {post.views_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (post) => (
        <StatusBadge status={post.status as ContentStatus} />
      ),
    },
    {
      key: "published_at",
      label: "Date de publication",
      sortable: true,
      render: (post) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (post) => (
        <div className="flex items-center gap-2">
          <PublishButton
            status={post.status as ContentStatus}
            onPublish={() => handlePublish(post)}
            onArchive={() => handleArchive(post)}
            size="xs"
          />
          <button
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title="Modifier"
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPostToDelete(post);
            }}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-950/30 dark:hover:text-error-400"
            title="Supprimer"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageMeta
        title="Gestion du blog | Ascendys Connect"
        description="Gérez les articles de blog de la plateforme"
      />

      <PageHeader
        title="Articles de blog"
        description="Rédigez et gérez vos articles"
        actions={
          <Button 
            size="sm" 
            className="inline-flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvel article
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {posts.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Publiés</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {posts.filter((p) => p.status === "PUBLISHED").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Brouillons</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {posts.filter((p) => p.status === "DRAFT").length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Archivés</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">
            {posts.filter((p) => p.status === "ARCHIVED").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            placeholder="Rechercher un article..."
            onSearch={handleSearch}
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="DRAFT">Brouillons</option>
            <option value="PUBLISHED">Publiés</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredPosts}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun article trouvé"
      />

      {/* Create Post Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un article"
        size="lg"
      >
        <CreateBlogPostForm
          onSubmit={handleCreatePost}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </FormModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeletePost}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer l'article "${postToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
