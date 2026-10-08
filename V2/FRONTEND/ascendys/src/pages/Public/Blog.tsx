import PageMeta from "@/components/common/PageMeta";
import PublicNavbar from "@/components/public/PublicNavbar";
import PublicFooter from "@/components/public/PublicFooter";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import BlogArticlesSection from "@/components/public/BlogArticlesSection";
import JobOffersSection from "@/components/public/JobOffersSection";
import EventsSection from "@/components/public/EventsSection";

export default function Blog() {

  return (
    <>
      <PageMeta
        title="Blog - Ascendys Connect"
        description="Actualités, conseils et ressources sur la formation professionnelle, le digital et l'IT au Togo"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 py-16 text-white lg:py-20">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/imageblog.jpg)",
                opacity: 0.2,
              }}
            />
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
                Notre Blog
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-brand-100">
                Actualités, conseils et ressources pour réussir votre
                transformation digitale
              </p>
            </div>
          </section>

          {/* Blog Articles Section */}
          <BlogArticlesSection />

          {/* Job Offers Section */}
          <JobOffersSection />

          {/* Events Section */}
          <EventsSection />
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
