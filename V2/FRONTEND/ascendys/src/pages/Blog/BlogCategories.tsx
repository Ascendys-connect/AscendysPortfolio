import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";

export default function BlogCategories() {
  return (
    <>
      <PageMeta title="Catégories du blog | Ascendys Connect" description="Gérez les catégories d'articles" />
      <PageHeader
        title="Catégories du blog"
        description="Organisez vos articles par catégories"
        breadcrumbs={[{ label: "Blog", path: "/blog" }, { label: "Catégories" }]}
        actions={
          <Button size="sm" className="inline-flex items-center gap-2">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle catégorie
          </Button>
        }
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune catégorie</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Créez votre première catégorie d'article</p>
          </div>
        </div>
      </div>
    </>
  );
}
