import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";

export default function OffersList() {
  return (
    <>
      <PageMeta
        title="Offres d'emploi | Ascendys Connect"
        description="Gérez les offres d'emploi"
      />

      <PageHeader
        title="Offres d'emploi"
        description="Publiez et gérez les opportunités de carrière"
        actions={
          <Button size="sm" className="inline-flex items-center gap-2">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Créer une offre
          </Button>
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="mx-auto size-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucune offre d'emploi
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par publier votre première offre d'emploi
            </p>
            <div className="mt-6">
              <Button size="sm">Créer une offre</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
