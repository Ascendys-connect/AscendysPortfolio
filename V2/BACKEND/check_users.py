#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*60)
print("STATUS DES UTILISATEURS")
print("="*60 + "\n")

for user in User.objects.all():
    print(f"📧 Email: {user.email}")
    print(f"   ✉️  Email vérifié: {user.is_email_verified}")
    print(f"   🔑 Doit changer mot de passe: {user.must_change_password}")
    print(f"   👤 Rôle: {user.role}")
    print(f"   ✅ Actif: {user.is_active}")
    print(f"   {'🟢 PEUT SE CONNECTER' if user.is_email_verified and not user.must_change_password else '🔴 DOIT VÉRIFIER EMAIL/CHANGER MOT DE PASSE'}")
    print()

print("="*60)
