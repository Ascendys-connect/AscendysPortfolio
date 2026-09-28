"""
Views for global search and SEO functionality.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse

from apps.trainings.models import Training
from apps.blog.models import BlogPost
from apps.events.models import Event
from apps.services.models import Service
from apps.trainings.serializers import TrainingListSerializer
from apps.blog.serializers import BlogPostListSerializer
from apps.events.serializers import EventListSerializer
from apps.services.serializers import ServiceListSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def global_search(request):
    """
    Global search across multiple content types.
    Public endpoint.
    
    Query params:
    - q: search query (required)
    - type: filter by type (trainings, blog, events, services)
    - limit: results per type (default: 5)
    """
    query = request.GET.get('q', '').strip()
    content_type = request.GET.get('type', '').lower()
    limit = int(request.GET.get('limit', 5))
    
    if not query:
        return Response({
            'success': False,
            'message': 'Paramètre de recherche "q" requis',
            'errors': {'q': ['Ce champ est requis']}
        }, status=400)
    
    if len(query) < 2:
        return Response({
            'success': False,
            'message': 'La recherche doit contenir au moins 2 caractères',
            'errors': {'q': ['Minimum 2 caractères']}
        }, status=400)
    
    results = {}
    
    # Search trainings
    if not content_type or content_type == 'trainings':
        trainings = Training.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(objectives__icontains=query),
            status='PUBLISHED'
        )[:limit]
        results['trainings'] = {
            'count': trainings.count(),
            'items': TrainingListSerializer(trainings, many=True, context={'request': request}).data
        }
    
    # Search blog posts
    if not content_type or content_type == 'blog':
        posts = BlogPost.objects.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(excerpt__icontains=query),
            status='PUBLISHED'
        )[:limit]
        results['blog_posts'] = {
            'count': posts.count(),
            'items': BlogPostListSerializer(posts, many=True, context={'request': request}).data
        }
    
    # Search events
    if not content_type or content_type == 'events':
        events = Event.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query),
            is_published=True
        )[:limit]
        results['events'] = {
            'count': events.count(),
            'items': EventListSerializer(events, many=True, context={'request': request}).data
        }
    
    # Search services
    if not content_type or content_type == 'services':
        services = Service.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query),
            is_active=True
        )[:limit]
        results['services'] = {
            'count': services.count(),
            'items': ServiceListSerializer(services, many=True, context={'request': request}).data
        }
    
    # Calculate total results
    total_count = sum(result['count'] for result in results.values())
    
    return Response({
        'success': True,
        'message': f'{total_count} résultat(s) trouvé(s)',
        'data': {
            'query': query,
            'total_count': total_count,
            'results': results
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def sitemap_data(request):
    """
    Generate sitemap data for all public content.
    """
    site = get_current_site(request)
    base_url = f"https://{site.domain}"
    
    urls = []
    
    # Static pages
    static_pages = [
        {'loc': '/', 'priority': 1.0, 'changefreq': 'daily'},
        {'loc': '/a-propos/', 'priority': 0.8, 'changefreq': 'monthly'},
        {'loc': '/services/', 'priority': 0.9, 'changefreq': 'weekly'},
        {'loc': '/formations/', 'priority': 0.9, 'changefreq': 'weekly'},
        {'loc': '/blog/', 'priority': 0.8, 'changefreq': 'daily'},
        {'loc': '/contact/', 'priority': 0.7, 'changefreq': 'monthly'},
    ]
    
    for page in static_pages:
        urls.append({
            'loc': f"{base_url}{page['loc']}",
            'lastmod': None,
            'priority': page['priority'],
            'changefreq': page['changefreq']
        })
    
    # Trainings
    trainings = Training.objects.filter(status='PUBLISHED').order_by('-updated_at')
    for training in trainings:
        urls.append({
            'loc': f"{base_url}/formations/{training.slug}/",
            'lastmod': training.updated_at.isoformat(),
            'priority': 0.8,
            'changefreq': 'weekly'
        })
    
    # Blog posts
    posts = BlogPost.objects.filter(status='PUBLISHED').order_by('-updated_at')
    for post in posts:
        urls.append({
            'loc': f"{base_url}/blog/{post.slug}/",
            'lastmod': post.updated_at.isoformat(),
            'priority': 0.7,
            'changefreq': 'monthly'
        })
    
    # Events
    events = Event.objects.filter(is_published=True).order_by('-updated_at')
    for event in events:
        urls.append({
            'loc': f"{base_url}/evenements/{event.slug}/",
            'lastmod': event.updated_at.isoformat(),
            'priority': 0.6,
            'changefreq': 'weekly'
        })
    
    return Response({
        'success': True,
        'message': 'Données du sitemap générées',
        'data': {
            'total_urls': len(urls),
            'urls': urls
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def robots_txt(request):
    """
    Generate robots.txt content.
    """
    site = get_current_site(request)
    base_url = f"https://{site.domain}"
    
    robots_content = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/v1/auth/
Disallow: /api/v1/dashboard/
Disallow: /media/private/

Sitemap: {base_url}/sitemap.xml
"""
    
    return Response({
        'success': True,
        'message': 'Contenu robots.txt généré',
        'data': {
            'content': robots_content
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def seo_meta(request):
    """
    Get default SEO meta tags for the site.
    """
    meta = {
        'site_name': 'Ascendys Connect',
        'title': 'Ascendys Connect - Solutions Digitales & Formations IT',
        'description': 'Leader en solutions digitales et formations IT en Côte d\'Ivoire. Services de développement web, mobile, formations professionnelles et accompagnement digital.',
        'keywords': 'formation informatique, développement web, digital, Côte d\'Ivoire, IT training, solutions digitales',
        'author': 'Ascendys Connect',
        'robots': 'index, follow',
        'og_type': 'website',
        'og_locale': 'fr_FR',
        'twitter_card': 'summary_large_image',
    }
    
    return Response({
        'success': True,
        'message': 'Métadonnées SEO récupérées',
        'data': meta
    })
