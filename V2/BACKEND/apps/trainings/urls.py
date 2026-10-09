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

# Router for trainings and categories (slug-based lookup)
training_router = DefaultRouter()
training_router.register(r'categories', TrainingCategoryViewSet, basename='training-category')
training_router.register(r'', TrainingViewSet, basename='training')

# Separate router for enrollments to avoid route conflicts with the slug-based training router
enrollment_router = DefaultRouter()
enrollment_router.register(r'', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    # Enrollments MUST be defined before the catch-all training router
    path('enrollments/', include(enrollment_router.urls)),
    path('enrollments/webhook/', enrollment_webhook, name='enrollment-webhook'),
    path('', include(training_router.urls)),
]

