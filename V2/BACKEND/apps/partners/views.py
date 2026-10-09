"""
Views for Partner endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.permissions import IsAdminOrReadOnly
from .models import Partner
from .serializers import (
    PartnerListSerializer,
    PartnerDetailSerializer,
    PartnerCreateUpdateSerializer
)


class PartnerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing partners.
    
    Public endpoints:
    - list: Get all active partners
    - retrieve: Get partner detail
    - featured: Get featured partners
    
    Admin endpoints:
    - create: Create new partner
    - update/partial_update: Update partner
    - destroy: Delete partner
    - toggle_featured: Toggle featured status
    """
    queryset = Partner.objects.filter(is_deleted=False)
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_featured', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'list':
            return PartnerListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return PartnerCreateUpdateSerializer
        return PartnerDetailSerializer

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        Only show active partners to non-admin users.
        """
        # Always exclude soft-deleted partners
        queryset = Partner.objects.filter(is_deleted=False)
        
        # Non-admin users only see active partners
        if not self.request.user.is_authenticated or not self.request.user.is_admin:
            queryset = queryset.filter(is_active=True)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured partners.
        """
        partners = self.get_queryset().filter(is_featured=True, is_active=True)
        serializer = PartnerListSerializer(partners, many=True)
        return Response({
            'success': True,
            'message': 'Partenaires mis en avant récupérés avec succès',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """
        Toggle featured status of a partner.
        Admin only.
        """
        partner = self.get_object()
        partner.is_featured = not partner.is_featured
        partner.save()
        
        serializer = self.get_serializer(partner)
        return Response({
            'success': True,
            'message': f"Partenaire {'mis en avant' if partner.is_featured else 'retiré de la mise en avant'}",
            'data': serializer.data
        })

    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Partenaires récupérés avec succès',
            'data': serializer.data
        })

    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to add custom response format.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'message': 'Détails du partenaire récupérés avec succès',
            'data': serializer.data
        })

    def create(self, request, *args, **kwargs):
        """
        Override create to add custom response format.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return detail serializer for created object
        detail_serializer = PartnerDetailSerializer(serializer.instance)
        return Response({
            'success': True,
            'message': 'Partenaire créé avec succès',
            'data': detail_serializer.data
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Override update to add custom response format.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return detail serializer
        detail_serializer = PartnerDetailSerializer(serializer.instance)
        return Response({
            'success': True,
            'message': 'Partenaire mis à jour avec succès',
            'data': detail_serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        """
        Override destroy to add custom response format.
        """
        instance = self.get_object()
        partner_name = instance.name
        instance.soft_delete()
        return Response({
            'success': True,
            'message': f'Partenaire "{partner_name}" supprimé avec succès',
            'data': None
        }, status=status.HTTP_200_OK)
