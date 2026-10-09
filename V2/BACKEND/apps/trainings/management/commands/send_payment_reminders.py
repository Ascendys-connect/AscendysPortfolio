"""
Commande Django pour exécuter les relances automatiques de paiement (1h, 24h, 7j).
Usage: python manage.py send_payment_reminders
"""
from django.core.management.base import BaseCommand
from apps.trainings.services.reminder_service import PaymentReminderService


class Command(BaseCommand):
    help = "Vérifie et envoie les relances d'email de paiement (1h, 24h, 7j) pour les inscriptions en attente ou échouées."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Démarrage du traitement des relances de paiement..."))
        
        report = PaymentReminderService.process_all_pending_reminders()

        self.stdout.write(self.style.SUCCESS(
            f"Relances traitées avec succès :\n"
            f" - 1 heure  : {report['sent_1h']} email(s)\n"
            f" - 24 heures : {report['sent_24h']} email(s)\n"
            f" - 7 jours   : {report['sent_7d']} email(s)\n"
            f" - Échecs    : {report['failed']}"
        ))
