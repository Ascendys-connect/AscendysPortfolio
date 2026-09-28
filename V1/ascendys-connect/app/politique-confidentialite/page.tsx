import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données d'ASCENDYS CONNECT.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section
        className="section-py"
        style={{ background: "linear-gradient(135deg, #0d0025 0%, #1a0050 40%, #4208A1 100%)" }}
      >
        <div className="container-xl">
          <span className="badge badge-white mb-5 inline-block">Légal</span>
          <h1 className="text-4xl font-extrabold text-white mb-4" style={{ color: "#FFFFFF" }}>
            Politique de confidentialité
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <div className="prose">
            <h2 style={{ color: "#9800BF", marginTop: "18px" }}>Collecte des données</h2>
            <p>
              ASCENDYS CONNECT collecte des données personnelles uniquement
              lorsque vous remplissez le formulaire de contact ou soumettez une
              demande d&apos;inscription à une formation. Les données collectées
              incluent : nom, prénom, adresse email, numéro de téléphone et
              message.
            </p>

            <h2 style={{ color: "#9800BF" }}>Utilisation des données</h2>
            <p>
              Les données collectées sont utilisées exclusivement pour répondre
              à vos demandes, vous informer de nos formations et services, et
              améliorer notre offre. Elles ne sont jamais vendues ni transmises
              à des tiers à des fins commerciales.
            </p>

            <h2 style={{ color: "#9800BF" }}>Conservation des données</h2>
            <p>
              Vos données sont conservées pendant une durée maximale de 3 ans
              à compter de votre dernière interaction avec ASCENDYS CONNECT.
            </p>

            <h2 style={{ color: "#9800BF" }}>Vos droits</h2>
            <p>
              Conformément à la réglementation applicable, vous disposez d&apos;un
              droit d&apos;accès, de rectification, de suppression et de portabilité
              de vos données. Pour exercer ces droits, contactez-nous à :{" "}
              <a
                href="mailto:contact@ascendys-group.com"
                style={{ color: "#9800BF" }}
              >
                contact@ascendys-group.com
              </a>
            </p>

            <h2 style={{ color: "#9800BF" }}>Cookies</h2>
            <p>
              Ce site peut utiliser des cookies techniques nécessaires à son
              bon fonctionnement. Aucun cookie publicitaire ou de traçage
              tiers n&apos;est utilisé sans votre consentement.
            </p>

            <h2 style={{ color: "#9800BF" }}>Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données :<br />
              Email : contact@ascendys-group.com<br />
              Téléphone : +228 96 49 82 82
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
