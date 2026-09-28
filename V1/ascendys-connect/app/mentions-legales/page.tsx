import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales d'ASCENDYS CONNECT.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <section
        className="section-py"
        style={{ background: "linear-gradient(135deg, #0d0025 0%, #1a0050 40%, #4208A1 100%)" }}
      >
        <div className="container-xl">
          <span className="badge badge-white mb-5 inline-block">Légal</span>
          <h1 className="text-4xl font-extrabold text-white mb-4" style={{ color: "#FFFFFF" }} >Mentions légales</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-xl max-w-3xl">
          <div className="prose">
            <h2 style={{ color: "#9800BF" , marginTop: "18px"}}>Éditeur du site</h2>
            <p>
              <strong>ASCENDYS CONNECT</strong><br />
              Lomé, Kpota colas, collés à la pharmacie MAELYS — Togo<br />
              Téléphone : +228 96 49 82 82<br />
              Email : contact@ascendys-group.com<br />
              Site : www.ascendys-group.com
            </p>

            <h2 style={{ color: "#9800BF" }}>Hébergement</h2>
            <p>
              Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701,
              San Francisco, California 94104, États-Unis.
            </p>

            <h2 style={{ color: "#9800BF" }}>Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos,
              graphismes) est la propriété exclusive d&apos;ASCENDYS CONNECT et est
              protégé par les lois en vigueur sur la propriété intellectuelle.
              Toute reproduction, même partielle, est interdite sans
              autorisation préalable écrite.
            </p>

            <h2 style={{ color: "#9800BF" }}>Limitation de responsabilité</h2>
            <p>
              ASCENDYS CONNECT s&apos;efforce de maintenir les informations publiées
              sur ce site exactes et à jour. Toutefois, elle ne saurait
              garantir l&apos;exactitude, la complétude ou l&apos;actualité des
              informations diffusées sur le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
