import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";

export default function Newsletter() {
  return (
    <>
      <PageMeta
        title="Newsletter | Ascendys Connect"
        description="Gérez les abonnés à la newsletter"
      />

      <PageHeader
        title="Newsletter"
        description="Gérez les abonnés et envoyez des campagnes"
        actions={
          <Button size="sm" className="inline-flex items-center gap-2">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Envoyer une campagne
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Abonnés</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Campagnes envoyées</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">0</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Taux d'ouverture</p>
          <p className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white">0%</p>
        </div>
      </div>

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
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun abonné
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Les abonnés à la newsletter apparaîtront ici
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
