import { useState } from 'react';
import { Camera, Video } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';
import { useApi } from '@/hooks/useApi';
import type { Gallery } from '@/types/content.types';

export default function Gallery() {
  const { data: galleries, isLoading } = useApi<Gallery[]>(
    '/media/galleries/?is_published=true',
    { defaultValue: [] }
  );

  const [filter, setFilter] = useState<'ALL' | 'PHOTOS' | 'VIDEO'>('ALL');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const filteredGalleries =
    filter === 'ALL'
      ? galleries
      : galleries.filter((g) => g.gallery_type === filter);

  return (
    <>
      <PageMeta
        title="Notre Médiathèque - Ascendys Connect"
        description="Découvrez nos formations, événements et moments forts en images"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicNavbar />

        <main className="pt-20">
          {/* Hero Section */}
          <section
            className="py-16 text-white"
            style={{
              background: 'linear-gradient(135deg, #0d0025 0%, #1a0050 40%, #9800BF 100%)',
            }}
          >
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="mb-4 text-4xl font-bold">Notre Médiathèque</h1>
              <p className="text-xl text-white/80">
                Découvrez nos formations, événements et moments forts en images
              </p>
            </div>
          </section>

          {/* Filtres */}
          <section className="bg-gray-50 py-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                    filter === 'ALL'
                      ? 'bg-[#9800BF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('PHOTOS')}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                    filter === 'PHOTOS'
                      ? 'bg-[#9800BF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setFilter('VIDEO')}
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                    filter === 'VIDEO'
                      ? 'bg-[#9800BF] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  Vidéos
                </button>
              </div>
            </div>
          </section>

          {/* Gallery Grid */}
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {filteredGalleries.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredGalleries.map((gallery) => (
                        <div
                          key={gallery.id}
                          className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all hover:shadow-2xl"
                          onClick={() => {
                            setSelectedGallery(gallery);
                            setPhotoIndex(0);
                          }}
                        >
                          {/* Image couverture */}
                          <div className="aspect-[4/3]">
                            {gallery.cover_image_url ? (
                              <img
                                src={gallery.cover_image_url}
                                alt={gallery.title}
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-900 to-purple-600">
                                {gallery.gallery_type === 'VIDEO' ? (
                                  <Video className="size-16 text-white/50" />
                                ) : (
                                  <Camera className="size-16 text-white/50" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h3 className="mb-1 text-lg font-bold">{gallery.title}</h3>
                              {gallery.description && (
                                <p className="line-clamp-2 text-sm text-white/80">
                                  {gallery.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Badge */}
                          <div className="absolute right-3 top-3">
                            {gallery.gallery_type === 'PHOTOS' ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9800BF] px-3 py-1 text-xs font-semibold text-white">
                                <Camera className="size-3" />
                                {gallery.photos_count ?? 0} photo(s)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFC000] px-3 py-1 text-xs font-semibold text-gray-900">
                                <Video className="size-3" />
                                Vidéo
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Aucun contenu dans cette catégorie
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Lightbox Modal */}
          {selectedGallery && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedGallery(null)}
            >
              {/* Bouton fermer */}
              <button
                className="absolute right-4 top-4 z-10 text-4xl font-light text-white hover:text-gray-300"
                onClick={() => setSelectedGallery(null)}
              >
                ×
              </button>

              <div
                className="relative w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-4 text-center text-xl font-bold text-white">
                  {selectedGallery.title}
                </h3>

                {selectedGallery.gallery_type === 'PHOTOS' ? (
                  // Carousel photos
                  (() => {
                    const photos = [
                      selectedGallery.photo_1_url,
                      selectedGallery.photo_2_url,
                      selectedGallery.photo_3_url,
                      selectedGallery.photo_4_url,
                      selectedGallery.photo_5_url,
                    ].filter((p): p is string => Boolean(p));

                    return (
                      <div className="relative">
                        {photos.length > 0 ? (
                          <img
                            src={photos[photoIndex]}
                            alt={`${selectedGallery.title} - ${photoIndex + 1}`}
                            className="max-h-[70vh] w-full rounded-lg object-contain"
                          />
                        ) : (
                          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-800">
                            <p className="text-white/50">Aucune photo disponible</p>
                          </div>
                        )}

                        {photos.length > 1 && (
                          <>
                            <button
                              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                              onClick={() =>
                                setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)
                              }
                            >
                              ←
                            </button>
                            <button
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
                              onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}
                            >
                              →
                            </button>
                            <p className="mt-3 text-center text-sm text-white/60">
                              {photoIndex + 1} / {photos.length}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })()
                ) : // Vidéo
                selectedGallery.video_url ? (
                  <video
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] rounded-lg"
                    src={selectedGallery.video_url}
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg bg-gray-800">
                    <p className="text-white/50">Vidéo non disponible</p>
                  </div>
                )}

                {selectedGallery.description && (
                  <p className="mt-4 text-center text-sm text-white/70">
                    {selectedGallery.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </main>

        <PublicFooter />
        <WhatsAppButton />
      </div>
    </>
  );
}
