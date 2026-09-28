"""
Admin configuration for Partner model.
"""
from django.contrib import admin
from .models import Partner


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    """
    Admin interface for Partner model.
    """
    list_display = [
        'name',
        'website',
        'is_featured',
        'is_active',
        'order',
        'created_at'
    ]
    list_filter = ['is_featured', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_featured', 'is_active', 'order']
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'logo', 'website', 'description')
        }),
        ('Paramètres', {
            'fields': ('is_featured', 'is_active', 'order')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
