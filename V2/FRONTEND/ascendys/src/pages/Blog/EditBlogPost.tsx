import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { blogPostsService, type BlogFormData } from "@/services/blog.service";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/context/ToastContext";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import BlogPostForm from "@/components/blog/BlogPostForm";

export default function EditBlogPost() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<BlogFormData> | null>(null);
  const { data: categories = [] } = useApi("/blog/categories/", { defaultValue: [] });
  const { data: tags = [] } = useApi("/blog/tags/", { defaultValue: [] });

  useEffect(() => {
    if (slug) {
      console.log('Loading post with slug:', slug);
      setLoading(true);
      blogPostsService.getBySlug(slug)
        .then((res) => {
          console.log('API Response:', res);
          // L'API retourne {success, message, data: {...}}
          const post = res.data || res;
          console.log('Post data:', post);
          const dataToSet = {
            title: post.title || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            cover_image: post.cover_image || null,
            video: post.video || null,
            category: post.category || null,
            tags_ids: post.tags ? post.tags.map((t) => t.id) : [],
            status: post.status || "DRAFT",
            is_featured: post.is_featured || false,
          };
          console.log('Setting initialData:', dataToSet);
          setInitialData(dataToSet);
        })
        .catch((error) => {
          console.error('Error loading post:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleSubmit = async (data: BlogFormData) => {
    if (!slug) return;
    setLoading(true);
    try {
      await blogPostsService.update(slug, data);
      navigate("/admin/blog/posts");
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      const err = error as any;
      const msg = err.response?.data?.message || err.message || "Erreur lors de la mise à jour de l'article";
      showError("Erreur de mise à jour", msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) return <div className="p-6 text-center text-gray-500">Chargement...</div>;

  return (
    <>
      <PageBreadCrumb pageTitle="Modifier l'article" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <BlogPostForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
          categories={categories}
          tags={tags}
        />
      </div>
    </>
  );
}
