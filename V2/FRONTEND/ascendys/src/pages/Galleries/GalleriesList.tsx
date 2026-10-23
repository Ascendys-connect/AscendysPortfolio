import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import VideoThumbnail from "@/components/common/VideoThumbnail";
import { useApi } from "@/hooks/useApi";
import { galleryService } from "@/services/gallery.service";
import { useToast } from "@/context/ToastContext";
import type { Gallery } from "@/types/content.types";

type EditPhotoSlot = {
  file: File | null;
  previewUrl: string | null;
  existingUrl: string | null;
  removed: boolean;
};

const emptyEditPhotoSlots = (): EditPhotoSlot[] =>
  Array.from({ length: 5 }, () => ({
    file: null,
    previewUrl: null,
    existingUrl: null,
    removed: false,
  }));

export default function GalleriesList() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [filterType, setFilterType] = useState<string>("all");
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewGallery, setViewGallery] = useState<Gallery | null>(null);

  // Edit modal state
  const [editGallery, setEditGallery] = useState<Gallery | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    is_published: false,
  });
  const [editPhotos, setEditPhotos] = useState<EditPhotoSlot[]>(emptyEditPhotoSlots);
  const [editVideo, setEditVideo] = useState<File | null>(null);
  const [editVideoPreview, setEditVideoPreview] = useState<string | null>(null);
  const editPhotoInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const editVideoInputRef = useRef<HTMLInputElement | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: galleriesRaw, isLoading, refetch } = useApi<any>("/media/galleries/", {
    defaultValue: [],
  });

  // Support both paginated and flat responses
  const galleries: Gallery[] = Array.isArray(galleriesRaw)
    ? galleriesRaw
    : (galleriesRaw as any)?.data ?? [];

  const filtered = galleries.filter(g => filterType === "all" || g.gallery_type === filterType);

  const photoCount = galleries.filter(g => g.gallery_type === "PHOTOS").length;
  const videoCount = galleries.filter(g => g.gallery_type === "VIDEO").length;
  const publishedCount = galleries.filter(g => g.is_published).length;

  const allPhotos = (g: Gallery) =>
    [g.photo_1_url, g.photo_2_url, g.photo_3_url, g.photo_4_url, g.photo_5_url].filter(Boolean) as string[];

  // Quick toggle is_published
  const handleToggleStatus = async (gallery: Gallery, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTogglingId(gallery.id);
    try {
      await galleryService.togglePublish(gallery.id);
      showSuccess(
        "Statut mis à jour",
        `"${gallery.title}" est maintenant ${!gallery.is_published ? "publié" : "en brouillon"}.`
      );
      refetch();
    } catch {
      showError("Erreur", "Impossible de modifier le statut de cette médiathèque.");
    } finally {
      setTogglingId(null);
    }
  };

  // Open edit modal
  const handleOpenEdit = (gallery: Gallery, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditGallery(gallery);
    setEditForm({
      title: gallery.title,
      description: gallery.description,
      is_published: gallery.is_published,
    });
    setEditPhotos(
      emptyEditPhotoSlots().map((slot, i) => ({
        ...slot,
        existingUrl:
          (gallery[`photo_${i + 1}_url` as keyof Gallery] as string | null) ?? null,
      }))
    );
    setEditVideo(null);
    setEditVideoPreview(null);
  };

  // Edit modal: replace/add a photo
  const handleEditPhotoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditPhotos(prev => {
      const next = [...prev];
      const previous = next[index];
      if (previous.previewUrl) URL.revokeObjectURL(previous.previewUrl);
      next[index] = { ...previous, file, previewUrl: url, removed: false };
      return next;
    });
  };

  // Edit modal: remove a photo (existing or freshly picked)
  const handleEditPhotoRemove = (index: number) => {
    setEditPhotos(prev => {
      const next = [...prev];
      const slot = next[index];
      if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
      next[index] = { ...slot, file: null, previewUrl: null, removed: true };
      return next;
    });
    if (editPhotoInputRefs.current[index]) editPhotoInputRefs.current[index]!.value = "";
  };

  // Edit modal: pick a replacement video
  const handleEditVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (editVideoPreview) URL.revokeObjectURL(editVideoPreview);
    setEditVideo(file);
    setEditVideoPreview(URL.createObjectURL(file));
  };

  const editPhotoCount = editPhotos.filter(
    slot => slot.file || (slot.existingUrl && !slot.removed)
  ).length;

  // Submit edit modal
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGallery) return;

    if (!editForm.title.trim()) {
      showError("Validation", "Le titre est obligatoire.");
      return;
    }

    const isPhotos = editGallery.gallery_type === "PHOTOS";
    if (isPhotos && editPhotoCount === 0) {
      showError("Validation", "Conservez ou ajoutez au moins une photo.");
      return;
    }
    if (!isPhotos && !editVideo && !editGallery.video_url) {
      showError("Validation", "Ajoutez une vidéo.");
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", editForm.title.trim());
      formData.append("description", editForm.description.trim());
      formData.append("is_published", String(editForm.is_published));

      if (isPhotos) {
        editPhotos.forEach((slot, i) => {
          const key = `photo_${i + 1}`;
          if (slot.file) {
            formData.append(key, slot.file);
          } else if (slot.removed && slot.existingUrl) {
            // Empty string tells the API to clear this slot.
            formData.append(key, "");
          }
        });
      } else if (editVideo) {
        formData.append("video", editVideo);
      }

      await galleryService.update(editGallery.id, formData);
      showSuccess("Médiathèque modifiée", `"${editForm.title}" a été mise à jour avec succès.`);
      setEditGallery(null);
      refetch();
    } catch (err: any) {
      const data = err?.response?.data;
      let msg = "Une erreur est survenue lors de la mise à jour.";
      if (typeof data?.message === "string") msg = data.message;
      else if (typeof data?.detail === "string") msg = data.detail;
      else if (data && typeof data === "object") {
        const first = Object.values(data)[0];
        if (Array.isArray(first) && typeof first[0] === "string") msg = first[0];
        else if (typeof first === "string") msg = first;
      }
      showError("Erreur", msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!galleryToDelete) return;
    setIsDeleting(true);
    try {
      await galleryService.delete(galleryToDelete.id);
      showSuccess("Supprimé", `La médiathèque "${galleryToDelete.title}" a été supprimée.`);
      setGalleryToDelete(null);
      refetch();
    } catch {
      showError("Erreur", "Impossible de supprimer cette médiathèque.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Médiathèques | Ascendys Connect"
        description="Gérez les galeries photos et vidéos"
      />

      <PageHeader
        title="Médiathèques"
        description="Galeries de photos et vidéos retraçant les activités"
        actions={
          <Button
            size="sm"
            className="inline-flex items-center gap-2"
            onClick={() => navigate("/admin/galleries/create")}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle médiathèque
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total",
            value: galleries.length,
            icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
            bg: "bg-brand-50 text-brand-600 dark:bg-brand-950/30 dark:text-brand-400",
          },
          {
            label: "Photos",
            value: photoCount,
            icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
            bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
          },
          {
            label: "Vidéos",
            value: videoCount,
            icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
            bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
          },
          {
            label: "Publiées",
            value: publishedCount,
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters (Clean icons, no emojis) */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterType("all")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            filterType === "all"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          } border border-gray-200 dark:border-gray-700`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Tous
        </button>

        <button
          onClick={() => setFilterType("PHOTOS")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            filterType === "PHOTOS"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          } border border-gray-200 dark:border-gray-700`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Photos
        </button>

        <button
          onClick={() => setFilterType("VIDEO")}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            filterType === "VIDEO"
              ? "bg-purple-600 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          } border border-gray-200 dark:border-gray-700`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Vidéos
        </button>

        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} médiathèque{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <svg className="size-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Aucune médiathèque</p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Commencez par créer votre première galerie.</p>
          <Button className="mt-5" size="sm" onClick={() => navigate("/admin/galleries/create")}>
            Créer une médiathèque
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(gallery => {
            const photos = allPhotos(gallery);
            const cover = gallery.cover_image_url || photos[0] || null;
            const isPub = gallery.is_published;
            const isToggling = togglingId === gallery.id;

            return (
              <div
                key={gallery.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Media Preview Area */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  onClick={() => setViewGallery(gallery)}
                >
                  {gallery.gallery_type === "PHOTOS" ? (
                    cover ? (
                      <div className="relative">
                        <img
                          src={cover}
                          alt={gallery.title}
                          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        {photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            {photos.slice(0, 3).map((p, i) => (
                              <img key={i} src={p} alt="" className="size-8 rounded-md border-2 border-white object-cover shadow" />
                            ))}
                            {photos.length > 3 && (
                              <div className="flex size-8 items-center justify-center rounded-md border-2 border-white bg-black/60 text-xs text-white shadow">
                                +{photos.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-950/20 dark:to-blue-950/20">
                        <svg className="size-12 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )
                  ) : gallery.video_url ? (
                    <VideoThumbnail
                      src={gallery.video_url}
                      poster={gallery.cover_image_url}
                      className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-950/20">
                      <svg className="size-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Type Badge (clean SVG, no emoji) */}
                  <span className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${
                    gallery.gallery_type === "PHOTOS"
                      ? "bg-blue-600/90 text-white"
                      : "bg-purple-600/90 text-white"
                  }`}>
                    {gallery.gallery_type === "PHOTOS" ? (
                      <>
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{gallery.photos_count ?? photos.length} photo{(gallery.photos_count ?? photos.length) > 1 ? "s" : ""}</span>
                      </>
                    ) : (
                      <>
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Vidéo</span>
                      </>
                    )}
                  </span>

                  {/* Interactive Status Badge (clickable to toggle) */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(gallery, e)}
                    disabled={isToggling}
                    title="Cliquer pour changer le statut"
                    className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md transition hover:scale-105 active:scale-95 ${
                      isPub
                        ? "bg-emerald-600/90 text-white hover:bg-emerald-700"
                        : "bg-gray-800/80 text-gray-200 hover:bg-gray-900"
                    }`}
                  >
                    {isToggling ? (
                      <div className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <span className={`size-1.5 rounded-full ${isPub ? "bg-white" : "bg-amber-400"}`} />
                    )}
                    <span>{isPub ? "Publié" : "Brouillon"}</span>
                  </button>
                </div>

                {/* Info & Card Actions */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-semibold text-gray-800 dark:text-white">
                    {gallery.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-xs text-gray-500 dark:text-gray-400">
                    {gallery.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(gallery.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      {/* Button: Change Status */}
                      <button
                        onClick={(e) => handleToggleStatus(gallery, e)}
                        disabled={isToggling}
                        className={`rounded-lg p-1.5 transition ${
                          isPub
                            ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            : "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                        }`}
                        title={isPub ? "Dépublier (passer en brouillon)" : "Publier"}
                      >
                        {isToggling ? (
                          <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : isPub ? (
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                      </button>

                      {/* Button: Edit Gallery */}
                      <button
                        onClick={(e) => handleOpenEdit(gallery, e)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-brand-50 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-brand-950/30 dark:hover:text-brand-400"
                        title="Modifier"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Button: View */}
                      <button
                        onClick={() => setViewGallery(gallery)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                        title="Voir"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      {/* Button: Delete */}
                      <button
                        onClick={() => setGalleryToDelete(gallery)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-error-50 hover:text-error-500 dark:text-gray-400 dark:hover:bg-error-900/30 dark:hover:text-error-400"
                        title="Supprimer"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Gallery Modal */}
      {editGallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setEditGallery(null)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <svg className="size-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier la médiathèque
              </h3>
              <button
                onClick={() => setEditGallery(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 p-6">
              {/* Type reminder badge */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                <span className="font-medium">Type :</span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                  {editGallery.gallery_type === "PHOTOS" ? (
                    <>
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Galerie Photos ({editGallery.photos_count ?? allPhotos(editGallery).length} photos)
                    </>
                  ) : (
                    <>
                      <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Galerie Vidéo
                    </>
                  )}
                </span>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="edit-title" required>Titre</Label>
                <input
                  id="edit-title"
                  type="text"
                  value={editForm.title}
                  onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="edit-desc" required>Description</Label>
                <textarea
                  id="edit-desc"
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>

              {/* Media editing */}
              {editGallery.gallery_type === "PHOTOS" ? (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>
                      Photos <span className="ml-1 text-gray-400">({editPhotoCount}/5)</span>
                    </Label>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Survolez une photo pour la remplacer ou la supprimer
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {editPhotos.map((slot, i) => {
                      const preview = slot.previewUrl || (!slot.removed ? slot.existingUrl : null);
                      return (
                        <div key={i} className="relative">
                          {preview ? (
                            <div className="group relative overflow-hidden rounded-xl border-2 border-brand-300 bg-gray-100 dark:bg-gray-800">
                              <img src={preview} alt={`Photo ${i + 1}`} className="h-28 w-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 transition group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => editPhotoInputRefs.current[i]?.click()}
                                  className="rounded-full bg-white/90 p-1.5 text-gray-800 hover:bg-white"
                                  title="Remplacer la photo"
                                >
                                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditPhotoRemove(i)}
                                  className="rounded-full bg-error-500 p-1.5 text-white hover:bg-error-600"
                                  title="Supprimer la photo"
                                >
                                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                                {slot.file ? "Nouvelle" : `Photo ${i + 1}`}
                              </span>
                              <input
                                ref={el => { editPhotoInputRefs.current[i] = el; }}
                                type="file"
                                accept="image/*"
                                onChange={e => handleEditPhotoChange(i, e)}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600">
                              <svg className="mb-1 size-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-xs text-gray-500">Photo {i + 1}</span>
                              <input
                                ref={el => { editPhotoInputRefs.current[i] = el; }}
                                type="file"
                                accept="image/*"
                                onChange={e => handleEditPhotoChange(i, e)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Formats acceptés : JPG, PNG, WEBP. Taille max. 10 MB par photo.
                  </p>
                </div>
              ) : (
                <div>
                  <Label>Vidéo</Label>
                  <div className="mt-1.5">
                    {editVideoPreview || editGallery.video_url ? (
                      <div className="relative">
                        <video
                          src={editVideoPreview || editGallery.video_url || undefined}
                          controls
                          className="w-full rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => editVideoInputRef.current?.click()}
                          className="absolute top-2 end-2 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-brand-700"
                        >
                          Remplacer la vidéo
                        </button>
                        {editVideo && (
                          <span className="absolute bottom-2 left-2 rounded-md bg-brand-600 px-2 py-0.5 text-[10px] text-white">
                            Nouvelle vidéo
                          </span>
                        )}
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                        <svg className="mb-2 size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        <p className="text-sm text-gray-500">Cliquer pour télécharger une vidéo</p>
                      </label>
                    )}
                    <input
                      ref={editVideoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleEditVideoChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Sélectionnez un nouveau fichier pour remplacer la vidéo actuelle.
                  </p>
                </div>
              )}

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3.5 dark:border-gray-800">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Statut de publication</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {editForm.is_published ? "Visible publiquement par tous les visiteurs" : "Enregistré en brouillon privé"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm(f => ({ ...f, is_published: !f.is_published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    editForm.is_published ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block size-4 transform rounded-full bg-white transition ${
                      editForm.is_published ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditGallery(null)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewGallery && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setViewGallery(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{viewGallery.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{viewGallery.description}</p>
              </div>
              <button
                onClick={() => setViewGallery(null)}
                className="ml-4 shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="p-5">
              {viewGallery.gallery_type === "PHOTOS" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {allPhotos(viewGallery).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-full rounded-xl object-cover shadow"
                      style={{ aspectRatio: "4/3" }}
                    />
                  ))}
                </div>
              ) : viewGallery.video_url ? (
                <video
                  src={viewGallery.video_url}
                  controls
                  className="w-full rounded-xl shadow"
                />
              ) : (
                <p className="text-center text-gray-400">Aucun média disponible.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!galleryToDelete}
        onClose={() => setGalleryToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la médiathèque"
        message={`Êtes-vous sûr de vouloir supprimer "${galleryToDelete?.title}" ? Tous les fichiers associés seront définitivement perdus.`}
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
