"""
Models for user and administrator notifications.
"""
from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.core.models import TimeStampedModel, UUIDModel


class Notification(UUIDModel, TimeStampedModel):
    """
    Model representing an in-app notification sent to a user/admin.
    """
    TYPE_PAYMENT = 'PAYMENT'
    TYPE_CONTACT = 'CONTACT'
    TYPE_NEWSLETTER = 'NEWSLETTER'
    TYPE_SYSTEM = 'SYSTEM'
    TYPE_BROADCAST = 'BROADCAST'

    TYPE_CHOICES = [
        (TYPE_PAYMENT, 'Nouveau paiement'),
        (TYPE_CONTACT, 'Message de contact'),
        (TYPE_NEWSLETTER, 'Abonnement newsletter'),
        (TYPE_SYSTEM, 'Système'),
        (TYPE_BROADCAST, 'Message diffusé'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name="Destinataire"
    )
    type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default=TYPE_SYSTEM,
        verbose_name="Type de notification"
    )
    title = models.CharField(
        max_length=255,
        verbose_name="Titre"
    )
    message = models.TextField(
        verbose_name="Message"
    )
    link = models.CharField(
        max_length=255,
        blank=True,
        default='',
        verbose_name="Lien de redirection"
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name="Lu"
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de lecture"
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Métadonnées"
    )

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
            models.Index(fields=['type']),
        ]

    def __str__(self):
        return f"[{self.get_type_display()}] {self.title} -> {self.recipient.email}"

    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at', 'updated_at'])

    def mark_as_unread(self):
        """Mark notification as unread."""
        if self.is_read:
            self.is_read = False
            self.read_at = None
            self.save(update_fields=['is_read', 'read_at', 'updated_at'])
