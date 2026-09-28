"""
Views for Training and TrainingCategory management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import TrainingCategory, Training
from .serializers import (
    TrainingCategorySerializer,
    TrainingCategoryCreateUpdateSerializer,
    TrainingListSerializer,
    TrainingSerializer,
    TrainingCreateUpdateSerializer,
)


class TrainingCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TrainingCategory CRUD operations.
    """
    queryset = TrainingCategory.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TrainingCategoryCreateUpdateSerializer
        return TrainingCategorySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Admin sees all categories
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Public sees only active categories
        return queryset.filter(is_active=True)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Liste des catégories récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Catégorie récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Catégorie créée avec succès.",
                data=TrainingCategorySerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de la catégorie.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


class TrainingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Training CRUD operations with publish/archive actions.
    """
    queryset = Training.objects.select_related('category', 'instructor', 'created_by').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level', 'training_mode', 'status', 'is_featured', 'certification']
    search_fields = ['title', 'short_description', 'description', 'target_audience']
    ordering_fields = ['created_at', 'start_date', 'price', 'views_count', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return TrainingListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TrainingCreateUpdateSerializer
        return TrainingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Admin sees all trainings
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Public sees only published trainings
        return queryset.filter(status='PUBLISHED')

    @extend_schema(
        summary="Liste des formations",
        parameters=[
            OpenApiParameter('category', int, description='Filtrer par catégorie'),
            OpenApiParameter('level', str, description='Filtrer par niveau (BEGINNER, INTERMEDIATE, ADVANCED)'),
            OpenApiParameter('training_mode', str, description='Filtrer par mode (ONLINE, ONSITE, HYBRID)'),
            OpenApiParameter('search', str, description='Recherche par titre ou description'),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Liste des formations récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment views count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return api_response(
                success=True,
                message="Formation créée avec succès.",
                data=TrainingSerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de la formation.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Formation mise à jour avec succès.",
                data=TrainingSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour de la formation.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Formations mises en avant",
        description="Récupère les formations mises en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_featured=True, status='PUBLISHED')
        serializer = TrainingListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Formations mises en avant récupérées avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier une formation (Admin)",
        description="Publie une formation en brouillon"
    )
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'PUBLISHED'
        instance.published_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation publiée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver une formation (Admin)",
        description="Archive une formation publiée"
    )
    @action(detail=True, methods=['post'])
    def archive(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Formation archivée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
