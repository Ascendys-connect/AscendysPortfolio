"""
Partner model for company partnerships.
"""
from django.db import models
from apps.core.models import TimeStampedModel, SoftDeleteModel


class Partner(TimeStampedModel, SoftDeleteModel):
    """
    Model for company partners and clients.
    """
    name = models.CharField(max_length=150, verbose_name="Nom")
    logo = models.ImageField(
        upload_to='partners/',
        verbose_name="Logo"
    )
    website = models.URLField(
        blank=True,
        verbose_name="Site web"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Mis en avant"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    order = models.IntegerField(
        default=0,
        help_text="Ordre d'affichage (croissant)",
        verbose_name="Ordre"
    )

    class Meta:
        verbose_name = "Partenaire"
        verbose_name_plural = "Partenaires"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
