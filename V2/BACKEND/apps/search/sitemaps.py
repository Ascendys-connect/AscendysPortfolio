"""
Django sitemaps for SEO.
"""
from django.contrib.sitemaps import Sitemap
from apps.trainings.models import Training
from apps.blog.models import BlogPost
from apps.events.models import Event


class TrainingSitemap(Sitemap):
    """Sitemap for trainings."""
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Training.objects.filter(status='PUBLISHED')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/formations/{obj.slug}/'


class BlogPostSitemap(Sitemap):
    """Sitemap for blog posts."""
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return BlogPost.objects.filter(status='PUBLISHED')

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/blog/{obj.slug}/'


class EventSitemap(Sitemap):
    """Sitemap for events."""
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return Event.objects.filter(is_published=True)

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/evenements/{obj.slug}/'


class StaticViewSitemap(Sitemap):
    """Sitemap for static pages."""
    priority = 0.8
    changefreq = 'monthly'

    def items(self):
        return ['home', 'about', 'services', 'trainings', 'blog', 'contact']

    def location(self, item):
        url_map = {
            'home': '/',
            'about': '/a-propos/',
            'services': '/services/',
            'trainings': '/formations/',
            'blog': '/blog/',
            'contact': '/contact/',
        }
        return url_map.get(item, '/')
