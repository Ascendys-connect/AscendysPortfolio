"""
Models for contact and newsletter functionality.
"""
from django.db import models
from django.core.validators import EmailValidator
from apps.core.models import TimeStampedModel


class ContactMessage(TimeStampedModel):
    """
    Model for contact form submissions.
    """
    STATUS_CHOICES = [
        ('NEW', 'Nouveau'),
        ('IN_PROGRESS', 'En cours'),
        ('RESOLVED', 'Résolu'),
        ('CLOSED', 'Fermé'),
    ]
    
    SUBJECT_CHOICES = [
        ('GENERAL', 'Question générale'),
        ('TRAINING', 'Demande de formation'),
        ('SERVICE', 'Demande de service'),
        ('PARTNERSHIP', 'Partenariat'),
        ('SUPPORT', 'Support technique'),
        ('OTHER', 'Autre'),
    ]
    
    # Contact info
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(
        validators=[EmailValidator()],
        verbose_name="Email"
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Téléphone"
    )
    company = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Entreprise"
    )
    
    # Message details
    subject = models.CharField(
        max_length=20,
        choices=SUBJECT_CHOICES,
        default='GENERAL',
        verbose_name="Sujet"
    )
    message = models.TextField(verbose_name="Message")
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='NEW',
        verbose_name="Statut"
    )
    admin_notes = models.TextField(
        blank=True,
        verbose_name="Notes admin"
    )
    assigned_to = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_messages',
        verbose_name="Assigné à"
    )
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Résolu le"
    )
    
    # Privacy
    consent_privacy = models.BooleanField(
        default=False,
        verbose_name="Consentement RGPD"
    )
    
    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['subject']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.get_subject_display()}"
    
    def mark_as_resolved(self):
        """Mark message as resolved."""
        from django.utils import timezone
        self.status = 'RESOLVED'
        self.resolved_at = timezone.now()
        self.save()


class NewsletterSubscriber(TimeStampedModel):
    """
    Model for newsletter subscriptions.
    """
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        verbose_name="Email"
    )
    first_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Prénom"
    )
    last_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Nom"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name="Email vérifié"
    )
    verification_token = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Token de vérification"
    )
    consent_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de consentement"
    )
    unsubscribed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Désabonné le"
    )
    
    # Preferences
    interests = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Centres d'intérêt"
    )
    
    class Meta:
        verbose_name = "Abonné newsletter"
        verbose_name_plural = "Abonnés newsletter"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.email
    
    def unsubscribe(self):
        """Unsubscribe from newsletter."""
        from django.utils import timezone
        self.is_active = False
        self.unsubscribed_at = timezone.now()
        self.save()
    
    def verify_email(self):
        """Mark email as verified."""
        self.is_verified = True
        self.verification_token = ''
        self.save()
