"""
Serializers for Blog models.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogCategory, Tag, BlogPost

User = get_user_model()


class BlogCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for BlogCategory model.
    """
    posts_count = serializers.SerializerMethodField()
    published_posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogCategory
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'is_active',
            'posts_count',
            'published_posts_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_posts_count(self, obj):
        """
        Return count of posts in this category.
        If user is authenticated admin/staff, return all posts.
        Otherwise, return published posts.
        """
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and (
            getattr(request.user, 'is_admin', False) or 
            request.user.is_staff or 
            getattr(request.user, 'role', '') in ['ADMIN', 'SUPER_ADMIN']
        ):
            return obj.posts.count()
        return obj.posts.filter(status='PUBLISHED').count()

    def get_published_posts_count(self, obj):
        """Return count of published posts in this category."""
        return obj.posts.filter(status='PUBLISHED').count()


class TagSerializer(serializers.ModelSerializer):
    """
    Serializer for Tag model.
    """
    posts_count = serializers.SerializerMethodField()
    published_posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'posts_count', 'published_posts_count']
        read_only_fields = ['id', 'slug']
    
    def get_posts_count(self, obj):
        """
        Return count of posts with this tag.
        If user is authenticated admin/staff, return all posts.
        Otherwise, return published posts.
        """
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated and (
            getattr(request.user, 'is_admin', False) or 
            request.user.is_staff or 
            getattr(request.user, 'role', '') in ['ADMIN', 'SUPER_ADMIN']
        ):
            return obj.posts.count()
        return obj.posts.filter(status='PUBLISHED').count()

    def get_published_posts_count(self, obj):
        """Return count of published posts with this tag."""
        return obj.posts.filter(status='PUBLISHED').count()


class AuthorSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for author information.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'avatar']


class BlogPostListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing blog posts.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'cover_image',
            'video',
            'category_name',
            'author_name',
            'tags',
            'is_featured',
            'status',
            'reading_time',
            'views_count',
            'published_at',
            'created_at',
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for BlogPost model.
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author = AuthorSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'cover_image',
            'video',
            'category',
            'category_name',
            'category_slug',
            'author',
            'author_name',
            'tags',
            'status',
            'status_display',
            'is_featured',
            'reading_time',
            'views_count',
            'published_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'reading_time', 'views_count', 'published_at', 'created_at', 'updated_at']


class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating blog posts.
    """
    tags_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="Liste des IDs des tags"
    )
    
    class Meta:
        model = BlogPost
        fields = [
            'title',
            'excerpt',
            'content',
            'cover_image',
            'video',
            'category',
            'tags_ids',
            'status',
            'is_featured',
        ]

    def validate_title(self, value):
        """Validate that title is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Le titre ne peut pas être vide.")
        return value.strip()

    def create(self, validated_data):
        """Create blog post with tags."""
        tags_ids = validated_data.pop('tags_ids', [])
        blog_post = BlogPost.objects.create(**validated_data)
        
        if tags_ids:
            blog_post.tags.set(tags_ids)
        
        return blog_post

    def update(self, instance, validated_data):
        """Update blog post with tags."""
        tags_ids = validated_data.pop('tags_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tags_ids is not None:
            instance.tags.set(tags_ids)
        
        return instance
