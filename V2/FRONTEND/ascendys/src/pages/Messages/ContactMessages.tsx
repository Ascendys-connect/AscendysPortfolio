import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";

export default function ContactMessages() {
  return (
    <>
      <PageMeta
        title="Messages de contact | Ascendys Connect"
        description="Consultez les messages reçus via le formulaire de contact"
      />

      <PageHeader
        title="Messages de contact"
        description="Messages reçus via le formulaire de contact du site"
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun message
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Les messages de contact apparaîtront ici
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
