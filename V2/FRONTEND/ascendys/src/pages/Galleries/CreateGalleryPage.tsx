import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import VideoUploader from "@/components/common/VideoUploader";
import { galleryService } from "@/services/gallery.service";
import { useToast } from "@/context/ToastContext";
import type { GalleryType } from "@/types/content.types";

const MAX_PHOTOS = 5;

export default function CreateGalleryPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    gallery_type: "PHOTOS" as GalleryType,
    is_published: false,
  });

  const [photos, setPhotos] = useState<(File | null)[]>([null, null, null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [video, setVideo] = useState<File | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null]);

  const handlePhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotos(prev => { const next = [...prev]; next[index] = file; return next; });
    setPhotoPreviews(prev => { const next = [...prev]; next[index] = url; return next; });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => { const next = [...prev]; next[index] = null; return next; });
    setPhotoPreviews(prev => { const next = [...prev]; next[index] = null; return next; });
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
  };

  const switchType = (type: GalleryType) => {
    setForm(f => ({ ...f, gallery_type: type }));
    // Clear opposite media
    if (type === "PHOTOS") {
      setVideo(null);
    } else {
      setPhotos([null, null, null, null, null]);
      setPhotoPreviews([null, null, null, null, null]);
    }
  };

  const photoCount = photos.filter(Boolean).length;
  const canAddPhoto = photoCount < MAX_PHOTOS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { showError("Erreur", "Le titre est obligatoire."); return; }
    if (!form.description.trim()) { showError("Erreur", "La description est obligatoire."); return; }
    if (form.gallery_type === "PHOTOS" && photoCount === 0) { showError("Erreur", "Ajoutez au moins une photo."); return; }
    if (form.gallery_type === "VIDEO" && !video) { showError("Erreur", "Ajoutez une vidéo."); return; }

    setIsSubmitting(true);
    try {
      await galleryService.create({
        ...form,
        photos: form.gallery_type === "PHOTOS" ? (photos.filter(Boolean) as File[]) : undefined,
        video: form.gallery_type === "VIDEO" ? video : undefined,
      });
      showSuccess("Succès", "Médiathèque créée avec succès.");
      navigate("/admin/galleries");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de la création.";
      showError("Erreur", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Créer une médiathèque | Ascendys Connect" description="Créer une nouvelle médiathèque" />
      <PageBreadCrumb
        pageTitle="Créer une médiathèque"
        items={[{ label: "Médiathèques", path: "/admin/galleries" }]}
      />

      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-brand-500/10 to-purple-500/10 px-6 py-5 dark:border-gray-800">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <svg className="size-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Nouvelle médiathèque
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Créez une galerie de photos (max. 5) ou une vidéo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" required>Titre</Label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ex: Cérémonie de remise de diplômes 2026"
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" required>Description</Label>
              <textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Décrivez les activités ou le contexte de cette galerie..."
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Type Toggle */}
            <div>
              <Label>Type de médiathèque</Label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => switchType("PHOTOS")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                    form.gallery_type === "PHOTOS"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300"
                      : "border-gray-200 bg-white text-gray-600 hover:border-brand-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photos (max. 5)
                </button>
                <button
                  type="button"
                  onClick={() => switchType("VIDEO")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                    form.gallery_type === "VIDEO"
                      ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
                      : "border-gray-200 bg-white text-gray-600 hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Vidéo unique
                </button>
              </div>
            </div>

            {/* Photos upload zone */}
            {form.gallery_type === "PHOTOS" && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <Label>Photos <span className="ml-1 text-gray-400">({photoCount}/{MAX_PHOTOS})</span></Label>
                  {photoCount > 0 && (
                    <span className="text-xs text-gray-500">{MAX_PHOTOS - photoCount} emplacement(s) restant(s)</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
                    <div key={i} className="relative">
                      {photoPreviews[i] ? (
                        <div className="group relative overflow-hidden rounded-xl border-2 border-brand-300 bg-gray-100 dark:bg-gray-800">
                          <img
                            src={photoPreviews[i]!}
                            alt={`Photo ${i + 1}`}
                            className="h-32 w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              className="rounded-full bg-error-500 p-1.5 text-white hover:bg-error-600"
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white">
                            Photo {i + 1}
                          </span>
                        </div>
                      ) : (
                        <label
                          className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition ${
                            canAddPhoto
                              ? "border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
                              : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-50 dark:border-gray-800 dark:bg-gray-900"
                          }`}
                        >
                          <svg className="mb-1 size-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500">Photo {i + 1}</span>
                          <input
                            ref={el => { fileInputRefs.current[i] = el; }}
                            type="file"
                            accept="image/*"
                            disabled={!canAddPhoto && !photos[i]}
                            onChange={e => handlePhotoChange(i, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Formats acceptés : JPG, PNG, WEBP. Taille max. 10 MB par photo.
                </p>
              </div>
            )}

            {/* Video upload zone */}
            {form.gallery_type === "VIDEO" && (
              <div>
                <Label>Vidéo</Label>
                <div className="mt-1.5">
                  <VideoUploader
                    label=""
                    onVideoSelect={setVideo}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Formats acceptés : MP4, WebM, MOV, AVI. Taille max. 200 MB.
                </p>
              </div>
            )}

            {/* Publication toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Publier immédiatement</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rendre cette galerie visible sur le site</p>
              </div>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  form.is_published ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    form.is_published ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/galleries")}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Création...
                  </span>
                ) : (
                  "Créer la médiathèque"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
