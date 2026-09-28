"""
Admin configuration for offers app.
"""
from django.contrib import admin
from .models import Offer


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    """
    Admin for Offer model.
    """
    list_display = [
        'title',
        'type',
        'status',
        'is_featured',
        'start_date',
        'end_date',
        'created_at'
    ]
    list_filter = ['type', 'status', 'is_featured', 'created_at', 'start_date']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'type', 'short_description', 'description')
        }),
        ('Images', {
            'fields': ('image', 'banner')
        }),
        ('Période', {
            'fields': ('start_date', 'end_date')
        }),
        ('Publication', {
            'fields': ('status', 'is_featured', 'published_at')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description', 'seo_keywords', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_by',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['published_at']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
