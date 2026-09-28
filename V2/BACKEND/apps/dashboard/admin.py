"""
Admin configuration for dashboard app.
"""
from django.contrib import admin
from .models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    """
    Admin interface for ActivityLog model.
    """
    list_display = [
        'user',
        'action',
        'description',
        'ip_address',
        'created_at'
    ]
    list_filter = ['action', 'created_at']
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'description',
        'ip_address'
    ]
    readonly_fields = [
        'user',
        'action',
        'description',
        'content_type',
        'object_id',
        'ip_address',
        'user_agent',
        'metadata',
        'created_at',
        'updated_at'
    ]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user', 'ip_address', 'user_agent')
        }),
        ('Action', {
            'fields': ('action', 'description')
        }),
        ('Objet lié', {
            'fields': ('content_type', 'object_id'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('metadata',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        """Disable manual creation of activity logs."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Only superadmins can delete activity logs."""
        return request.user.is_superuser
