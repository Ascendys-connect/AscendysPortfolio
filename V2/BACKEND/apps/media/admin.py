"""
Admin configuration for media app.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import MediaFile, Gallery


@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    """
    Admin interface for MediaFile model.
    """
    list_display = [
        'thumbnail_preview',
        'title',
        'media_type',
        'file_size_formatted',
        'downloads_count',
        'uploaded_by',
        'created_at'
    ]
    list_filter = ['media_type', 'folder', 'created_at']
    search_fields = ['title', 'description', 'file_name', 'tags']
    readonly_fields = [
        'file_name',
        'file_size',
        'file_extension',
        'mime_type',
        'width',
        'height',
        'downloads_count',
        'created_at',
        'updated_at',
        'preview_image'
    ]
    
    fieldsets = (
        ('Fichier', {
            'fields': ('file', 'preview_image')
        }),
        ('Informations', {
            'fields': ('title', 'description', 'media_type')
        }),
        ('Métadonnées', {
            'fields': (
                'file_name',
                'file_size',
                'file_extension',
                'mime_type',
                'width',
                'height'
            ),
            'classes': ('collapse',)
        }),
        ('Organisation', {
            'fields': ('folder', 'tags')
        }),
        ('Suivi', {
            'fields': ('uploaded_by', 'downloads_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def thumbnail_preview(self, obj):
        """Display thumbnail preview for images."""
        if obj.media_type == 'IMAGE' and obj.file:
            return format_html(
                '<img src="{}" style="max-width: 50px; max-height: 50px;" />',
                obj.file.url
            )
        return '-'
    thumbnail_preview.short_description = 'Aperçu'
    
    def preview_image(self, obj):
        """Display full preview for images."""
        if obj.media_type == 'IMAGE' and obj.file:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px;" />',
                obj.file.url
            )
        return 'Pas d\'aperçu disponible'
    preview_image.short_description = 'Aperçu complet'


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    """Admin interface for Gallery model."""
    list_display = ['title', 'gallery_type', 'is_published', 'created_by', 'created_at']
    list_filter = ['gallery_type', 'is_published', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Informations', {
            'fields': ('title', 'description', 'gallery_type', 'is_published')
        }),
        ('Photos', {
            'fields': ('photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5'),
            'classes': ('collapse',),
        }),
        ('Vidéo', {
            'fields': ('video',),
            'classes': ('collapse',),
        }),
        ('Couverture', {
            'fields': ('cover_image',),
        }),
        ('Suivi', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

