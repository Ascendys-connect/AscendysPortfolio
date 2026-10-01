"""
Email service for sending verification codes and notifications.
"""
import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def send_verification_email(user, code):
    """
    Send verification code email to user.
    
    Args:
        user: User instance
        code: 6-digit verification code
    """
    subject = 'Code de vérification - Ascendys Connect'
    
    message = f"""
Bonjour {user.first_name} {user.last_name},

Bienvenue sur Ascendys Connect !

Voici votre code de vérification pour activer votre compte :

{code}

Ce code est valable pendant 15 minutes.

Si vous n'avez pas créé de compte sur Ascendys Connect, veuillez ignorer ce message.

Cordialement,
L'équipe Ascendys Connect
"""
    
    # Log the OTP code for development (will be removed in production)
    logger.info(f"OTP Code for {user.email}: {code}")
    logger.info(f"   User: {user.first_name} {user.last_name}")
    logger.info(f"   Valid for: 15 minutes")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Verification email sent successfully to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False


def send_password_changed_email(user):
    """
    Send notification email when password is changed.
    
    Args:
        user: User instance
    """
    subject = 'Mot de passe modifié - Ascendys Connect'
    
    message = f"""
Bonjour {user.first_name} {user.last_name},

Votre mot de passe a été modifié avec succès.

Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement l'administrateur.

Cordialement,
L'équipe Ascendys Connect
"""
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Password change notification sent to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password change notification to {user.email}: {str(e)}")
        return False


def send_password_reset_email(user, code):
    """
    Send password reset code email to user.
    
    Args:
        user: User instance
        code: 6-digit reset code
    """
    subject = 'Réinitialisation de mot de passe - Ascendys Connect'
    
    message = f"""
Bonjour {user.first_name} {user.last_name},

Vous avez demandé la réinitialisation de votre mot de passe sur Ascendys Connect.

Voici votre code de vérification :

{code}

Ce code est valable pendant 15 minutes.

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message et votre mot de passe restera inchangé.

Cordialement,
L'équipe Ascendys Connect
"""
    
    # Log the code for development
    logger.info(f"Password Reset Code for {user.email}: {code}")
    logger.info(f"   User: {user.first_name} {user.last_name}")
    logger.info(f"   Valid for: 15 minutes")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"Password reset email sent successfully to {user.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        return False
