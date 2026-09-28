"""
Admin configuration for company app.
"""
from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    """
    Admin for Company model (Singleton).
    """
    list_display = ['name', 'email', 'phone', 'city', 'country']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'slogan', 'short_description', 'full_description')
        }),
        ('Branding', {
            'fields': ('logo', 'favicon')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'address', 'city', 'country', 'postal_code')
        }),
        ('Web & Réseaux sociaux', {
            'fields': ('website', 'social_links')
        }),
        ('À propos', {
            'fields': ('founded_year', 'mission', 'vision', 'values')
        }),
        ('Horaires', {
            'fields': ('business_hours',)
        }),
    )
    
    def has_add_permission(self, request):
        """
        Prevent adding more than one instance.
        """
        return not Company.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """
        Prevent deletion of the company instance.
        """
        return False
