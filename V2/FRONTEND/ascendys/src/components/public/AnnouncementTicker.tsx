import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Zap, BookOpen, Star, Newspaper } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import type { Training } from "@/types/content.types";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category_name?: string;
  is_featured?: boolean;
}

interface TickerItem {
  id: string;
  type: "training" | "blog";
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function AnnouncementTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);

  const { data: trainings } = useApi<Training[]>(
    "/trainings/?is_featured=true&status=PUBLISHED&page_size=6",
    { defaultValue: [] }
  );

  const { data: blogPosts } = useApi<BlogPost[]>(
    "/blog/?is_featured=true&status=PUBLISHED&page_size=6",
    { defaultValue: [] }
  );

  // Combiner les items
  const items: TickerItem[] = [
    ...trainings.map((t) => ({
      id: `training-${t.id}`,
      type: "training" as const,
      label: t.title,
      href: `/trainings/${t.slug}`,
      icon: <BookOpen className="size-3.5 shrink-0" />,
      badge: t.category_name,
    })),
    ...blogPosts.map((b) => ({
      id: `blog-${b.id}`,
      type: "blog" as const,
      label: b.title,
      href: `/blog/${b.slug}`,
      icon: <Newspaper className="size-3.5 shrink-0" />,
      badge: b.category_name,
    })),
  ];

  // Ne rien afficher si aucun item
  if (items.length === 0) return null;

  // Dupliquer pour le défilement infini
  const allItems = [...items, ...items];

  return (
    <div className="relative z-40 overflow-hidden border-b border-purple-800/40 bg-gradient-to-r from-[#1a0033] via-[#2d0057] to-[#1a0033]">
      <div className="flex items-stretch">
        {/* Label gauche fixe */}
        <div className="flex shrink-0 items-center gap-2 border-r border-purple-700/50 bg-[#9800BF] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
          <Zap className="size-3.5 animate-pulse" />
          <span className="hidden sm:block">À la une</span>
          <Star className="size-3 fill-current text-yellow-300 sm:hidden" />
        </div>

        {/* Zone défilante */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={tickerRef}
            className="ticker-track flex items-center gap-0 whitespace-nowrap py-2"
            style={{
              animation: `ticker-scroll ${Math.max(20, allItems.length * 6)}s linear infinite`,
            }}
          >
            {allItems.map((item, i) => (
              <span key={`${item.id}-${i}`} className="inline-flex items-center">
                {/* Séparateur */}
                {i > 0 && (
                  <span className="mx-4 text-purple-500/60 select-none">◆</span>
                )}

                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1.5 text-sm text-purple-200 transition-colors hover:text-[#FFC000]"
                >
                  {item.icon}
                  {item.badge && (
                    <span className="rounded bg-purple-700/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-purple-300">
                      {item.badge}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              </span>
            ))}
          </div>

          {/* Dégradés de fondu sur les bords */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#1a0033] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#1a0033] to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
