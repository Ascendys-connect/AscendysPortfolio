"""
Service de relance automatique pour les paiements d'inscriptions échoués ou en attente.
Relances prévues : 1 heure, 24 heures (1 jour) et 7 jours (1 semaine) après l'inscription.
"""
import logging
from datetime import timedelta
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from apps.trainings.models import Enrollment

logger = logging.getLogger(__name__)


class PaymentReminderService:
    """
    Gère l'envoi des emails de relance pour les inscriptions non payées.
    """

    STAGE_CONFIG = {
        '1h': {
            'subject_prefix': "Rappel : Finalisez votre inscription à",
            'headline': "Votre place n'attend plus que vous !",
            'intro': (
                "Nous avons constaté que le paiement de votre inscription n'a pas pu être finalisé. "
                "Ne vous inquiétez pas, votre pré-inscription est conservée pour vous permettre de la valider en toute tranquillité."
            ),
            'urgency_note': "Les places pour cette session sont limitées. Cliquez sur le bouton ci-dessous pour régler et réserver définitivement votre place.",
        },
        '24h': {
            'subject_prefix': "Ne manquez pas votre place : Votre formation",
            'headline': "Finalisez votre inscription dès aujourd'hui",
            'intro': (
                "Cela fait 24 heures que vous avez commencé votre inscription. "
                "Avez-vous rencontré un problème lors du paiement par Mobile Money (T-Money / Moov) ou Carte bancaire ?"
            ),
            'urgency_note': "Votre session approche. Nous restons disponibles pour vous assister si vous avez rencontré la moindre difficulté technique.",
        },
        '7d': {
            'subject_prefix': "Dernière opportunité : Reprenez votre inscription à",
            'headline': "Dernière chance pour réserver votre place",
            'intro': (
                "Il y a une semaine, vous vous êtes pré-inscrit(e) à notre formation. "
                "C'est notre dernier rappel avant la réattribution définitive des places disponibles."
            ),
            'urgency_note': "Profitez de cette dernière opportunité pour valider votre place et développer vos compétences avec nos formateurs certifiés.",
        },
        'manual': {
            'subject_prefix': "Rappel de votre inscription à",
            'headline': "Finalisation de votre paiement",
            'intro': (
                "Ce message vous est adressé par notre équipe pour vous permettre de finaliser votre inscription."
            ),
            'urgency_note': "Cliquez sur le lien ci-dessous pour finaliser votre paiement sécurisé.",
        }
    }

    @classmethod
    def get_frontend_url(cls):
        """Récupère l'URL de base du frontend depuis settings."""
        return getattr(settings, 'FEDAPAY_CALLBACK_URL', 'http://localhost:5173')

    @classmethod
    def build_email_html(cls, enrollment, stage='1h'):
        """
        Génère le contenu HTML premium de l'email de relance.
        """
        cfg = cls.STAGE_CONFIG.get(stage, cls.STAGE_CONFIG['1h'])
        frontend_url = cls.get_frontend_url().rstrip('/')
        payment_url = f"{frontend_url}/payment/{enrollment.id}"
        training_title = enrollment.training.title
        amount_display = f"{int(enrollment.amount):,} {enrollment.currency or 'XOF'}".replace(',', ' ')

        html = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{cfg['subject_prefix']} {training_title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f5fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f5fa; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #2A003D 0%, #6B0086 50%, #9800BF 100%); padding: 36px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">ASCENDYS CONNECT</h1>
              <p style="color: #FFD480; margin: 8px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px;">Formation Professionnelle & Certifiante</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Bonjour {enrollment.full_name},</h2>
              
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 16px 0;">
                {cfg['intro']}
              </p>

              <!-- Recap Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; margin: 24px 0; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #9800BF; margin-bottom: 6px;">Récapitulatif de votre inscription</div>
                    <div style="font-size: 17px; font-weight: 800; color: #1f2937; margin-bottom: 8px;">{training_title}</div>
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
                      Mode : <strong>{enrollment.training.get_training_mode_display() if hasattr(enrollment.training, 'get_training_mode_display') else 'Présentiel / En ligne'}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px dashed #d8b4fe; padding-top: 10px; margin-top: 10px;">
                      <span style="font-size: 14px; color: #4b5563;">Montant à régler :</span>
                      <span style="font-size: 18px; font-weight: 800; color: #9800BF;">{amount_display}</span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                {cfg['urgency_note']}
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{payment_url}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #9800BF 0%, #7B009A 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 36px; border-radius: 10px; box-shadow: 0 6px 18px rgba(152,0,191,0.35); text-align: center;">
                      Finaliser mon paiement &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0 0 24px 0;">
                Si le bouton ne fonctionne pas, copiez-collez ce lien :<br>
                <a href="{payment_url}" style="color: #9800BF; word-break: break-all;">{payment_url}</a>
              </p>

              <!-- Assistance Footer -->
              <div style="border-top: 1px solid #f3f4f6; padding-top: 20px; margin-top: 24px; font-size: 13px; color: #6b7280; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;"><strong>Besoin d'aide pour régler ?</strong></p>
                <p style="margin: 0;">
                  Nous acceptons T-Money (Mixx by Yas), Moov Money (Flooz) et les Cartes bancaires (Visa/Mastercard).<br>
                  Contactez notre support via WhatsApp au <strong>+228 91 31 76 87</strong> ou répondez directement à cet email.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px 0;">&copy; {timezone.now().year} ASCENDYS CONNECT. Tous droits réservés.</p>
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">Lomé, Togo &bull; Formation Professionnelle et Solutions Digitales</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
        return html

    @classmethod
    def build_email_text(cls, enrollment, stage='1h'):
        """Génère la version texte brut pour les clients mails sans HTML."""
        cfg = cls.STAGE_CONFIG.get(stage, cls.STAGE_CONFIG['1h'])
        frontend_url = cls.get_frontend_url().rstrip('/')
        payment_url = f"{frontend_url}/payment/{enrollment.id}"
        training_title = enrollment.training.title

        return f"""Bonjour {enrollment.full_name},

{cfg['intro']}

Formation : {training_title}
Montant : {int(enrollment.amount)} {enrollment.currency or 'XOF'}

Pour finaliser votre inscription et réserver définitivement votre place, veuillez cliquer sur le lien ci-dessous :
{payment_url}

{cfg['urgency_note']}

Moyens de paiement acceptés : T-Money (Mixx by Yas), Moov Money (Flooz) et Cartes bancaires (Visa/Mastercard).
En cas de question ou difficulté, contactez notre équipe par WhatsApp au +228 91 31 76 87.

Cordialement,
L'équipe ASCENDYS CONNECT
"""

    @classmethod
    def send_reminder(cls, enrollment, stage='1h'):
        """
        Envoie un email de relance pour une inscription donnée et met à jour son suivi.
        """
        if enrollment.status == 'PAID':
            logger.info(f"Enrollment {enrollment.id} déjà payé, relance ignorée.")
            return False

        cfg = cls.STAGE_CONFIG.get(stage, cls.STAGE_CONFIG['1h'])
        subject = f"{cfg['subject_prefix']} {enrollment.training.title} - Ascendys Connect"
        html_content = cls.build_email_html(enrollment, stage=stage)
        text_content = cls.build_email_text(enrollment, stage=stage)

        try:
            send_mail(
                subject=subject,
                message=text_content,
                html_message=html_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[enrollment.email],
                fail_silently=False,
            )

            now = timezone.now()
            if stage == '1h':
                enrollment.reminder_1h_sent_at = now
            elif stage == '24h':
                enrollment.reminder_24h_sent_at = now
            elif stage == '7d':
                enrollment.reminder_7d_sent_at = now

            enrollment.reminders_count = (enrollment.reminders_count or 0) + 1
            enrollment.save(update_fields=[
                'reminder_1h_sent_at',
                'reminder_24h_sent_at',
                'reminder_7d_sent_at',
                'reminders_count'
            ])

            logger.info(f"Relance [{stage}] envoyée avec succès à {enrollment.email} pour {enrollment.id}")
            return True

        except Exception as e:
            logger.error(f"Erreur lors de l'envoi de la relance [{stage}] pour {enrollment.id}: {str(e)}")
            return False

    @classmethod
    def process_all_pending_reminders(cls):
        """
        Scanne toutes les inscriptions non payées et envoie les relances appropriées (1h, 24h, 7j).
        Retourne un rapport d'exécution.
        """
        now = timezone.now()
        report = {
            'sent_1h': 0,
            'sent_24h': 0,
            'sent_7d': 0,
            'failed': 0,
        }

        # Cibler les inscriptions en statut non payé (PENDING ou FAILED)
        unpaid_enrollments = Enrollment.objects.filter(
            status__in=['PENDING', 'FAILED']
        ).select_related('training')

        for enrollment in unpaid_enrollments:
            age = now - enrollment.created_at

            # 1. Relance 1 heure (entre 1h et 24h, si non envoyée)
            if age >= timedelta(hours=1) and not enrollment.reminder_1h_sent_at:
                if cls.send_reminder(enrollment, stage='1h'):
                    report['sent_1h'] += 1
                else:
                    report['failed'] += 1

            # 2. Relance 24 heures (entre 24h et 7j, si non envoyée)
            elif age >= timedelta(days=1) and not enrollment.reminder_24h_sent_at:
                if cls.send_reminder(enrollment, stage='24h'):
                    report['sent_24h'] += 1
                else:
                    report['failed'] += 1

            # 3. Relance 7 jours (après 7 jours, si non envoyée)
            elif age >= timedelta(days=7) and not enrollment.reminder_7d_sent_at:
                if cls.send_reminder(enrollment, stage='7d'):
                    report['sent_7d'] += 1
                else:
                    report['failed'] += 1

        return report
