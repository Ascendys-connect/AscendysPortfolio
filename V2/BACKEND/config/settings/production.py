"""
Production settings for Ascendys Connect project.
"""

from .base import *

# Security settings for production
DEBUG = False

# Security
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=True, cast=bool)
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=True, cast=bool)
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Ensure ALLOWED_HOSTS is properly set
# ALLOWED_HOSTS must be configured in .env file

# Use a proper email backend in production
# EMAIL_BACKEND should be configured in .env
