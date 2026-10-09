import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function TermsOfUse() {
  return (
    <>
      <PageMeta
        title="Conditions Générales d'Utilisation - Ascendys Connect"
        description="Conditions générales d'utilisation des services Ascendys Connect"
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
                backgroundImage: "url(/cgu.jpg)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/70 to-brand-800/70" />
            
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                  <FileText size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-center text-4xl font-bold sm:text-5xl mb-4">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-center text-xl text-brand-100 max-w-2xl mx-auto">
                Veuillez lire attentivement ces conditions avant d'utiliser nos services
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Introduction Card */}
              <div className="mb-12 rounded-2xl border-2 border-brand-200 bg-brand-50 p-8 dark:border-brand-900 dark:bg-brand-950/30">
                <div className="flex gap-4">
                  <AlertCircle size={24} className="shrink-0 text-brand-600 dark:text-brand-400" />
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      À propos de ce document
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation
                      de la plateforme et des services proposés par ASCENDYS CONNECT. En utilisant
                      nos services, vous acceptez ces conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400">
                
                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">1</span>
                  Objet
                </h2>
                <p>
                  Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation
                  de la plateforme ASCENDYS CONNECT et l'accès aux formations professionnelles
                  proposées. Elles s'appliquent à tous les utilisateurs du site.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">2</span>
                  Acceptation des CGU
                </h2>
                <p>
                  L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des
                  présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser
                  ce site.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">3</span>
                  Services proposés
                </h2>
                <p>
                  ASCENDYS CONNECT propose des formations professionnelles dans les domaines suivants :
                </p>
                <div className="not-prose grid gap-3 sm:grid-cols-2 my-6">
                  {[
                    "Technologies de l'information",
                    "Digital et marketing",
                    "Management et gestion",
                    "Cybersécurité",
                    "Télécommunications",
                    "Cloud et DevOps"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                      <CheckCircle size={20} className="shrink-0 text-brand-600 dark:text-brand-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item}</span>
                    </div>
                  ))}
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">4</span>
                  Inscription et compte utilisateur
                </h2>
                <p>
                  Pour accéder à certains services, vous devez créer un compte. Vous vous engagez à :
                </p>
                <ul>
                  <li>Fournir des informations exactes et à jour</li>
                  <li>Maintenir la confidentialité de vos identifiants</li>
                  <li>Informer immédiatement ASCENDYS CONNECT de toute utilisation non autorisée</li>
                  <li>Ne pas créer de compte au nom d'autrui sans autorisation</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">5</span>
                  Utilisation du site
                </h2>
                <p>
                  Vous vous engagez à utiliser le site de manière conforme à la loi et à ne pas :
                </p>
                <ul>
                  <li>Porter atteinte aux droits de tiers</li>
                  <li>Diffuser du contenu illicite, offensant ou inapproprié</li>
                  <li>Tenter d'accéder à des zones restreintes du site</li>
                  <li>Utiliser le site à des fins commerciales non autorisées</li>
                  <li>Perturber le fonctionnement du site</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">6</span>
                  Propriété intellectuelle
                </h2>
                <p>
                  L'ensemble du contenu du site (textes, images, vidéos, logos, supports de formation)
                  est la propriété exclusive d'ASCENDYS CONNECT ou de ses partenaires. Toute
                  reproduction, distribution ou utilisation sans autorisation est interdite.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">7</span>
                  Responsabilité
                </h2>
                <p>
                  ASCENDYS CONNECT s'efforce d'assurer l'exactitude des informations disponibles
                  sur le site, mais ne peut garantir :
                </p>
                <ul>
                  <li>La disponibilité continue du site</li>
                  <li>L'absence d'erreurs ou de bugs</li>
                  <li>La sécurité absolue contre les cyberattaques</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">8</span>
                  Protection des données personnelles
                </h2>
                <p>
                  Vos données personnelles sont traitées conformément à notre{" "}
                  <a href="/privacy-policy">politique de confidentialité</a> et aux réglementations
                  en vigueur en matière de protection des données.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">9</span>
                  Modification des CGU
                </h2>
                <p>
                  ASCENDYS CONNECT se réserve le droit de modifier les présentes CGU à tout moment.
                  Les modifications entrent en vigueur dès leur publication sur le site. Il est de
                  votre responsabilité de consulter régulièrement les CGU.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">10</span>
                  Droit applicable et juridiction
                </h2>
                <p>
                  Les présentes CGU sont régies par le droit togolais. En cas de litige, les
                  tribunaux du Togo seront seuls compétents, après tentative de résolution
                  amiable.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">11</span>
                  Contact
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <p className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Pour toute question concernant ces CGU :
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
