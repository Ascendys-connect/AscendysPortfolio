"""
Views for Service management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import Service
from .serializers import (
    ServiceSerializer,
    ServiceCreateUpdateSerializer,
    ServiceListSerializer,
)


class ServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Service CRUD operations.
    
    Public endpoints:
    - list: GET /api/v1/services/
    - retrieve: GET /api/v1/services/{slug}/
    - featured: GET /api/v1/services/featured/
    
    Admin endpoints:
    - create: POST /api/v1/services/
    - update: PUT /api/v1/services/{id}/
    - partial_update: PATCH /api/v1/services/{id}/
    - destroy: DELETE /api/v1/services/{id}/
    """
    queryset = Service.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_featured', 'is_active']
    search_fields = ['title', 'short_description', 'description']
    ordering_fields = ['order', 'created_at', 'title']
    ordering = ['order', '-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'list':
            return ServiceListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ServiceCreateUpdateSerializer
        return ServiceSerializer

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        Public users only see active services.
        """
        queryset = super().get_queryset()
        
        # Admin users see all services
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Public users only see active services
        return queryset.filter(is_active=True)

    @extend_schema(
        summary="Liste des services",
        description="Récupère la liste de tous les services (actifs pour le public)",
        parameters=[
            OpenApiParameter('is_featured', bool, description='Filtrer par services mis en avant'),
            OpenApiParameter('search', str, description='Recherche par titre ou description'),
        ]
    )
    def list(self, request, *args, **kwargs):
        """
        List all services.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Liste des services récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Détail d'un service",
        description="Récupère les détails complets d'un service par son slug"
    )
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single service.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Service récupéré avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Créer un service (Admin)",
        description="Crée un nouveau service (réservé aux administrateurs)"
    )
    def create(self, request, *args, **kwargs):
        """
        Create a new service (admin only).
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Service créé avec succès.",
                data=ServiceSerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        
        return api_response(
            success=False,
            message="Erreur lors de la création du service.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Mettre à jour un service (Admin)",
        description="Met à jour complètement un service (réservé aux administrateurs)"
    )
    def update(self, request, *args, **kwargs):
        """
        Update a service (admin only).
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Service mis à jour avec succès.",
                data=ServiceSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour du service.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Modifier partiellement un service (Admin)",
        description="Modifie partiellement un service (réservé aux administrateurs)"
    )
    def partial_update(self, request, *args, **kwargs):
        """
        Partially update a service (admin only).
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Service modifié avec succès.",
                data=ServiceSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        
        return api_response(
            success=False,
            message="Erreur lors de la modification du service.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Supprimer un service (Admin)",
        description="Supprime un service (réservé aux administrateurs)"
    )
    def destroy(self, request, *args, **kwargs):
        """
        Delete a service (admin only).
        """
        instance = self.get_object()
        instance.delete()
        return api_response(
            success=True,
            message="Service supprimé avec succès.",
            status_code=status.HTTP_204_NO_CONTENT
        )

    @extend_schema(
        summary="Services mis en avant",
        description="Récupère la liste des services mis en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """
        Get featured services.
        """
        queryset = self.get_queryset().filter(is_featured=True, is_active=True)
        serializer = ServiceListSerializer(queryset, many=True)
        
        return api_response(
            success=True,
            message="Services mis en avant récupérés avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier un service (Admin)",
        description="Publie un service en brouillon"
    )
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        """
        Publish a draft service (admin only).
        """
        instance = self.get_object()
        instance.status = 'PUBLISHED'
        instance.published_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Service publié avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver un service (Admin)",
        description="Archive un service publié"
    )
    @action(detail=True, methods=['post'])
    def archive(self, request, slug=None):
        """
        Archive a published service (admin only).
        """
        instance = self.get_object()
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Service archivé avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
