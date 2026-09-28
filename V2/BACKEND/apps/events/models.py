"""
Event model for company events.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.core.models import UUIDModel, TimeStampedModel, SEOModel

User = get_user_model()


class Event(UUIDModel, TimeStampedModel, SEOModel):
    """
    Model for company events (conferences, workshops, webinars, etc.).
    """
    STATUS_CHOICES = [
        ('UPCOMING', 'À venir'),
        ('ONGOING', 'En cours'),
        ('COMPLETED', 'Terminé'),
        ('CANCELLED', 'Annulé'),
    ]
    
    TYPE_CHOICES = [
        ('CONFERENCE', 'Conférence'),
        ('WORKSHOP', 'Atelier'),
        ('WEBINAR', 'Webinaire'),
        ('TRAINING', 'Formation'),
        ('SALON', 'Salon'),
        ('OTHER', 'Autre'),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description")
    
    image = models.ImageField(
        upload_to='events/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    
    location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Lieu"
    )
    
    event_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='OTHER',
        verbose_name="Type d'événement"
    )
    
    start_datetime = models.DateTimeField(verbose_name="Date et heure de début")
    end_datetime = models.DateTimeField(verbose_name="Date et heure de fin")
    
    registration_url = models.URLField(
        blank=True,
        verbose_name="URL d'inscription"
    )
    
    capacity = models.IntegerField(
        null=True,
        blank=True,
        help_text="Nombre maximum de participants",
        verbose_name="Capacité"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='UPCOMING',
        verbose_name="Statut"
    )
    
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Mis en avant"
    )
    
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='events_created',
        verbose_name="Créé par"
    )

    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ['-start_datetime']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def is_upcoming(self):
        """Check if event is upcoming."""
        from django.utils import timezone
        return self.start_datetime > timezone.now()

    def is_ongoing(self):
        """Check if event is currently ongoing."""
        from django.utils import timezone
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime
