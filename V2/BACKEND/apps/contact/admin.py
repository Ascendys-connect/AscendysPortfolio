"""
Admin configuration for contact app.
"""
from django.contrib import admin
from .models import ContactMessage, NewsletterSubscriber


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """
    Admin interface for ContactMessage model.
    """
    list_display = [
        'first_name',
        'last_name',
        'email',
        'subject',
        'status',
        'assigned_to',
        'created_at'
    ]
    list_filter = ['status', 'subject', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'company', 'message']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('Informations de contact', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'company')
        }),
        ('Message', {
            'fields': ('subject', 'message', 'consent_privacy')
        }),
        ('Gestion', {
            'fields': ('status', 'assigned_to', 'admin_notes', 'resolved_at')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        """Only superadmins can delete messages."""
        return request.user.is_superuser


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    """
    Admin interface for NewsletterSubscriber model.
    """
    list_display = [
        'email',
        'first_name',
        'last_name',
        'is_active',
        'is_verified',
        'created_at'
    ]
    list_filter = ['is_active', 'is_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    list_editable = ['is_active', 'is_verified']
    readonly_fields = ['created_at', 'updated_at', 'consent_date', 'unsubscribed_at']
    
    fieldsets = (
        ('Informations', {
            'fields': ('email', 'first_name', 'last_name')
        }),
        ('Statut', {
            'fields': ('is_active', 'is_verified', 'interests')
        }),
        ('Dates', {
            'fields': ('consent_date', 'unsubscribed_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_verified', 'mark_as_active', 'mark_as_inactive']
    
    def mark_as_verified(self, request, queryset):
        """Mark subscribers as verified."""
        count = queryset.update(is_verified=True)
        self.message_user(request, f'{count} abonné(s) marqué(s) comme vérifié(s).')
    mark_as_verified.short_description = "Marquer comme vérifié"
    
    def mark_as_active(self, request, queryset):
        """Mark subscribers as active."""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} abonné(s) activé(s).')
    mark_as_active.short_description = "Activer"
    
    def mark_as_inactive(self, request, queryset):
        """Mark subscribers as inactive."""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} abonné(s) désactivé(s).')
    mark_as_inactive.short_description = "Désactiver"
