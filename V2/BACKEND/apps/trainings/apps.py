import os
import sys
import threading
import time
import logging
from django.apps import AppConfig

logger = logging.getLogger(__name__)


class TrainingsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.trainings'
    verbose_name = 'Formations'

    def ready(self):
        # Éviter d'exécuter pendant les commandes de maintenance (migrate, shell, etc.)
        is_maintenance = any(cmd in sys.argv for cmd in ['makemigrations', 'migrate', 'collectstatic', 'test', 'shell', 'send_payment_reminders'])
        if is_maintenance:
            return

        # En mode runserver, s'exécuter uniquement dans le processus principal de rechargement
        if 'runserver' in sys.argv and os.environ.get('RUN_MAIN') != 'true':
            return

        def _reminder_worker():
            time.sleep(15)  # Attente initiale du boot serveur
            logger.info("[Scheduler] Service de relances automatiques activé.")
            while True:
                try:
                    from apps.trainings.services.reminder_service import PaymentReminderService
                    report = PaymentReminderService.process_all_pending_reminders()
                    sent_total = report['sent_1h'] + report['sent_24h'] + report['sent_7d']
                    if sent_total > 0:
                        logger.info(f"[Scheduler] {sent_total} email(s) de relance envoyé(s).")
                except Exception as e:
                    logger.error(f"[Scheduler] Erreur relance automatique : {e}")
                time.sleep(1800)  # Re-vérifie toutes les 30 minutes

        thread = threading.Thread(target=_reminder_worker, daemon=True, name="PaymentReminderScheduler")
        thread.start()
