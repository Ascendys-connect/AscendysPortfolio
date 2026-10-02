import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import CreateBlogPostForm from "@/components/blog/CreateBlogPostForm";
import { blogService } from "@/services/blog.service";
import { useNavigate } from "react-router";
import { useToast } from "@/context/ToastContext";

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleCreatePost = async (data: any) => {
    try {
      await blogService.create(data);
      showSuccess("Article créé", "L'article a été créé avec succès");
      navigate("/blog");
    } catch (error: any) {
      showError("Erreur de création", error.message || "Impossible de créer l'article");
      throw error;
    }
  };

  return (
    <>
      <PageMeta title="Créer un article | Ascendys Connect" description="Créer un nouvel article de blog" />
      <PageHeader title="Créer un article" description="Rédigez un nouvel article pour le blog" breadcrumbs={[{ label: "Blog", path: "/blog" }, { label: "Créer" }]} />
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <CreateBlogPostForm onSubmit={handleCreatePost} onCancel={() => navigate("/blog")} />
      </div>
    </>
  );
}
