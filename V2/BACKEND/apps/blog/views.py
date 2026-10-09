"""
Views for Blog management.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter

from apps.core.exceptions import api_response
from apps.core.permissions import IsAdminOrReadOnly
from .models import BlogCategory, Tag, BlogPost
from .serializers import (
    BlogCategorySerializer,
    TagSerializer,
    BlogPostListSerializer,
    BlogPostSerializer,
    BlogPostCreateUpdateSerializer,
)


class BlogCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BlogCategory CRUD operations.
    """
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    lookup_field = 'slug'

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


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Tag CRUD operations.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering = ['name']
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            success=True,
            message="Liste des tags récupérée avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for BlogPost CRUD operations with publish/archive actions.
    """
    queryset = BlogPost.objects.select_related('author', 'category').prefetch_related('tags').filter(is_deleted=False)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'is_featured', 'author']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action in ['list', 'retrieve', 'featured']:
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update']:
            return [IsAuthenticated()]
        elif self.action in ['publish', 'archive', 'set_to_draft', 'destroy']:
            return [IsAdminOrReadOnly()]
        return [IsAdminOrReadOnly()]

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateUpdateSerializer
        return BlogPostSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by tags if provided
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = tags.split(',')
            queryset = queryset.filter(tags__slug__in=tag_list).distinct()
        
        # Admin sees all posts
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return queryset
        
        # Editors see their own posts + published posts
        if self.request.user.is_authenticated and hasattr(self.request.user, 'role') and self.request.user.role == 'EDITOR':
            return queryset.filter(Q(author=self.request.user) | Q(status='PUBLISHED'))
        
        # Public sees only published posts
        return queryset.filter(status='PUBLISHED')

    @extend_schema(
        summary="Liste des articles",
        parameters=[
            OpenApiParameter('category', int, description='Filtrer par catégorie'),
            OpenApiParameter('tags', str, description='Filtrer par tags (slugs séparés par virgule)'),
            OpenApiParameter('search', str, description='Recherche par titre ou contenu'),
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
            message="Liste des articles récupérée avec succès.",
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
            message="Article récupéré avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Editors must create posts in DRAFT status
            status_value = serializer.validated_data.get('status', 'DRAFT')
            if hasattr(request.user, 'role') and request.user.role == 'EDITOR':
                status_value = 'DRAFT'
            
            serializer.save(author=request.user, status=status_value)
            return api_response(
                success=True,
                message="Article créé avec succès.",
                data=BlogPostSerializer(serializer.instance).data,
                status_code=status.HTTP_201_CREATED
            )
        return api_response(
            success=False,
            message="Erreur lors de la création de l'article.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Editors can only update their own posts
        if hasattr(request.user, 'role') and request.user.role == 'EDITOR':
            if instance.author != request.user:
                return api_response(
                    success=False,
                    message="Vous ne pouvez modifier que vos propres articles.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
            # Editors cannot change status
            if 'status' in request.data and request.data['status'] != instance.status:
                return api_response(
                    success=False,
                    message="Vous n'avez pas la permission de changer le statut de l'article.",
                    status_code=status.HTTP_403_FORBIDDEN
                )
        
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return api_response(
                success=True,
                message="Article mis à jour avec succès.",
                data=BlogPostSerializer(serializer.instance).data,
                status_code=status.HTTP_200_OK
            )
        return api_response(
            success=False,
            message="Erreur lors de la mise à jour de l'article.",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )

    @extend_schema(
        summary="Articles mis en avant",
        description="Récupère les articles mis en avant"
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = self.get_queryset().filter(is_featured=True, status='PUBLISHED')
        serializer = BlogPostListSerializer(queryset, many=True)
        return api_response(
            success=True,
            message="Articles mis en avant récupérés avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Publier un article (Admin)",
        description="Publie un article en brouillon"
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
            message="Article publié avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Archiver un article (Admin)",
        description="Archive un article publié"
    )
    @action(detail=True, methods=['post'])
    def archive(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'ARCHIVED'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Article archivé avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Mettre en brouillon (Admin)",
        description="Remet un article en brouillon"
    )
    @action(detail=True, methods=['post'], url_path='set-to-draft')
    def set_to_draft(self, request, slug=None):
        instance = self.get_object()
        instance.status = 'DRAFT'
        instance.save()
        
        serializer = self.get_serializer(instance)
        return api_response(
            success=True,
            message="Article remis en brouillon avec succès.",
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        summary="Supprimer un article (Soft delete)",
        description="Supprime un article en soft delete (réservé aux administrateurs/éditeurs)"
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.soft_delete()
        return api_response(
            success=True,
            message="Article supprimé avec succès.",
            status_code=status.HTTP_200_OK
        )
