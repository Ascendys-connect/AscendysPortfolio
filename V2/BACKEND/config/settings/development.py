"""
Development settings for Ascendys Connect project.
"""

from .base import *

# Debug mode
DEBUG = True

# Development specific apps
# INSTALLED_APPS += [
#     'django_extensions',
# ]

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# Console email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Development database (can override with .env)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# Disable some security features in development
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
