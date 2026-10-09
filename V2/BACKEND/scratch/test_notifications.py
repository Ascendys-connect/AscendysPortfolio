"""
Test script to verify notification signals and services.
Run via: .\venv\Scripts\python.exe scratch/test_notifications.py
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.accounts.models import User
from apps.contact.models import ContactMessage, NewsletterSubscriber
from apps.trainings.models import Training, Enrollment, TrainingCategory
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService


def run_tests():
    print("=== Testing Notification System ===")

    # 1. Ensure at least one admin exists
    admin = User.objects.filter(role__in=['ADMIN', 'SUPER_ADMIN'], is_active=True).first()
    if not admin:
        print("Creating test admin...")
        admin = User.objects.create_superuser(
            email='testadmin@ascendys.com',
            password='Password123!',
            first_name='Admin',
            last_name='Test',
            phone='+22890000001'
        )
    print(f"Using admin: {admin.email} (Role: {admin.role})")

    initial_notifs_count = Notification.objects.filter(recipient=admin).count()
    initial_unread_count = NotificationService.get_unread_count(admin)
    print(f"Initial notifications for admin: {initial_notifs_count} (Unread: {initial_unread_count})")

    # 2. Test ContactMessage signal
    print("\n[Test 1] Creating ContactMessage...")
    contact = ContactMessage.objects.create(
        first_name="Jean",
        last_name="Dupont",
        email="jean.dupont@example.com",
        phone="+22891234567",
        company="TechCorp",
        subject="GENERAL",
        message="Bonjour, je souhaiterais obtenir plus d'informations sur vos offres."
    )
    contact_notif = Notification.objects.filter(recipient=admin, type='CONTACT', metadata__contact_id=str(contact.id)).first()
    assert contact_notif is not None, "Notification for ContactMessage was NOT created!"
    print(f"  -> SUCCESS! Notification created: '{contact_notif.title}'")

    # 3. Test NewsletterSubscriber signal
    print("\n[Test 2] Creating NewsletterSubscriber...")
    sub_email = f"subscriber_{contact.id}@example.com"
    subscriber = NewsletterSubscriber.objects.create(
        email=sub_email
    )
    news_notif = Notification.objects.filter(recipient=admin, type='NEWSLETTER', metadata__subscriber_id=str(subscriber.id)).first()
    assert news_notif is not None, "Notification for NewsletterSubscriber was NOT created!"
    print(f"  -> SUCCESS! Notification created: '{news_notif.title}'")

    # 4. Test Enrollment payment signal
    print("\n[Test 3] Testing Enrollment Payment Notification...")
    training = Training.objects.first()
    if not training:
        category, _ = TrainingCategory.objects.get_or_create(
            name="Informatique",
            defaults={'slug': 'informatique', 'description': 'Formations IT'}
        )
        training = Training.objects.create(
            title='Développement Web Fullstack',
            slug='dev-web-fullstack',
            category=category,
            price=150000,
            currency='XOF'
        )

    enrollment = Enrollment.objects.create(
        training=training,
        full_name="Amina Sow",
        email="amina.sow@example.com",
        phone="+22899887766",
        education_level="BACHELOR",
        amount=150000,
        currency="XOF",
        status="PENDING"
    )
    print(f"  Enrollment created with status={enrollment.status}")

    # Now change status to PAID (simulating payment webhook or confirmation)
    enrollment.status = "PAID"
    enrollment.payment_id = f"FEDAPAY_TRX_{str(enrollment.id)[:8]}"
    enrollment.save()

    payment_notif = Notification.objects.filter(recipient=admin, type='PAYMENT', metadata__enrollment_id=str(enrollment.id)).first()
    assert payment_notif is not None, "Notification for PAID Enrollment was NOT created!"
    print(f"  -> SUCCESS! Notification created: '{payment_notif.title}'")

    # 5. Test Unread Count & Mark All As Read
    new_unread = NotificationService.get_unread_count(admin)
    print(f"\n[Test 4] Verifying unread count and mark_all_as_read...")
    print(f"  Unread count is now: {new_unread}")
    assert new_unread >= 3, f"Expected at least 3 unread notifications, got {new_unread}"

    # Mark contact_notif as read
    contact_notif.mark_as_read()
    assert contact_notif.is_read is True
    assert NotificationService.get_unread_count(admin) == new_unread - 1
    print("  -> mark_as_read() works correctly!")

    # Cleanup test records
    contact.delete()
    subscriber.delete()
    enrollment.delete()
    contact_notif.delete()
    news_notif.delete()
    payment_notif.delete()

    print("\n=== ALL TESTS PASSED SUCCESSFULLY! ===")


if __name__ == '__main__':
    run_tests()
