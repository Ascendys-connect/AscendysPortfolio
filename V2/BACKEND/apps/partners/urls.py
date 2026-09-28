"""
URL configuration for partners app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet

app_name = 'partners'

router = DefaultRouter()
router.register(r'', PartnerViewSet, basename='partner')

urlpatterns = [
    path('', include(router.urls)),
]
