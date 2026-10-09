import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import { Scale, Building, User, Server, Copyright, AlertCircle } from "lucide-react";

export default function LegalNotice() {
  return (
    <>
      <PageMeta
        title="Mentions Légales - Ascendys Connect"
        description="Mentions légales du site Ascendys Connect"
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
                backgroundImage: "url(/Mlegal.jpg)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/70 to-brand-800/70" />
            
            <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
                  <Scale size={40} className="text-white" />
                </div>
              </div>
              <h1 className="text-center text-4xl font-bold sm:text-5xl mb-4">
                Mentions Légales
              </h1>
              <p className="text-center text-xl text-brand-100 max-w-2xl mx-auto">
                Informations légales et responsabilités du site Ascendys Connect
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              
              <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400">
                
                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">1</span>
                  Éditeur du site
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border-2 border-brand-200 bg-brand-50 p-8 dark:border-brand-900 dark:bg-brand-950/30">
                    <div className="flex items-start gap-4 mb-6">
                      <Building size={28} className="shrink-0 text-brand-600 dark:text-brand-400" />
                      <div>
                        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                          ASCENDYS CONNECT
                        </h3>
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                          <p><strong className="text-gray-900 dark:text-white">Statut :</strong> Organisme de formation professionnelle</p>
                          <p><strong className="text-gray-900 dark:text-white">Siège social :</strong> Lomé, Togo</p>
                          <p><strong className="text-gray-900 dark:text-white">Email :</strong> <a href="mailto:contact@ascendysconnect.com" className="text-brand-600 hover:underline dark:text-brand-400">contact@ascendysconnect.com</a></p>
                          <p><strong className="text-gray-900 dark:text-white">Téléphone :</strong> <a href="tel:+22896498282" className="text-brand-600 hover:underline dark:text-brand-400">+228 96 49 82 82</a></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">2</span>
                  Directeur de publication
                </h2>
                <div className="not-prose my-6">
                  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <User size={24} className="shrink-0 text-brand-600 dark:text-brand-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      Le directeur de la publication est le <strong className="text-gray-900 dark:text-white">représentant légal</strong> d'ASCENDYS CONNECT.
                    </p>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">3</span>
                  Hébergement
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex items-start gap-4">
                      <Server size={24} className="shrink-0 text-brand-600 dark:text-brand-400" />
                      <div className="space-y-2 text-gray-700 dark:text-gray-300">
                        <p><strong className="text-gray-900 dark:text-white">Hébergeur :</strong> [Nom de l'hébergeur]</p>
                        <p><strong className="text-gray-900 dark:text-white">Adresse :</strong> [Adresse de l'hébergeur]</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Informations à compléter selon votre hébergeur
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">4</span>
                  Propriété intellectuelle
                </h2>
                <div className="not-prose my-6 rounded-2xl border-2 border-purple-200 bg-purple-50 p-8 dark:border-purple-900 dark:bg-purple-950/30">
                  <div className="flex gap-4">
                    <Copyright size={24} className="shrink-0 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                        Protection du contenu
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        L'ensemble du contenu de ce site (textes, images, vidéos, logos, supports
                        de formation) est la propriété exclusive d'<strong>ASCENDYS CONNECT</strong>,
                        sauf mention contraire.
                      </p>
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        Toute reproduction, distribution, modification ou utilisation sans
                        autorisation préalable écrite est <strong>strictement interdite</strong> et
                        peut faire l'objet de poursuites.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">5</span>
                  Données personnelles
                </h2>
                <p>
                  Conformément à la loi en vigueur, vous disposez d'un droit d'accès, de
                  rectification et de suppression des données vous concernant.
                </p>
                <p>
                  Pour exercer ces droits ou pour toute question sur le traitement de vos données
                  personnelles, consultez notre{" "}
                  <a href="/privacy-policy">politique de confidentialité</a> ou contactez-nous à
                  l'adresse : <a href="mailto:contact@ascendysconnect.com">contact@ascendysconnect.com</a>
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">6</span>
                  Cookies
                </h2>
                <p>
                  Ce site utilise des cookies pour améliorer votre expérience de navigation et
                  analyser le trafic. Pour plus d'informations sur les cookies que nous utilisons
                  et comment les gérer, consultez notre{" "}
                  <a href="/cookies">politique de cookies</a>.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">7</span>
                  Limitation de responsabilité
                </h2>
                <div className="not-prose my-6 rounded-2xl border-2 border-orange-200 bg-orange-50 p-8 dark:border-orange-900 dark:bg-orange-950/30">
                  <div className="flex gap-4">
                    <AlertCircle size={24} className="shrink-0 text-orange-600 dark:text-orange-400" />
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <p>
                        ASCENDYS CONNECT met tout en œuvre pour offrir des informations fiables et
                        à jour, mais ne peut garantir :
                      </p>
                      <ul className="space-y-1 pl-5 list-disc">
                        <li>L'exactitude, la précision ou l'exhaustivité des informations</li>
                        <li>La disponibilité continue du site sans interruption</li>
                        <li>L'absence totale d'erreurs ou de bugs</li>
                        <li>L'absence de virus ou autres éléments nuisibles</li>
                      </ul>
                      <p className="mt-3">
                        L'utilisateur est seul responsable de l'utilisation qu'il fait des
                        informations disponibles sur le site.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">8</span>
                  Liens hypertextes
                </h2>
                <p>
                  Le site peut contenir des liens vers d'autres sites web. ASCENDYS CONNECT
                  n'exerce aucun contrôle sur ces sites tiers et décline toute responsabilité quant
                  à :
                </p>
                <ul>
                  <li>Leur contenu</li>
                  <li>Leur disponibilité</li>
                  <li>Leurs pratiques en matière de confidentialité</li>
                  <li>Les dommages pouvant résulter de leur utilisation</li>
                </ul>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">9</span>
                  Droit applicable et juridiction
                </h2>
                <p>
                  Les présentes mentions légales sont régies par le droit togolais. En cas de
                  litige, et à défaut de solution amiable, les tribunaux togolais seront seuls
                  compétents.
                </p>

                <h2 className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">10</span>
                  Contact
                </h2>
                <div className="not-prose my-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
                    <p className="mb-4 font-semibold text-gray-900 dark:text-white">
                      Pour toute question concernant ces mentions légales :
                    </p>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p><strong>Email :</strong> <a href="mailto:contact@ascendysconnect.com" className="text-brand-600 hover:underline dark:text-brand-400">contact@ascendysconnect.com</a></p>
                      <p><strong>Téléphone :</strong> <a href="tel:+22896498282" className="text-brand-600 hover:underline dark:text-brand-400">+228 96 49 82 82</a></p>
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
