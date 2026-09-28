"""
URL configuration for blog app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogCategoryViewSet, TagViewSet, BlogPostViewSet

app_name = 'blog'

router = DefaultRouter()
router.register(r'categories', BlogCategoryViewSet, basename='blog-category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'', BlogPostViewSet, basename='blog-post')

urlpatterns = [
    path('', include(router.urls)),
]
