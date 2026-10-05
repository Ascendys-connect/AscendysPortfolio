"""
Testimonial model for client feedback.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.core.models import TimeStampedModel, SoftDeleteModel


class Testimonial(TimeStampedModel, SoftDeleteModel):
    """
    Model for client testimonials.
    """
    name = models.CharField(max_length=100, verbose_name="Nom")
    role = models.CharField(max_length=100, verbose_name="Fonction")
    company = models.CharField(max_length=150, blank=True, verbose_name="Entreprise")
    avatar = models.ImageField(
        upload_to='testimonials/',
        blank=True,
        null=True,
        verbose_name="Photo"
    )
    content = models.TextField(verbose_name="Témoignage")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5,
        verbose_name="Note"
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name="Mis en avant"
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name="Publié"
    )
    order = models.IntegerField(
        default=0,
        help_text="Ordre d'affichage (croissant)",
        verbose_name="Ordre"
    )

    class Meta:
        verbose_name = "Témoignage"
        verbose_name_plural = "Témoignages"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.name} - {self.company}"
