"""
Company model for storing organization information.
"""
from django.db import models
from django.core.exceptions import ValidationError
from apps.core.models import TimeStampedModel


class Company(TimeStampedModel):
    """
    Singleton model to store company information.
    Only one instance should exist.
    """
    # Basic Information
    name = models.CharField(max_length=255, verbose_name="Nom de l'entreprise")
    slogan = models.CharField(max_length=255, blank=True, verbose_name="Slogan")
    short_description = models.TextField(max_length=500, blank=True, verbose_name="Description courte")
    full_description = models.TextField(blank=True, verbose_name="Description complète")
    
    # Branding
    logo = models.ImageField(upload_to='company/', blank=True, null=True, verbose_name="Logo")
    favicon = models.ImageField(upload_to='company/', blank=True, null=True, verbose_name="Favicon")
    
    # Contact Information
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    address = models.CharField(max_length=255, blank=True, verbose_name="Adresse")
    city = models.CharField(max_length=100, blank=True, verbose_name="Ville")
    country = models.CharField(max_length=100, default="Côte d'Ivoire", verbose_name="Pays")
    postal_code = models.CharField(max_length=20, blank=True, verbose_name="Code postal")
    
    # Web & Social
    website = models.URLField(blank=True, verbose_name="Site web")
    social_links = models.JSONField(
        default=dict,
        blank=True,
        help_text="Liens réseaux sociaux (facebook, linkedin, twitter, instagram, youtube)",
        verbose_name="Réseaux sociaux"
    )
    
    # Company Details
    founded_year = models.IntegerField(null=True, blank=True, verbose_name="Année de création")
    mission = models.TextField(blank=True, verbose_name="Mission")
    vision = models.TextField(blank=True, verbose_name="Vision")
    values = models.JSONField(
        default=list,
        blank=True,
        help_text="Liste des valeurs de l'entreprise",
        verbose_name="Valeurs"
    )
    
    # Business Hours
    business_hours = models.JSONField(
        default=dict,
        blank=True,
        help_text="Horaires d'ouverture par jour de la semaine",
        verbose_name="Horaires d'ouverture"
    )
    
    class Meta:
        verbose_name = "Entreprise"
        verbose_name_plural = "Entreprise"
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """
        Ensure only one instance exists (Singleton pattern).
        """
        if not self.pk and Company.objects.exists():
            raise ValidationError('Une seule instance de Company peut exister.')
        return super().save(*args, **kwargs)
    
    @classmethod
    def get_instance(cls):
        """
        Get or create the singleton instance.
        """
        instance, created = cls.objects.get_or_create(
            pk=1,
            defaults={
                'name': 'Ascendys Connect',
                'email': 'contact@ascendysconnect.com',
            }
        )
        return instance
