"""
Admin configuration for events app.
"""
from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """
    Admin for Event model.
    """
    list_display = [
        'title',
        'event_type',
        'location',
        'start_datetime',
        'end_datetime',
        'status',
        'is_featured',
        'is_deleted',
        'created_at'
    ]
    list_filter = ['event_type', 'status', 'is_featured', 'is_deleted', 'start_datetime']
    search_fields = ['title', 'description', 'location']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-start_datetime']
    date_hierarchy = 'start_datetime'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'description')
        }),
        ('Médias', {
            'fields': ('image',)
        }),
        ('Détails de l\'événement', {
            'fields': ('event_type', 'location', 'start_datetime', 'end_datetime', 'capacity')
        }),
        ('Inscription', {
            'fields': ('registration_url',)
        }),
        ('Configuration', {
            'fields': ('status', 'is_featured')
        }),
        ('Métadonnées', {
            'fields': ('created_by', 'is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
