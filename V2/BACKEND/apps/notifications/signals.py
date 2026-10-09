"""
Django signals to automatically create notifications on key events:
- New payment (Enrollment marked as PAID)
- Contact form submission (ContactMessage created)
- Newsletter subscription (NewsletterSubscriber created)
"""
import logging
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from apps.contact.models import ContactMessage, NewsletterSubscriber
from apps.trainings.models import Enrollment
from .services import NotificationService

logger = logging.getLogger(__name__)


@receiver(post_save, sender=ContactMessage)
def notify_on_contact_message(sender, instance, created, **kwargs):
    """
    Notify administrators when a new contact message is received.
    """
    if created:
        try:
            full_name = f"{instance.first_name} {instance.last_name}".strip()
            subject_display = instance.get_subject_display() if hasattr(instance, 'get_subject_display') else instance.subject
            title = f"Nouveau message de contact : {full_name}"
            message = f"{full_name} ({instance.email}) vous a envoyé un message : « {subject_display} »."
            link = "/messages/contacts"

            NotificationService.notify_admins(
                notification_type='CONTACT',
                title=title,
                message=message,
                link=link,
                metadata={
                    'contact_id': str(instance.id),
                    'full_name': full_name,
                    'email': instance.email,
                    'phone': instance.phone,
                    'subject': instance.subject,
                    'company': instance.company,
                }
            )
        except Exception as e:
            logger.error(f"Error sending contact notification: {str(e)}", exc_info=True)


@receiver(post_save, sender=NewsletterSubscriber)
def notify_on_newsletter_subscription(sender, instance, created, **kwargs):
    """
    Notify administrators when a new newsletter subscription occurs.
    """
    if created:
        try:
            title = "Nouvel abonnement à la newsletter"
            message = f"Un nouvel utilisateur ({instance.email}) s'est abonné à la newsletter."
            link = "/messages/newsletter"

            NotificationService.notify_admins(
                notification_type='NEWSLETTER',
                title=title,
                message=message,
                link=link,
                metadata={
                    'subscriber_id': str(instance.id),
                    'email': instance.email,
                    'created_at': instance.created_at.isoformat() if instance.created_at else None,
                }
            )
        except Exception as e:
            logger.error(f"Error sending newsletter notification: {str(e)}", exc_info=True)


@receiver(pre_save, sender=Enrollment)
def track_enrollment_status_change(sender, instance, **kwargs):
    """
    Track previous status of Enrollment to detect when it changes to PAID.
    """
    if instance.pk:
        try:
            old_instance = Enrollment.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Enrollment.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Enrollment)
def notify_on_enrollment_paid(sender, instance, created, **kwargs):
    """
    Notify administrators when an enrollment payment is confirmed (status = PAID).
    """
    try:
        old_status = getattr(instance, '_old_status', None)
        is_now_paid = instance.status == 'PAID'
        was_already_paid = old_status == 'PAID'

        if is_now_paid and not was_already_paid:
            training_title = instance.training.title if instance.training else 'Formation'
            formatted_amount = f"{int(instance.amount):,} {instance.currency}".replace(',', ' ')
            title = f"Nouveau paiement reçu ({formatted_amount})"
            message = f"{instance.full_name} a effectué avec succès son paiement pour la formation « {training_title} »."
            link = "/admin/trainings/enrollments"

            NotificationService.notify_admins(
                notification_type='PAYMENT',
                title=title,
                message=message,
                link=link,
                metadata={
                    'enrollment_id': str(instance.id),
                    'full_name': instance.full_name,
                    'email': instance.email,
                    'amount': str(instance.amount),
                    'currency': instance.currency,
                    'training_id': str(instance.training.id) if instance.training else None,
                    'training_title': training_title,
                    'payment_id': instance.payment_id,
                }
            )
    except Exception as e:
        logger.error(f"Error sending enrollment payment notification: {str(e)}", exc_info=True)
