# 📚 Système d'Inscription aux Formations

## Vue d'ensemble

Ce système permet aux utilisateurs de s'inscrire aux formations et de payer via FedaPay.

## 🔄 Cycle de vie d'une inscription

```
1. User remplit le formulaire → Status: PENDING
2. User clique "Payer maintenant" → Status: PROCESSING
3a. Paiement réussi (webhook) → Status: PAID ✅
3b. Paiement échoué (webhook) → Status: FAILED ❌
3c. User annule → Status: CANCELLED
4. Expiration (48h) → Status: EXPIRED
```

## 📊 États (Status)

| Status | Description | Actions possibles |
|--------|-------------|-------------------|
| `PENDING` | En attente de paiement | Initier paiement |
| `PROCESSING` | Paiement en cours | Attendre webhook |
| `PAID` | Payé et confirmé | ✅ Accès formation |
| `FAILED` | Échec de paiement | Réessayer |
| `CANCELLED` | Annulé par l'utilisateur | Réessayer |
| `EXPIRED` | Dépassé 48h | Créer nouvelle inscription |

## 🔌 API Endpoints

### Créer une inscription
```http
POST /api/v1/trainings/enrollments/
Content-Type: application/json

{
  "training": "training-id",
  "full_name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+229 XX XX XX XX",
  "education_level": "BACHELOR",
  "education_level_other": null
}
```

### Initier le paiement
```http
POST /api/v1/trainings/enrollments/{id}/initiate-payment/
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.fedapay.com/...",
    "transaction_id": "txn_xxx",
    "enrollment_id": "uuid"
  }
}
```

### Webhook FedaPay
```http
POST /api/v1/trainings/enrollments/webhook/
X-FedaPay-Signature: signature_hash

{
  "type": "transaction.approved",
  "transaction": {
    "id": "txn_xxx",
    "status": "approved",
    "custom_metadata": {
      "enrollment_id": "uuid"
    }
  }
}
```

## ⚙️ Configuration FedaPay

### Variables d'environnement (.env)

```env
FEDAPAY_MODE=sandbox  # ou 'live'
FEDAPAY_SECRET_KEY=sk_sandbox_xxx
FEDAPAY_PUBLIC_KEY=pk_sandbox_xxx
FEDAPAY_WEBHOOK_SECRET=whsec_xxx
FEDAPAY_CURRENCY=XOF
FEDAPAY_CALLBACK_URL=http://localhost:5173
```

### Configuration Dashboard FedaPay

1. Aller dans **Settings > Webhooks**
2. Ajouter l'URL: `https://api.ascendys.com/api/v1/trainings/enrollments/webhook/`
3. Sélectionner les events:
   - `transaction.approved`
   - `transaction.declined`
   - `transaction.canceled`

## 🎨 Frontend - Pages

### Routes publiques

| Route | Description |
|-------|-------------|
| `/formations` | Liste toutes les formations |
| `/enroll?training=slug` | Formulaire d'inscription |
| `/payment/:enrollmentId` | Page de paiement |
| `/payment/success?id=xxx` | Confirmation succès |
| `/payment/error?id=xxx` | Erreur paiement |

### Flow utilisateur

```
Carte Formation [S'inscrire]
  ↓
Formulaire (/enroll?training=python-avance)
  ↓
Submit → POST /enrollments/ → Enrollment PENDING
  ↓
Paiement (/payment/uuid)
  ↓
[Payer maintenant] → POST /initiate-payment/ → checkout_url
  ↓
Redirection FedaPay
  ↓
Webhook → Update Status
  ↓
Redirect Success/Error
```

## 🛡️ Sécurité

### Vérification Webhook

```python
from apps.trainings.services import FedaPayService

signature = request.headers.get('X-FedaPay-Signature')
is_valid = FedaPayService.verify_webhook_signature(
    request.body, 
    signature
)
```

### Idempotence

- Les `payment_id` sont uniques
- Le webhook ne traite pas 2x la même transaction

## 🔧 Maintenance

### Expirer les inscriptions (Celery/Cron)

```python
# tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.trainings.models import Enrollment

@shared_task
def expire_pending_enrollments():
    """
    Marque comme EXPIRED les inscriptions PENDING/FAILED > 48h
    """
    cutoff = timezone.now() - timedelta(hours=48)
    
    expired_count = Enrollment.objects.filter(
        status__in=['PENDING', 'FAILED'],
        created_at__lt=cutoff,
        is_expired=False
    ).update(status='EXPIRED')
    
    return f"{expired_count} inscription(s) expirée(s)"
```

### Cron quotidien

```bash
# Ajouter dans crontab
0 2 * * * cd /path/to/project && python manage.py expire_enrollments
```

## 📧 Notifications Email

### À implémenter

```python
def send_enrollment_confirmation(enrollment):
    """Envoyer email après paiement réussi"""
    send_mail(
        subject=f'Inscription confirmée - {enrollment.training.title}',
        message=f'Bonjour {enrollment.full_name}...',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[enrollment.email],
    )
```

## 🧪 Tests

### Tester avec FedaPay Sandbox

1. Utiliser les cartes de test: https://docs.fedapay.com/testing
2. Carte Visa: `4000000000000002`
3. Date expiration: future
4. CVV: n'importe quel 3 chiffres

### Mode Sandbox

Les transactions en mode `sandbox` ne sont pas réelles.

## 📝 Logs

Les logs sont dans:
- `logs/django.log`
- Service FedaPay: logger `apps.trainings.services`

```python
import logging
logger = logging.getLogger(__name__)
logger.info(f"Paiement réussi pour enrollment {enrollment_id}")
```

## 🚀 Déploiement Production

### Checklist

- [ ] Passer `FEDAPAY_MODE=live`
- [ ] Utiliser les vraies clés FedaPay
- [ ] Configurer le webhook sur le domaine de production
- [ ] Activer HTTPS (obligatoire pour webhook)
- [ ] Tester le flow complet
- [ ] Configurer les emails transactionnels
- [ ] Mettre en place le monitoring

## 📊 Monitoring

### Métriques à surveiller

- Taux de conversion (enrollments → paid)
- Taux d'abandon (pending → expired)
- Taux d'échec paiement
- Temps moyen de paiement

## 🆘 Support

En cas de problème:

1. Vérifier les logs backend
2. Vérifier les webhooks dans le dashboard FedaPay
3. Tester la signature webhook
4. Vérifier que l'enrollment existe
5. Contacter le support FedaPay si nécessaire
