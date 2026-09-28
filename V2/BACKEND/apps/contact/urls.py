"""
URL configuration for contact app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactMessageViewSet, NewsletterViewSet

app_name = 'contact'

router = DefaultRouter()
router.register(r'messages', ContactMessageViewSet, basename='contact-message')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
]
