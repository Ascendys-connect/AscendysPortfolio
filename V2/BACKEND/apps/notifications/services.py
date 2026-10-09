"""
Services for managing and dispatching notifications.
"""
import logging
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Notification

logger = logging.getLogger(__name__)
User = get_user_model()


class NotificationService:
    """
    Central service to create and query notifications.
    """

    @classmethod
    def notify_admins(cls, notification_type, title, message, link='', metadata=None):
        """
        Creates and dispatches a notification to all active administrators and super-administrators.
        """
        try:
            admins = User.objects.filter(
                role__in=['ADMIN', 'SUPER_ADMIN'],
                is_active=True,
                is_deleted=False
            )

            if not admins.exists():
                logger.warning(f"No active admins found to notify about: {title}")
                return []

            notifications = [
                Notification(
                    recipient=admin,
                    type=notification_type,
                    title=title,
                    message=message,
                    link=link,
                    metadata=metadata or {}
                )
                for admin in admins
            ]

            created = Notification.objects.bulk_create(notifications)
            logger.info(f"Dispatched notification '{title}' to {len(created)} admin(s).")
            return created
        except Exception as e:
            logger.error(f"Error notifying admins ({title}): {str(e)}", exc_info=True)
            return []

    @classmethod
    def notify_user(cls, user, notification_type, title, message, link='', metadata=None):
        """
        Creates a notification for a specific user.
        """
        try:
            notification = Notification.objects.create(
                recipient=user,
                type=notification_type,
                title=title,
                message=message,
                link=link,
                metadata=metadata or {}
            )
            return notification
        except Exception as e:
            logger.error(f"Error notifying user {user.id} ({title}): {str(e)}", exc_info=True)
            return None

    @classmethod
    def broadcast_message(cls, sender, target_type, roles=None, user_ids=None, title='', message='', link='', priority='NORMAL'):
        """
        Broadcasts a notification to a group of users (all users, specific roles, or specific user IDs).
        """
        try:
            base_qs = User.objects.filter(is_active=True, is_deleted=False)

            if target_type == 'ALL':
                recipients = base_qs
            elif target_type == 'ROLE':
                if not roles:
                    return []
                recipients = base_qs.filter(role__in=roles)
            elif target_type == 'CUSTOM':
                if not user_ids:
                    return []
                recipients = base_qs.filter(id__in=user_ids)
            else:
                recipients = base_qs.none()

            recipients_list = list(recipients.distinct())
            if not recipients_list:
                logger.warning(f"No recipients found for broadcast target {target_type}")
                return []

            sender_name = f"{sender.first_name} {sender.last_name}".strip() if sender else "Administration"
            sender_email = sender.email if sender else ""

            notifications = [
                Notification(
                    recipient=user,
                    type=Notification.TYPE_BROADCAST,
                    title=title,
                    message=message,
                    link=link or '',
                    metadata={
                        'sender_id': str(sender.id) if sender else None,
                        'sender_name': sender_name,
                        'sender_email': sender_email,
                        'priority': priority,
                        'target_type': target_type,
                    }
                )
                for user in recipients_list
            ]

            created = Notification.objects.bulk_create(notifications)
            logger.info(f"Broadcast '{title}' sent to {len(created)} user(s) by {sender_email}.")
            return created
        except Exception as e:
            logger.error(f"Error broadcasting message ({title}): {str(e)}", exc_info=True)
            return []

    @classmethod
    def get_unread_count(cls, user):
        """
        Returns number of unread notifications for a user.
        """
        return Notification.objects.filter(recipient=user, is_read=False).count()

    @classmethod
    def mark_all_as_read(cls, user):
        """
        Marks all unread notifications of a user as read.
        """
        now = timezone.now()
        count = Notification.objects.filter(recipient=user, is_read=False).update(
            is_read=True,
            read_at=now,
            updated_at=now
        )
        return count

    @classmethod
    def clear_all_read(cls, user):
        """
        Deletes all read notifications of a user.
        """
        count, _ = Notification.objects.filter(recipient=user, is_read=True).delete()
        return count
