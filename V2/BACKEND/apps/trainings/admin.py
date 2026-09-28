"""
Admin configuration for trainings app.
"""
from django.contrib import admin
from .models import TrainingCategory, Training


@admin.register(TrainingCategory)
class TrainingCategoryAdmin(admin.ModelAdmin):
    """
    Admin for TrainingCategory model.
    """
    list_display = ['name', 'slug', 'is_active', 'order', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    """
    Admin for Training model.
    """
    list_display = [
        'title',
        'category',
        'level',
        'training_mode',
        'price',
        'status',
        'is_featured',
        'start_date',
        'created_at'
    ]
    list_filter = [
        'status',
        'level',
        'training_mode',
        'is_featured',
        'certification',
        'category',
        'created_at'
    ]
    search_fields = ['title', 'short_description', 'description', 'target_audience']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'slug', 'category', 'short_description', 'description')
        }),
        ('Contenu pédagogique', {
            'fields': ('objectives', 'prerequisites', 'target_audience', 'syllabus')
        }),
        ('Détails de la formation', {
            'fields': ('duration', 'level', 'training_mode', 'location', 'certification')
        }),
        ('Tarification', {
            'fields': ('price', 'currency')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date')
        }),
        ('Formateur & Capacité', {
            'fields': ('instructor', 'capacity')
        }),
        ('Images', {
            'fields': ('image', 'banner')
        }),
        ('Publication', {
            'fields': ('status', 'is_featured', 'published_at')
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description', 'seo_keywords', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('views_count', 'created_by'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['views_count', 'published_at']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
