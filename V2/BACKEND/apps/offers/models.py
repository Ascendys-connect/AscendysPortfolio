"""
Offer model for announcements, promotions, and special offers.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.core.models import UUIDModel, TimeStampedModel, SEOModel, PublishableModel

User = get_user_model()


class Offer(UUIDModel, TimeStampedModel, SEOModel, PublishableModel):
    """
    Model for company offers, announcements, and promotions.
    """
    TYPE_CHOICES = [
        ('TRAINING', 'Formation'),
        ('PROMOTION', 'Promotion'),
        ('EVENT', 'Événement'),
        ('RECRUITMENT', 'Recrutement'),
        ('ANNOUNCEMENT', 'Annonce'),
        ('OTHER', 'Autre'),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug")
    short_description = models.TextField(max_length=300, verbose_name="Description courte")
    description = models.TextField(verbose_name="Description complète")
    
    image = models.ImageField(
        upload_to='offers/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    banner = models.ImageField(
        upload_to='offers/banners/',
        blank=True,
        null=True,
        verbose_name="Bannière"
    )
    
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='ANNOUNCEMENT',
        verbose_name="Type"
    )
    
    start_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date de début"
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date de fin"
    )
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='offers_created',
        verbose_name="Créé par"
    )

    class Meta:
        verbose_name = "Offre"
        verbose_name_plural = "Offres"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def is_active_offer(self):
        """Check if offer is currently active based on dates."""
        from django.utils import timezone
        today = timezone.now().date()
        
        if self.status != 'PUBLISHED':
            return False
        
        if self.start_date and today < self.start_date:
            return False
        
        if self.end_date and today > self.end_date:
            return False
        
        return True
