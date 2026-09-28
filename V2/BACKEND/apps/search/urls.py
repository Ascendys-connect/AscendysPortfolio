"""
URL configuration for search app.
"""
from django.urls import path
from .views import global_search, sitemap_data, robots_txt, seo_meta

app_name = 'search'

urlpatterns = [
    path('', global_search, name='global-search'),
    path('sitemap/', sitemap_data, name='sitemap-data'),
    path('robots/', robots_txt, name='robots-txt'),
    path('seo-meta/', seo_meta, name='seo-meta'),
]
