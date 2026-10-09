"""
Views for Testimonial endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.permissions import IsAdminOrReadOnly
from .models import Testimonial
from .serializers import (
    TestimonialListSerializer,
    TestimonialDetailSerializer,
    TestimonialCreateUpdateSerializer
)


class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing testimonials.
    
    Public endpoints:
    - list: Get all published testimonials
    - retrieve: Get testimonial detail
    - featured: Get featured testimonials
    
    Admin endpoints:
    - create: Create new testimonial
    - update/partial_update: Update testimonial
    - destroy: Delete testimonial
    - toggle_published: Toggle published status
    - toggle_featured: Toggle featured status
    """
    queryset = Testimonial.objects.filter(is_deleted=False)
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_featured', 'is_published', 'rating']
    search_fields = ['name', 'company', 'content']
    ordering_fields = ['order', 'rating', 'created_at']
    ordering = ['order', '-created_at']

    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'list':
            return TestimonialListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return TestimonialCreateUpdateSerializer
        return TestimonialDetailSerializer

    def get_queryset(self):
        """
        Filter queryset based on user permissions.
        Only show published testimonials to non-admin users.
        """
        # Always exclude soft-deleted testimonials
        queryset = Testimonial.objects.filter(is_deleted=False)
        
        # Non-admin users only see published testimonials
        if not self.request.user.is_authenticated or not self.request.user.is_admin:
            queryset = queryset.filter(is_published=True)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured testimonials.
        """
        testimonials = self.get_queryset().filter(is_featured=True, is_published=True)
        serializer = TestimonialListSerializer(testimonials, many=True)
        return Response({
            'success': True,
            'message': 'Témoignages mis en avant récupérés avec succès',
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def toggle_published(self, request, pk=None):
        """
        Toggle published status of a testimonial.
        Admin only.
        """
        testimonial = self.get_object()
        testimonial.is_published = not testimonial.is_published
        testimonial.save()
        
        serializer = self.get_serializer(testimonial)
        return Response({
            'success': True,
            'message': f"Témoignage {'publié' if testimonial.is_published else 'dépublié'}",
            'data': serializer.data
        })

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """
        Toggle featured status of a testimonial.
        Admin only.
        """
        testimonial = self.get_object()
        testimonial.is_featured = not testimonial.is_featured
        testimonial.save()
        
        serializer = self.get_serializer(testimonial)
        return Response({
            'success': True,
            'message': f"Témoignage {'mis en avant' if testimonial.is_featured else 'retiré de la mise en avant'}",
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
            'message': 'Témoignages récupérés avec succès',
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
            'message': 'Détails du témoignage récupérés avec succès',
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
        detail_serializer = TestimonialDetailSerializer(serializer.instance)
        return Response({
            'success': True,
            'message': 'Témoignage créé avec succès',
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
        detail_serializer = TestimonialDetailSerializer(serializer.instance)
        return Response({
            'success': True,
            'message': 'Témoignage mis à jour avec succès',
            'data': detail_serializer.data
        })

    def destroy(self, request, *args, **kwargs):
        """
        Override destroy to add custom response format.
        """
        instance = self.get_object()
        testimonial_name = f"{instance.name} - {instance.company}"
        instance.soft_delete()
        return Response({
            'success': True,
            'message': f'Témoignage "{testimonial_name}" supprimé avec succès',
            'data': None
        }, status=status.HTTP_200_OK)
