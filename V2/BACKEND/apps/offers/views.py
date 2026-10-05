"""
Views for Offer management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import Offer
from .serializers import (
    OfferListSerializer,
    OfferSerializer,
    OfferCreateUpdateSerializer,
)


class OfferViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Offer CRUD operations with publish/archive actions.
    """
    queryset = Offer.objects.select_related('created_by').filter(is_deleted=False)
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'status', 'is_featured']
    search_fields = ['title', 'short_description', 'description']
    ordering_fields = ['created_at', 'start_date', 'end_date', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return OfferListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return OfferCreateUpdateSerializer
        return OfferSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Admin sees all offers
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Public sees only published offers
        return queryset.filter(status='PUBLISHED')

    @extend_schema(
        summary="Liste des offres",
        parameters=[
            OpenApiParameter('type', str, description='Filtrer par type (TRAINING, PROMOTION, EVENT, etc.)'),
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
            message="Liste des offres récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Détail d'une offre",
        description="Récupère les détails complets d'une offre par son slug"
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Offre récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Créer une offre (Admin)",
        description="Crée une nouvelle offre (réservé aux administrateurs)"
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return api_response(
                success=True,
                message="Offre créée avec succès.",
                data=OfferSerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de l'offre.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Mettre à jour une offre (Admin)",
        description="Met à jour complètement une offre (réservé aux administrateurs)"
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Offre mise à jour avec succès.",
                data=OfferSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour de l'offre.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Modifier partiellement une offre (Admin)",
        description="Modifie partiellement une offre (réservé aux administrateurs)"
    )
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Offre modifiée avec succès.",
                data=OfferSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la modification de l'offre.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Supprimer une offre (Admin)",
        description="Supprime une offre (réservé aux administrateurs)"
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return api_response(
            success=True,
            message="Offre supprimée avec succès.",
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Offres mises en avant",
        description="Récupère les offres mises en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_featured=True, status='PUBLISHED')
        serializer = OfferListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Offres mises en avant récupérées avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Offres actives",
        description="Récupère les offres actuellement actives (selon les dates)"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        today = timezone.now().date()
        queryset = self.get_queryset().filter(
            status='PUBLISHED'
        ).filter(
            models.Q(start_date__lte=today) | models.Q(start_date__isnull=True)
        ).filter(
            models.Q(end_date__gte=today) | models.Q(end_date__isnull=True)
        )
        serializer = OfferListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Offres actives récupérées avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier une offre (Admin)",
        description="Publie une offre en brouillon"
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
            message="Offre publiée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], url_path='set-to-draft')
    def set_to_draft(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'DRAFT'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Offre remise en brouillon avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver une offre (Admin)",
        description="Archive une offre publiée"
    )
    @action(detail=True, methods=['post'])
    def archive(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Offre archivée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
