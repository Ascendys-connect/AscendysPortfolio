"""
Service model for company offerings.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.core.models import UUIDModel, TimeStampedModel, SEOModel, PublishableModel

User = get_user_model()


class Service(UUIDModel, TimeStampedModel, SEOModel, PublishableModel):
    """
    Model representing a service offered by the company.
    """
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug")
    short_description = models.TextField(max_length=300, verbose_name="Description courte")
    description = models.TextField(verbose_name="Description complète")
    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Nom de l'icône (ex: 'FaCode', 'FaMobile')",
        verbose_name="Icône"
    )
    image = models.ImageField(
        upload_to='services/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    features = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des fonctionnalités du service",
        verbose_name="Fonctionnalités"
    )
    order = models.IntegerField(
        default=0,
        help_text="Ordre d'affichage (croissant)",
        verbose_name="Ordre"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='services_created',
        verbose_name="Créé par"
    )

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
