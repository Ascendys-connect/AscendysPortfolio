"""
Admin configuration for Testimonial model.
"""
from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """
    Admin interface for Testimonial model.
    """
    list_display = [
        'name',
        'company',
        'rating',
        'is_featured',
        'is_published',
        'order',
        'created_at'
    ]
    list_filter = ['is_featured', 'is_published', 'rating', 'created_at']
    search_fields = ['name', 'company', 'content']
    list_editable = ['is_featured', 'is_published', 'order', 'rating']
    ordering = ['order', '-created_at']
    
    fieldsets = (
        ('Auteur', {
            'fields': ('name', 'role', 'company', 'avatar')
        }),
        ('Contenu', {
            'fields': ('content', 'rating')
        }),
        ('Paramètres', {
            'fields': ('is_featured', 'is_published', 'order')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
