"""
Admin configuration for services app.
"""
from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Admin for Service model.
    """
    list_display = ['title', 'slug', 'is_featured', 'is_active', 'created_at']
    list_filter = ['is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']

    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'short_description', 'description')
        }),
        ('Visuel', {
            'fields': ('icon', 'image')
        }),
        ('Fonctionnalités', {
            'fields': ('features',)
        }),
        ('Configuration', {
            'fields': ('is_featured', 'is_active')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description', 'seo_keywords', 'og_image'),
            'classes': ('collapse',)
        }),
    )
