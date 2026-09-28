"""
Views for Event management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import Event
from .serializers import (
    EventListSerializer,
    EventSerializer,
    EventCreateUpdateSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event CRUD operations.
    """
    queryset = Event.objects.select_related('created_by').all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'status', 'is_featured']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_datetime', 'end_datetime', 'created_at', 'title']
    ordering = ['-start_datetime']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventSerializer

    @extend_schema(
        summary="Liste des événements",
        parameters=[
            OpenApiParameter('event_type', str, description='Filtrer par type (CONFERENCE, WORKSHOP, etc.)'),
            OpenApiParameter('status', str, description='Filtrer par statut (UPCOMING, ONGOING, etc.)'),
            OpenApiParameter('search', str, description='Recherche par titre, description ou lieu'),
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
            message="Liste des événements récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Détail d'un événement",
        description="Récupère les détails complets d'un événement par son slug"
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Événement récupéré avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Créer un événement (Admin)",
        description="Crée un nouvel événement (réservé aux administrateurs)"
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return api_response(
                success=True,
                message="Événement créé avec succès.",
                data=EventSerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de l'événement.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Événements à venir",
        description="Récupère les événements à venir"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def upcoming(self, request):
        now = timezone.now()
        queryset = self.get_queryset().filter(
            start_datetime__gt=now,
            status='UPCOMING'
        ).order_by('start_datetime')
        serializer = EventListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Événements à venir récupérés avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Événements mis en avant",
        description="Récupère les événements mis en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_featured=True)
        serializer = EventListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Événements mis en avant récupérés avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
