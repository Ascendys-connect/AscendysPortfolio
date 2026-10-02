import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";

export default function PartnersList() {
  return (
    <>
      <PageMeta
        title="Partenaires | Ascendys Connect"
        description="Gérez les partenaires de l'entreprise"
      />

      <PageHeader
        title="Partenaires"
        description="Gérez les logos et informations des partenaires"
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
            Ajouter un partenaire
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun partenaire
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez par ajouter votre premier partenaire
            </p>
            <div className="mt-6">
              <Button size="sm">Ajouter un partenaire</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
