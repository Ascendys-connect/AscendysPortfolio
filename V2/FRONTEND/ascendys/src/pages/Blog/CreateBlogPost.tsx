import { useState } from "react";
import { useNavigate } from "react-router";
import { blogPostsService, blogCategoriesService, tagsService, type BlogFormData } from "@/services/blog.service";
import { useApi } from "@/hooks/useApi";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import BlogPostForm from "@/components/blog/BlogPostForm";

export default function CreateBlogPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: categories = [] } = useApi("/blog/categories/", { defaultValue: [] });
  const { data: tags = [] } = useApi("/blog/tags/", { defaultValue: [] });

  const handleSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      await blogPostsService.create(data);
      navigate("/admin/blog/posts");
    } catch (error) {
      console.error("Erreur création:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Nouvel article" />
      
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <BlogPostForm
          onSubmit={handleSubmit}
          loading={loading}
          categories={categories}
          tags={tags}
        />
      </div>
    </>
  );
}
