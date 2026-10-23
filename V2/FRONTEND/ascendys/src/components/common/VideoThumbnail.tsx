import { useRef, useState } from "react";

interface VideoThumbnailProps {
  /** URL of the video file to preview. */
  src: string;
  /** Optional cover image shown while the video frame loads. */
  poster?: string | null;
  /** Classes applied to the video element (and to the error fallback). */
  className?: string;
  /** Show a centered play button over the frame. */
  showPlayButton?: boolean;
}

/**
 * Displays a still frame of a video as a thumbnail (like YouTube), so a video
 * can be previewed before it is played.
 *
 * Only the video metadata is requested; we then seek a fraction of a second
 * into the video so the browser renders the first meaningful frame instead of
 * a black/empty box.
 */
export default function VideoThumbnail({
  src,
  poster,
  className = "",
  showPlayButton = true,
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-600 ${className}`}
      >
        <svg
          className="size-12 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={`${src}#t=0.1`}
        poster={poster ?? undefined}
        muted
        playsInline
        preload="metadata"
        className={className}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;
          const target =
            video.duration > 0 ? Math.min(0.1, video.duration / 2) : 0.1;
          try {
            video.currentTime = target;
          } catch {
            // Some browsers refuse programmatic seeks; the #t fragment still applies.
          }
        }}
        onError={() => setHasError(true)}
      />
      {showPlayButton && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition duration-300 group-hover:scale-110">
            <svg
              className="size-6 translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      )}
    </>
  );
}
