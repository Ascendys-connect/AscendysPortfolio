"""
URL configuration for trainings app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainingCategoryViewSet, TrainingViewSet

app_name = 'trainings'

router = DefaultRouter()
router.register(r'categories', TrainingCategoryViewSet, basename='training-category')
router.register(r'', TrainingViewSet, basename='training')

urlpatterns = [
    path('', include(router.urls)),
]
