"""
URL configuration for Ascendys Connect API.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include([
        # Authentication
        path('auth/', include('apps.accounts.urls')),
        
        # Company
        path('company/', include('apps.company.urls')),
        
        # Services
        path('services/', include('apps.services.urls')),
        
        # Trainings
        path('trainings/', include('apps.trainings.urls')),
        
        # Offers
        path('offers/', include('apps.offers.urls')),
        
        # Blog
        path('blog/', include('apps.blog.urls')),
        
        # Events
        path('events/', include('apps.events.urls')),
        
        # Testimonials
        path('testimonials/', include('apps.testimonials.urls')),
        
        # Partners
        path('partners/', include('apps.partners.urls')),
        
        # Contact & Newsletter
        path('contact/', include('apps.contact.urls')),
        
        # Media Library
        path('media/', include('apps.media.urls')),
        
        # Dashboard & Activity Logs
        path('dashboard/', include('apps.dashboard.urls')),
        
        # Search & SEO
        path('search/', include('apps.search.urls')),
    ])),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin
admin.site.site_header = "Ascendys Connect Administration"
admin.site.site_title = "Ascendys Connect Admin"
admin.site.index_title = "Bienvenue sur l'interface d'administration"
