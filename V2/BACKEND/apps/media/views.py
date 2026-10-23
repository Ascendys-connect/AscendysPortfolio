"""
Views for media library endpoints.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from .models import MediaFile, Gallery
from .serializers import (
    MediaFileListSerializer,
    MediaFileDetailSerializer,
    MediaFileUploadSerializer,
    GalleryListSerializer,
    GalleryDetailSerializer,
    GalleryCreateSerializer,
)


class MediaFileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing media files.
    
    Admin only endpoints:
    - list: Get all media files
    - retrieve: Get media file detail
    - create: Upload new file
    - update: Update file metadata
    - destroy: Delete file
    - download: Track download
    """
    queryset = MediaFile.objects.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['media_type', 'folder']
    search_fields = ['title', 'description', 'file_name', 'tags']
    ordering_fields = ['created_at', 'title', 'file_size', 'downloads_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action.
        """
        if self.action == 'list':
            return MediaFileListSerializer
        elif self.action == 'create':
            return MediaFileUploadSerializer
        return MediaFileDetailSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Override list to add custom response format.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'success': True,
            'message': 'Fichiers média récupérés avec succès',
            'data': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to add custom response format.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response({
            'success': True,
            'message': 'Détails du fichier récupérés avec succès',
            'data': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """
        Override create to add custom response format.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Return detail serializer
        detail_serializer = MediaFileDetailSerializer(
            serializer.instance,
            context={'request': request}
        )
        return Response({
            'success': True,
            'message': 'Fichier uploadé avec succès',
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
        
        return Response({
            'success': True,
            'message': 'Fichier mis à jour avec succès',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy to add custom response format.
        """
        instance = self.get_object()
        file_title = instance.title
        
        # Delete file from storage
        if instance.file:
            instance.file.delete()
        
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': f'Fichier "{file_title}" supprimé avec succès',
            'data': None
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """
        Track file download.
        """
        media_file = self.get_object()
        media_file.increment_downloads()
        
        serializer = self.get_serializer(media_file, context={'request': request})
        return Response({
            'success': True,
            'message': 'Téléchargement enregistré',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get media library statistics.
        """
        from django.db.models import Count, Sum
        
        stats = {
            'total_files': MediaFile.objects.count(),
            'total_size': MediaFile.objects.aggregate(Sum('file_size'))['file_size__sum'] or 0,
            'by_type': dict(
                MediaFile.objects.values('media_type').annotate(count=Count('id')).values_list('media_type', 'count')
            ),
            'total_downloads': MediaFile.objects.aggregate(Sum('downloads_count'))['downloads_count__sum'] or 0,
        }
        
        # Format total size
        size = stats['total_size']
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                stats['total_size_formatted'] = f"{size:.2f} {unit}"
                break
            size /= 1024.0
        
        return Response({
            'success': True,
            'message': 'Statistiques récupérées avec succès',
            'data': stats
        })


class GalleryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing galleries (médiathèques).

    Supports:
    - list: Get all galleries
    - retrieve: Get gallery detail
    - create: Create gallery with up to 5 photos OR 1 video
    - update/partial_update: Update gallery metadata
    - destroy: Delete gallery
    """
    queryset = Gallery.objects.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['gallery_type', 'is_published']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return GalleryListSerializer
        elif self.action in ('create', 'update', 'partial_update'):
            return GalleryCreateSerializer
        return GalleryDetailSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response({
            'success': True,
            'message': 'Galeries récupérées avec succès',
            'data': serializer.data,
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = GalleryDetailSerializer(instance, context={'request': request})
        return Response({
            'success': True,
            'message': 'Détails de la galerie récupérés avec succès',
            'data': serializer.data,
        })

    def create(self, request, *args, **kwargs):
        serializer = GalleryCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        gallery = serializer.save()
        detail = GalleryDetailSerializer(gallery, context={'request': request})
        return Response({
            'success': True,
            'message': 'Galerie créée avec succès',
            'data': detail.data,
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = GalleryCreateSerializer(
            instance, data=request.data, partial=partial, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        gallery = serializer.save()
        detail = GalleryDetailSerializer(gallery, context={'request': request})
        return Response({
            'success': True,
            'message': 'Galerie mise à jour avec succès',
            'data': detail.data,
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        # Delete associated files
        for i in range(1, 6):
            photo = getattr(instance, f'photo_{i}')
            if photo:
                photo.delete(save=False)
        if instance.video:
            instance.video.delete(save=False)
        if instance.cover_image:
            instance.cover_image.delete(save=False)
        instance.delete()
        return Response({
            'success': True,
            'message': f'Galerie "{title}" supprimée avec succès',
            'data': None,
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch', 'post'])
    def toggle_publish(self, request, pk=None):
        """Toggle is_published status for a gallery."""
        instance = self.get_object()
        instance.is_published = not instance.is_published
        instance.save(update_fields=['is_published', 'updated_at'])
        return Response({
            'success': True,
            'message': f'Statut modifié : {"Publié" if instance.is_published else "Brouillon"}',
            'data': {
                'id': instance.id,
                'is_published': instance.is_published,
            }
        })
    
    def get_permissions(self):
        """
        Allow public access for GET requests on published galleries.
        """
        if self.action in ('list', 'retrieve') and self.request.method == 'GET':
            # Check if filtering by is_published=true
            if self.request.query_params.get('is_published') == 'true':
                return [AllowAny()]
        return super().get_permissions()

