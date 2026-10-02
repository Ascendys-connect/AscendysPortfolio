"""
Views for Event management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminUser, IsSuperAdminUser
from .models import Event
from .serializers import (
    EventListSerializer,
    EventSerializer,
    EventCreateUpdateSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event CRUD operations with role-based permissions.
    - EDITOR: Can create (DRAFT only), edit own, archive own
    - ADMIN/SUPER_ADMIN: Full access to all events
    """
    queryset = Event.objects.select_related('created_by').filter(is_deleted=False)
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'status', 'is_featured']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['start_datetime', 'end_datetime', 'created_at', 'title']
    ordering = ['-start_datetime']
    lookup_field = 'slug'

    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['list', 'retrieve', 'upcoming', 'featured']:
            return [AllowAny()]
        elif self.action in ['create']:
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        elif self.action in ['publish', 'set_to_draft']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

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
            OpenApiParameter('status', str, description='Filtrer par statut (DRAFT, PUBLISHED, ARCHIVED)'),
            OpenApiParameter('search', str, description='Recherche par titre, description ou lieu'),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
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
        summary="Créer un événement",
        description="Crée un nouvel événement. EDITOR peut créer en DRAFT uniquement."
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # EDITOR can only create DRAFT events
            if request.user.role == 'EDITOR':
                event = serializer.save(created_by=request.user, status='DRAFT')
            else:
                event = serializer.save(created_by=request.user)
            
            return api_response(
                success=True,
                message="Événement créé avec succès.",
                data=EventSerializer(event).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de l'événement.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Modifier un événement",
        description="Modifie un événement existant"
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # EDITOR can only edit their own events
        if request.user.role == 'EDITOR' and instance.created_by != request.user:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission de modifier cet événement.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        if serializer.is_valid():
            # EDITOR cannot change status
            if request.user.role == 'EDITOR' and 'status' in request.data:
                if request.data['status'] != instance.status:
                    return api_response(
                        success=False,
                        message="Vous n'avez pas la permission de modifier le statut.",
                        status_code=status.HTTP_403_FORBIDDEN
                    )
            
            serializer.save()
            return api_response(
                success=True,
                message="Événement modifié avec succès.",
                data=EventSerializer(instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la modification de l'événement.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Supprimer un événement (soft delete)",
        description="Supprime un événement (soft delete). ADMIN/SUPER_ADMIN uniquement."
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Only ADMIN and SUPER_ADMIN can delete
        if request.user.role not in ['ADMIN', 'SUPER_ADMIN']:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission de supprimer cet événement.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance.soft_delete()
        return api_response(
            success=True,
            message="Événement supprimé avec succès.",
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Événements à venir",
        description="Récupère les événements à venir et publiés"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def upcoming(self, request):
        now = timezone.now()
        queryset = self.get_queryset().filter(
            start_datetime__gt=now,
            status='PUBLISHED'
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
        queryset = self.get_queryset().filter(is_featured=True, status='PUBLISHED')
        serializer = EventListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Événements mis en avant récupérés avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier un événement (Admin)",
        description="Publie un événement en brouillon"
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def publish(self, request, slug=None):
        """
        Publish a draft event (admin only).
        """
        instance = self.get_object()
        instance.status = 'PUBLISHED'
        instance.published_at = timezone.now()
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Événement publié avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Mettre en brouillon un événement (Admin)",
        description="Remet un événement publié en brouillon"
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def set_to_draft(self, request, slug=None):
        """
        Set a published event back to draft (admin only).
        """
        instance = self.get_object()
        instance.status = 'DRAFT'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Événement mis en brouillon avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver un événement",
        description="Archive un événement. EDITOR peut archiver ses propres événements."
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def archive(self, request, slug=None):
        """
        Archive an event. EDITOR can archive their own events.
        """
        instance = self.get_object()
        
        # EDITOR can only archive their own events
        if request.user.role == 'EDITOR' and instance.created_by != request.user:
            return api_response(
                success=False,
                message="Vous n'avez pas la permission d'archiver cet événement.",
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Événement archivé avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )
