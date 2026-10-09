import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { Shield, CheckCircle, AlertCircle, Lock, Eye, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <PageMeta
        title="Politique de Confidentialité - Ascendys Connect"
        description="Politique de confidentialité et protection des données personnelles"
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
                backgroundImage: "url(/privacy.jfif)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/70 to-brand-800/70" />
            
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                  <Shield size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-center text-4xl font-bold sm:text-5xl mb-4">
                Politique de Confidentialité
              </h1>
              <p className="text-center text-xl text-brand-100 max-w-2xl mx-auto">
                Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Introduction Card */}
              <div className="mb-12 rounded-2xl border-2 border-green-200 bg-green-50 p-8 dark:border-green-900 dark:bg-green-950/30">
                <div className="flex gap-4">
                  <Lock size={24} className="shrink-0 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      Engagement de confidentialité
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      ASCENDYS CONNECT accorde une grande importance à la protection de vos données
                      personnelles. Cette politique explique comment nous collectons, utilisons et
                      protégeons vos informations conformément aux réglementations en vigueur.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400">
                
                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">1</span>
                  Données collectées
                </h2>
                <p>Nous collectons les données suivantes pour assurer le bon fonctionnement de nos services :</p>
                <div className="not-prose grid gap-3 sm:grid-cols-2 my-6">
                  {[
                    { icon: <UserCheck size={20} />, text: "Nom et prénom" },
                    { icon: <UserCheck size={20} />, text: "Adresse email" },
                    { icon: <UserCheck size={20} />, text: "Numéro de téléphone" },
                    { icon: <UserCheck size={20} />, text: "Informations de formation" },
                    { icon: <Eye size={20} />, text: "Données de navigation" },
                    { icon: <Lock size={20} />, text: "Préférences utilisateur" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <div className="shrink-0 text-brand-600 dark:text-brand-400">{item.icon}</div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.text}</span>
                    </div>
                  ))}
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">2</span>
                  Utilisation des données
                </h2>
                <p>Vos données sont utilisées pour :</p>
                <ul>
                  <li><strong>Gestion des inscriptions</strong> : Traiter vos inscriptions aux formations</li>
                  <li><strong>Communication</strong> : Vous contacter concernant nos services</li>
                  <li><strong>Amélioration</strong> : Améliorer notre site et nos services</li>
                  <li><strong>Marketing</strong> : Vous envoyer des informations (avec votre consentement)</li>
                  <li><strong>Conformité</strong> : Respecter nos obligations légales</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">3</span>
                  Base légale du traitement
                </h2>
                <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Consentement", desc: "Vous avez explicitement accepté le traitement" },
                    { title: "Contrat", desc: "Nécessaire à l'exécution d'un contrat" },
                    { title: "Obligation légale", desc: "Requis par la loi" },
                    { title: "Intérêt légitime", desc: "Nécessaire à nos intérêts légitimes" }
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                      <div className="mb-2 text-lg font-bold text-brand-600 dark:text-brand-400">{item.title}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">4</span>
                  Partage des données
                </h2>
                <div className="not-prose my-6 rounded-2xl border-2 border-orange-200 bg-orange-50 p-8 dark:border-orange-900 dark:bg-orange-950/30">
                  <div className="flex gap-4">
                    <AlertCircle size={24} className="shrink-0 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                        Important : Vos données ne sont jamais vendues
                      </h3>
                      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
                        Elles peuvent être partagées uniquement avec :
                      </p>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li>✓ Nos prestataires de services (hébergement, paiement)</li>
                        <li>✓ Nos partenaires de formation certifiés</li>
                        <li>✓ Les autorités légales si requis par la loi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">5</span>
                  Durée de conservation
                </h2>
                <p>
                  Nous conservons vos données personnelles pendant la durée nécessaire aux finalités
                  pour lesquelles elles ont été collectées, conformément aux obligations légales.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">6</span>
                  Vos droits
                </h2>
                <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
                <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "Droit d'accès à vos données",
                    "Droit de rectification",
                    "Droit à l'effacement",
                    "Droit à la limitation du traitement",
                    "Droit à la portabilité",
                    "Droit d'opposition",
                    "Droit de retirer votre consentement",
                    "Droit d'introduire une réclamation"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                      <CheckCircle size={20} className="shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                    </div>
                  ))}
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">7</span>
                  Sécurité
                </h2>
                <p>
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                  pour protéger vos données contre :
                </p>
                <ul>
                  <li>L'accès non autorisé</li>
                  <li>La perte accidentelle</li>
                  <li>La destruction</li>
                  <li>La modification non autorisée</li>
                  <li>La divulgation</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">8</span>
                  Cookies
                </h2>
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience. Pour plus
                  d'informations, consultez notre{" "}
                  <a href="/cookies">politique de cookies</a>.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">9</span>
                  Contact
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <p className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Pour toute question ou pour exercer vos droits :
                    </p>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p><strong>Email :</strong> contact@ascendysconnect.com</p>
                      <p><strong>Téléphone :</strong> +228 96 49 82 82</p>
                      <p><strong>Adresse :</strong> Lomé, Togo</p>
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
