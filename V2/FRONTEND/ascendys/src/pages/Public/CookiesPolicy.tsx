import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { Cookie, CheckCircle, AlertCircle, Settings } from "lucide-react";

export default function CookiesPolicy() {
  return (
    <>
      <PageMeta
        title="Politique de Cookies - Ascendys Connect"
        description="Politique d'utilisation des cookies sur le site Ascendys Connect"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Header */}
          <section className="relative py-16 text-white lg:py-20">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/Cookie-bg.png)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/70 to-brand-800/70" />
            
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                  <Cookie size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-center text-4xl font-bold sm:text-5xl mb-4">
                Politique de Cookies
              </h1>
              <p className="text-center text-xl text-brand-100 max-w-2xl mx-auto">
                Comment nous utilisons les cookies pour améliorer votre expérience
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Introduction Card */}
              <div className="mb-12 rounded-2xl border-2 border-gold-200 bg-gold-50 p-8 dark:border-gold-900 dark:bg-gold-950/30">
                <div className="flex gap-4">
                  <AlertCircle size={24} className="shrink-0 text-gold-600 dark:text-gold-400" />
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      Qu'est-ce qu'un cookie ?
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Un cookie est un petit fichier texte déposé sur votre appareil lors de la
                      visite d'un site web. Il permet de mémoriser des informations sur votre
                      navigation et d'améliorer votre expérience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400">
                
                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">1</span>
                  Types de cookies utilisés
                </h2>

                <h3>Cookies essentiels</h3>
                <p>
                  Ces cookies sont nécessaires au fonctionnement du site. Ils permettent :
                </p>
                <div className="not-prose grid gap-3 my-6">
                  {[
                    "La navigation sur le site",
                    "L'accès aux zones sécurisées",
                    "La mémorisation de vos préférences"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <CheckCircle size={20} className="shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                    </div>
                  ))}
                </div>

                <h3>Cookies de performance</h3>
                <p>
                  Ces cookies nous aident à améliorer le site en collectant des informations
                  anonymes sur :
                </p>
                <ul>
                  <li>Les pages les plus visitées</li>
                  <li>Le temps passé sur le site</li>
                  <li>Les erreurs rencontrées</li>
                  <li>Le comportement de navigation</li>
                </ul>

                <h3>Cookies fonctionnels</h3>
                <p>
                  Ces cookies permettent d'améliorer votre expérience en mémorisant :
                </p>
                <ul>
                  <li>Vos préférences de navigation</li>
                  <li>Votre connexion (si vous êtes inscrit)</li>
                  <li>Vos choix de personnalisation</li>
                  <li>Votre langue préférée</li>
                </ul>

                <h3>Cookies publicitaires</h3>
                <p>
                  Ces cookies (si utilisés) permettent l'affichage de publicités pertinentes
                  et la mesure de l'efficacité des campagnes.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">2</span>
                  Cookies tiers
                </h2>
                <p>
                  Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :
                </p>
                <div className="not-prose my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Service</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Objectif</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                      <tr className="bg-white dark:bg-gray-950">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Google Analytics</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Statistiques de visite</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-950">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">FedaPay</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Paiement en ligne</td>
                      </tr>
                      <tr className="bg-white dark:bg-gray-950">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Réseaux sociaux</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Partage de contenu</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">3</span>
                  Durée de conservation
                </h2>
                <div className="not-prose my-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-2 text-3xl font-bold text-brand-600 dark:text-brand-400">Session</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cookies de session</div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">Jusqu'à fermeture du navigateur</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-2 text-3xl font-bold text-brand-600 dark:text-brand-400">13 mois</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cookies persistants</div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">Durée maximale</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-2 text-3xl font-bold text-brand-600 dark:text-brand-400">13 mois</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cookies publicitaires</div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">Durée maximale</div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">4</span>
                  Gestion des cookies
                </h2>
                
                <div className="not-prose my-8 rounded-2xl border-2 border-brand-200 bg-brand-50 p-8 dark:border-brand-900 dark:bg-brand-950/30">
                  <div className="flex gap-4">
                    <Settings size={24} className="shrink-0 text-brand-600 dark:text-brand-400" />
                    <div>
                      <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                        Paramètres du navigateur
                      </h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</p>
                        <p><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</p>
                        <p><strong>Safari :</strong> Préférences → Confidentialité</p>
                        <p><strong>Edge :</strong> Paramètres → Confidentialité, recherche et services</p>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">5</span>
                  Conséquences du refus
                </h2>
                <p>
                  Le refus des cookies non essentiels peut entraîner :
                </p>
                <ul>
                  <li>Une navigation moins fluide</li>
                  <li>L'impossibilité d'accéder à certaines fonctionnalités</li>
                  <li>La perte de vos préférences de navigation</li>
                  <li>Des contenus moins personnalisés</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">6</span>
                  Contact
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <p className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Pour toute question concernant les cookies :
                    </p>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p><strong>Email :</strong> contact@ascendysconnect.com</p>
                      <p><strong>Téléphone :</strong> +228 96 49 82 82</p>
                    </div>
                  </div>
                </div>

                <p className="mt-8 rounded-lg bg-brand-50 p-4 text-sm text-gray-600 dark:bg-brand-950/30 dark:text-gray-400">
                  <strong>Dernière mise à jour :</strong> Mars 2026
                </p>
              </div>
            </div>
          </section>
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
