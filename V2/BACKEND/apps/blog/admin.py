"""
Admin configuration for blog app.
"""
from django.contrib import admin
from .models import BlogCategory, Tag, BlogPost


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    """
    Admin for BlogCategory model.
    """
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """
    Admin for Tag model.
    """
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """
    Admin for BlogPost model.
    """
    list_display = [
        'title',
        'author',
        'category',
        'status',
        'is_featured',
        'reading_time',
        'views_count',
        'published_at',
        'created_at'
    ]
    list_filter = ['status', 'is_featured', 'category', 'author', 'created_at', 'published_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'excerpt', 'content')
        }),
        ('Médias', {
            'fields': ('cover_image',)
        }),
        ('Classification', {
            'fields': ('category', 'tags', 'author')
        }),
        ('Publication', {
            'fields': ('status', 'is_featured', 'published_at')
        }),
        ('Statistiques', {
            'fields': ('reading_time', 'views_count'),
            'classes': ('collapse',)
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description', 'seo_keywords', 'og_image'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['reading_time', 'views_count', 'published_at']
    
    def save_model(self, request, obj, form, change):
        if not change and not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)
