"""
Service pour gérer les interactions avec FedaPay.
"""
import hmac
import hashlib
import json
import logging
from decimal import Decimal
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


class FedaPayService:
    """
    Service pour gérer les paiements via FedaPay.
    """
    
    @staticmethod
    def get_config():
        """Récupère la configuration FedaPay depuis les settings."""
        return {
            'mode': getattr(settings, 'FEDAPAY_MODE', 'sandbox'),
            'secret_key': getattr(settings, 'FEDAPAY_SECRET_KEY', ''),
            'public_key': getattr(settings, 'FEDAPAY_PUBLIC_KEY', ''),
            'webhook_secret': getattr(settings, 'FEDAPAY_WEBHOOK_SECRET', ''),
            'currency': getattr(settings, 'FEDAPAY_CURRENCY', 'XOF'),
            'callback_url': getattr(settings, 'FEDAPAY_CALLBACK_URL', ''),
        }
    
    @staticmethod
    def create_transaction(enrollment):
        """
        Crée une transaction FedaPay pour une inscription.
        
        Args:
            enrollment: Instance d'Enrollment
            
        Returns:
            dict: {'checkout_url': str, 'transaction_id': str}
        """
        try:
            import requests

            config = FedaPayService.get_config()
            base_url = 'https://api.fedapay.com' if config['mode'] == 'live' else 'https://sandbox-api.fedapay.com'
            headers = {
                'Authorization': f"Bearer {config['secret_key']}",
                'Content-Type': 'application/json',
            }

            customer = {
                'firstname': enrollment.full_name.split()[0] if enrollment.full_name else 'Client',
                'lastname': ' '.join(enrollment.full_name.split()[1:]) if len(enrollment.full_name.split()) > 1 else 'Client',
                'email': enrollment.email,
            }
            def detect_country(phone_str):
                if not phone_str:
                    return 'tg'
                clean = phone_str.strip().replace(' ', '').replace('-', '')
                if clean.startswith('+228') or clean.startswith('00228') or clean.startswith('228'):
                    return 'tg'
                if clean.startswith('+229') or clean.startswith('00229') or clean.startswith('229'):
                    return 'bj'
                if clean.startswith('+225') or clean.startswith('00225') or clean.startswith('225'):
                    return 'ci'
                if clean.startswith('+221') or clean.startswith('00221') or clean.startswith('221'):
                    return 'sn'
                if clean.startswith('+226') or clean.startswith('00226') or clean.startswith('226'):
                    return 'bf'
                if clean.startswith('+227') or clean.startswith('00227') or clean.startswith('227'):
                    return 'ne'
                return 'tg'

            if enrollment.phone:
                customer['phone_number'] = {
                    'number': enrollment.phone,
                    'country': detect_country(enrollment.phone),
                }

            # Données de la transaction
            transaction_data = {
                'description': f'Inscription - {enrollment.training.title}',
                'amount': int(enrollment.amount),
                'currency': {
                    'iso': enrollment.currency or 'XOF',
                },
                'callback_url': f"{config['callback_url']}/payment/callback?enrollment_id={enrollment.id}",
                'customer': customer,
                'custom_metadata': {
                    'enrollment_id': str(enrollment.id),
                    'training_slug': enrollment.training.slug,
                }
            }

            response = requests.post(
                f"{base_url}/v1/transactions",
                json=transaction_data,
                headers=headers,
                timeout=15
            )

            if not response.ok:
                logger.error(f"Erreur API FedaPay ({response.status_code}): {response.text}")
                raise Exception(f"Erreur FedaPay: {response.text}")

            res_data = response.json()
            trx = res_data.get('v1/transaction') or res_data.get('transaction') or res_data
            transaction_id = str(trx.get('id', ''))
            checkout_url = trx.get('payment_url')

            if not checkout_url:
                token_res = requests.post(
                    f"{base_url}/v1/transactions/{transaction_id}/token",
                    headers=headers,
                    timeout=15
                )
                if token_res.ok:
                    token_data = token_res.json()
                    checkout_url = token_data.get('url')

            # Mise à jour de l'enrollment
            enrollment.status = 'PROCESSING'
            enrollment.payment_attempts += 1
            enrollment.save()

            logger.info(f"Transaction FedaPay créée pour enrollment {enrollment.id}: {transaction_id}")

            return {
                'checkout_url': checkout_url,
                'transaction_id': transaction_id,
            }

        except Exception as e:
            logger.error(f"Erreur lors de la création de la transaction FedaPay: {str(e)}")
            raise Exception(f"Impossible de créer la transaction de paiement: {str(e)}")
    
    @staticmethod
    def verify_webhook_signature(payload_body, signature_header):
        """
        Vérifie la signature du webhook FedaPay.
        
        Args:
            payload_body: Corps de la requête webhook (bytes ou str)
            signature_header: Header X-FedaPay-Signature
            
        Returns:
            bool: True si la signature est valide
        """
        try:
            config = FedaPayService.get_config()
            webhook_secret = config['webhook_secret']
            
            if not webhook_secret:
                logger.warning("FEDAPAY_WEBHOOK_SECRET non configuré")
                return False
            
            # Convertir en bytes si nécessaire
            if isinstance(payload_body, str):
                payload_body = payload_body.encode('utf-8')
            
            # Calculer la signature attendue
            expected_signature = hmac.new(
                webhook_secret.encode('utf-8'),
                payload_body,
                hashlib.sha256
            ).hexdigest()
            
            # Comparer les signatures
            return hmac.compare_digest(expected_signature, signature_header)
            
        except Exception as e:
            logger.error(f"Erreur lors de la vérification de signature webhook: {str(e)}")
            return False
    
    @staticmethod
    def handle_webhook(payload):
        """
        Traite les notifications webhook de FedaPay.
        
        Args:
            payload: Dict contenant les données du webhook
            
        Returns:
            dict: {'success': bool, 'message': str}
        """
        from apps.trainings.models import Enrollment
        
        try:
            event_type = payload.get('type')
            transaction_data = payload.get('transaction', {})
            transaction_id = transaction_data.get('id')
            status = transaction_data.get('status')
            
            # Récupérer l'enrollment_id depuis custom_metadata
            custom_metadata = transaction_data.get('custom_metadata', {})
            enrollment_id = custom_metadata.get('enrollment_id')
            
            if not enrollment_id:
                logger.error(f"enrollment_id manquant dans le webhook: {payload}")
                return {'success': False, 'message': 'enrollment_id manquant'}
            
            # Récupérer l'inscription
            try:
                enrollment = Enrollment.objects.get(id=enrollment_id)
            except Enrollment.DoesNotExist:
                logger.error(f"Enrollment {enrollment_id} introuvable")
                return {'success': False, 'message': 'Inscription introuvable'}
            
            # Traiter selon le statut
            if status == 'approved' or event_type == 'transaction.approved':
                # Paiement réussi
                enrollment.status = 'PAID'
                enrollment.payment_id = transaction_id
                enrollment.paid_at = timezone.now()
                enrollment.save()
                
                logger.info(f"Paiement réussi pour enrollment {enrollment_id}")
                
                # TODO: Envoyer email de confirmation
                # send_enrollment_confirmation_email(enrollment)
                
                return {'success': True, 'message': 'Paiement confirmé'}
            
            elif status == 'declined' or event_type == 'transaction.declined':
                # Paiement échoué
                enrollment.status = 'FAILED'
                enrollment.save()
                
                logger.warning(f"Paiement échoué pour enrollment {enrollment_id}")
                
                return {'success': True, 'message': 'Paiement échoué'}
            
            elif status == 'canceled' or event_type == 'transaction.canceled':
                # Paiement annulé
                enrollment.status = 'CANCELLED'
                enrollment.save()
                
                logger.info(f"Paiement annulé pour enrollment {enrollment_id}")
                
                return {'success': True, 'message': 'Paiement annulé'}
            
            else:
                logger.warning(f"Statut webhook non géré: {status} - {event_type}")
                return {'success': False, 'message': f'Statut non géré: {status}'}
                
        except Exception as e:
            logger.error(f"Erreur lors du traitement du webhook: {str(e)}")
            return {'success': False, 'message': str(e)}
