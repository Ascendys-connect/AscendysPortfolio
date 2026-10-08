/**
 * Page de détail d'un article de blog
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { blogPostsService } from '@/services/blog.service';
import type { BlogPost } from '@/types/content.types';
import PublicNavbar from '@/components/public/PublicNavbar';
import PageMeta from '@/components/common/PageMeta';
import { 
  Calendar, 
  Clock, 
  Tag as TagIcon, 
  User, 
  ArrowLeft, 
  Share2, 
  Eye 
} from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }
    
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data: any = await blogPostsService.getBySlug(slug!);
      // Handle both wrapped and unwrapped responses
      const article = data?.data || data;
      setArticle(article);
    } catch (err: any) {
      console.error('Erreur chargement article:', err);
      setError('Article introuvable');
      setTimeout(() => navigate('/blog'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier');
    }
  };

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#9800BF]" />
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {error || 'Article introuvable'}
            </h1>
            <button
              onClick={() => navigate('/blog')}
              className="mt-4 text-[#9800BF] hover:text-[#7a0099]"
            >
              Retour au blog
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${article.title} | Blog Ascendys Connect`}
        description={article.excerpt}
      />
      
      <PublicNavbar />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-[#9800BF] dark:text-gray-400">
              Accueil
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/blog" className="text-gray-600 hover:text-[#9800BF] dark:text-gray-400">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[400px] w-full overflow-hidden bg-gray-900">
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            {article.category_name && (
              <span className="inline-block rounded-full bg-[#FFC000] px-4 py-1 text-sm font-semibold text-gray-900">
                {article.category_name}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
              {/* Main Content */}
              <div>
                {/* Article Meta */}
                <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-[#9800BF]" />
                    <span>{article.author_name || 'Ascendys Connect'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-[#9800BF]" />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-[#9800BF]" />
                    <span>{article.reading_time} min de lecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="size-4 text-[#9800BF]" />
                    <span>{article.views_count} vues</span>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
                  <p className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {article.excerpt}
                  </p>
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#9800BF] prose-a:text-[#9800BF] prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <TagIcon className="size-4 text-[#9800BF]" />
                      {article.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="mt-8">
                  <button
                    onClick={() => navigate('/blog')}
                    className="flex items-center gap-2 text-[#9800BF] hover:text-[#7a0099]"
                  >
                    <ArrowLeft className="size-4" />
                    Retour au blog
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:sticky lg:top-4 lg:h-fit">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#9800BF] px-4 py-3 font-medium text-white transition hover:bg-[#7a0099]"
                  >
                    <Share2 className="size-4" />
                    Partager l'article
                  </button>

                  {/* Author Info */}
                  <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                      À propos de l'auteur
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-[#9800BF] text-white">
                        <User className="size-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {article.author_name || 'Ascendys Connect'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Rédacteur
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  {article.category_name && (
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
                      <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Catégorie
                      </h3>
                      <span className="inline-block rounded-full bg-[#FFC000] px-4 py-2 text-sm font-semibold text-gray-900">
                        {article.category_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
