"""
Models for dashboard and activity logging.
"""
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from apps.core.models import TimeStampedModel, UUIDModel


class ActivityLog(UUIDModel, TimeStampedModel):
    """
    Model for tracking user activities and system events.
    """
    ACTION_CHOICES = [
        ('CREATE', 'Création'),
        ('UPDATE', 'Modification'),
        ('DELETE', 'Suppression'),
        ('VIEW', 'Consultation'),
        ('LOGIN', 'Connexion'),
        ('LOGOUT', 'Déconnexion'),
        ('EXPORT', 'Export'),
        ('IMPORT', 'Import'),
        ('OTHER', 'Autre'),
    ]
    
    # User who performed the action
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activities',
        verbose_name="Utilisateur"
    )
    
    # Action details
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name="Action"
    )
    description = models.TextField(verbose_name="Description")
    
    # Related object (generic relation)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="Type de contenu"
    )
    object_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="ID de l'objet"
    )
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Additional context
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="Adresse IP"
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name="User Agent"
    )
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Métadonnées"
    )
    
    class Meta:
        verbose_name = "Log d'activité"
        verbose_name_plural = "Logs d'activité"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        user_name = self.user.get_full_name() if self.user else "Système"
        return f"{user_name} - {self.get_action_display()} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    @classmethod
    def log_activity(cls, user, action, description, content_object=None, ip_address=None, user_agent=None, metadata=None):
        """
        Helper method to create activity log.
        """
        log = cls(
            user=user,
            action=action,
            description=description,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata=metadata or {}
        )
        
        if content_object:
            log.content_object = content_object
        
        log.save()
        return log
