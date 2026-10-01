"""
Base models and mixins for the application.
"""
import uuid
from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base class with created_at and updated_at fields.
    """
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract base class with UUID as primary key.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class SEOModel(models.Model):
    """
    Abstract base class for SEO fields.
    """
    seo_title = models.CharField(max_length=60, blank=True, verbose_name="Titre SEO")
    seo_description = models.CharField(max_length=160, blank=True, verbose_name="Description SEO")
    seo_keywords = models.CharField(max_length=255, blank=True, verbose_name="Mots-clés SEO")
    og_image = models.ImageField(upload_to='seo/', blank=True, null=True, verbose_name="Image OpenGraph")

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """
    Abstract base class for soft delete functionality.
    """
    is_deleted = models.BooleanField(default=False, verbose_name="Supprimé")
    deleted_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de suppression")

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    """
    Abstract base class for publishable content.
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Brouillon'),
        ('PUBLISHED', 'Publié'),
        ('ARCHIVED', 'Archivé'),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        verbose_name="Statut"
    )
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de publication")
    is_featured = models.BooleanField(default=False, verbose_name="Mis en avant")

    class Meta:
        abstract = True

    def is_published(self):
        return self.status == 'PUBLISHED'
