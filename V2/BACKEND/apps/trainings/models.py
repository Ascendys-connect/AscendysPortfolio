"""
Training models for course management.
"""
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from apps.core.models import UUIDModel, TimeStampedModel, PublishableModel, SoftDeleteModel

User = get_user_model()


class TrainingCategory(TimeStampedModel, SoftDeleteModel):
    """
    Category for grouping trainings.
    """
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=150, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description")
    image = models.ImageField(
        upload_to='training_categories/',
        blank=True,
        null=True,
        verbose_name="Image"
    )
    is_active = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        verbose_name = "Catégorie de formation"
        verbose_name_plural = "Catégories de formation"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Training(UUIDModel, TimeStampedModel, PublishableModel, SoftDeleteModel):
    """
    Training/Course model.
    """
    LEVEL_CHOICES = [
        ('BEGINNER', 'Débutant'),
        ('INTERMEDIATE', 'Intermédiaire'),
        ('ADVANCED', 'Avancé'),
    ]
    
    MODE_CHOICES = [
        ('ONLINE', 'En ligne'),
        ('ONSITE', 'Présentiel'),
        ('HYBRID', 'Hybride'),
    ]

    # Basic Information
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=250, unique=True, verbose_name="Slug")
    short_description = models.TextField(max_length=300, verbose_name="Description courte")
    description = models.TextField(verbose_name="Description complète")
    
    # Category
    category = models.ForeignKey(
        TrainingCategory,
        on_delete=models.PROTECT,
        related_name='trainings',
        verbose_name="Catégorie"
    )
    
    # Images
    image = models.ImageField(
        upload_to='trainings/',
        verbose_name="Image de couverture"
    )
    banner = models.ImageField(
        upload_to='trainings/banners/',
        blank=True,
        null=True,
        verbose_name="Bannière"
    )
    
    # Training Details
    objectives = models.JSONField(
        default=list,
        help_text="Liste des objectifs de la formation",
        verbose_name="Objectifs"
    )
    prerequisites = models.JSONField(
        default=list,
        help_text="Liste des prérequis",
        verbose_name="Prérequis"
    )
    target_audience = models.TextField(
        verbose_name="Public cible"
    )
    syllabus = models.JSONField(
        default=list,
        help_text="Programme de la formation (modules/chapitres)",
        verbose_name="Programme"
    )
    
    # Duration & Level
    duration = models.CharField(
        max_length=100,
        help_text="Ex: '5 jours', '40 heures', '3 mois'",
        verbose_name="Durée"
    )
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='BEGINNER',
        verbose_name="Niveau"
    )
    
    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name="Prix"
    )
    currency = models.CharField(
        max_length=10,
        default='XOF',
        verbose_name="Devise"
    )
    
    # Schedule
    start_date = models.DateField(
        verbose_name="Date de début"
    )
    end_date = models.DateField(
        verbose_name="Date de fin"
    )
    
    # Location & Mode
    location = models.CharField(
        max_length=200,
        verbose_name="Lieu"
    )
    training_mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
        default='ONLINE',
        verbose_name="Mode de formation"
    )
    
    # Instructor
    instructor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='trainings_taught',
        verbose_name="Formateur"
    )
    
    # Capacity
    capacity = models.IntegerField(
        default=20,
        help_text="Nombre maximum de participants",
        verbose_name="Capacité"
    )
    
    # Certification
    certification = models.BooleanField(
        default=False,
        verbose_name="Certification"
    )
    
    # Stats
    views_count = models.IntegerField(
        default=0,
        verbose_name="Nombre de vues"
    )
    
    # Creator
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='trainings_created',
        verbose_name="Créé par"
    )

    class Meta:
        verbose_name = "Formation"
        verbose_name_plural = "Formations"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
