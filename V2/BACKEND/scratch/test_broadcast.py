"""
Test script to verify broadcast notifications.
Run via: .\venv\Scripts\python.exe scratch/test_broadcast.py
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from apps.accounts.models import User
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService


def test_broadcast():
    print("=== Testing Broadcast Notifications ===")
    admin = User.objects.filter(role='SUPER_ADMIN', is_active=True).first()
    assert admin is not None, "No active admin found"

    # Test 1: Broadcast to ALL
    print("\n[Test 1] Broadcast to ALL users...")
    notifs_all = NotificationService.broadcast_message(
        sender=admin,
        target_type='ALL',
        title='Maintenance du serveur',
        message='Une mise a jour sera effectuee cette nuit a 23h.',
        link='/dashboard',
        priority='HIGH'
    )
    all_users_count = User.objects.filter(is_active=True, is_deleted=False).count()
    print(f"  Sent {len(notifs_all)} notifications (Total active users: {all_users_count})")
    assert len(notifs_all) == all_users_count

    # Check notification attributes
    first = notifs_all[0]
    assert first.type == 'BROADCAST'
    assert first.title == 'Maintenance du serveur'
    assert first.metadata['priority'] == 'HIGH'
    assert first.is_read is False

    # Test 2: Broadcast by ROLE
    print("\n[Test 2] Broadcast by ROLE (EDITOR)...")
    notifs_editors = NotificationService.broadcast_message(
        sender=admin,
        target_type='ROLE',
        roles=['EDITOR'],
        title='Rappel publication articles',
        message='Merci de relire les brouillons en attente de validation.',
        link='/admin/blog/posts',
        priority='NORMAL'
    )
    editors_count = User.objects.filter(role='EDITOR', is_active=True, is_deleted=False).count()
    print(f"  Sent {len(notifs_editors)} notifications to editors (Total editors: {editors_count})")
    assert len(notifs_editors) == editors_count

    # Test 3: Broadcast CUSTOM user
    print("\n[Test 3] Broadcast CUSTOM user...")
    notifs_custom = NotificationService.broadcast_message(
        sender=admin,
        target_type='CUSTOM',
        user_ids=[str(admin.id)],
        title='Message personnalise',
        message='Bienvenue dans votre espace d administration.',
        link='/notifications',
        priority='NORMAL'
    )
    print(f"  Sent {len(notifs_custom)} notifications to custom user")
    assert len(notifs_custom) == 1
    assert notifs_custom[0].recipient == admin

    # Cleanup test broadcast notifications
    Notification.objects.filter(type='BROADCAST', title__in=[
        'Maintenance du serveur',
        'Rappel publication articles',
        'Message personnalise'
    ]).delete()

    print("\n=== ALL BROADCAST TESTS PASSED SUCCESSFULLY! ===")


if __name__ == '__main__':
    test_broadcast()
