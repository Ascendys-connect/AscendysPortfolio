"""
URL configuration for trainings app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TrainingCategoryViewSet, 
    TrainingViewSet,
    EnrollmentViewSet,
    enrollment_webhook
)

app_name = 'trainings'

router = DefaultRouter()
router.register(r'categories', TrainingCategoryViewSet, basename='training-category')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'', TrainingViewSet, basename='training')

urlpatterns = [
    path('', include(router.urls)),
    path('enrollments/webhook/', enrollment_webhook, name='enrollment-webhook'),
]
