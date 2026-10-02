import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";

export default function BlogTags() {
  return (
    <>
      <PageMeta title="Tags du blog | Ascendys Connect" description="Gérez les tags d'articles" />
      <PageHeader
        title="Tags du blog"
        description="Organisez vos articles par tags"
        breadcrumbs={[{ label: "Blog", path: "/blog" }, { label: "Tags" }]}
        actions={
          <Button size="sm" className="inline-flex items-center gap-2">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau tag
          </Button>
        }
      />
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun tag</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Créez votre premier tag</p>
          </div>
        </div>
      </div>
    </>
  );
}
