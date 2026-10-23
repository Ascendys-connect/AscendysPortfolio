"""
URL configuration for media app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaFileViewSet, GalleryViewSet

app_name = 'media'

router = DefaultRouter()
router.register(r'files', MediaFileViewSet, basename='media')
router.register(r'galleries', GalleryViewSet, basename='gallery')

urlpatterns = [
    path('', include(router.urls)),
]
