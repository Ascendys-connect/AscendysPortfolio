# 🚀 Guide de Déploiement - Ascendys Connect Backend

## 📋 Prérequis

- Python 3.10+
- PostgreSQL 14+
- Redis (pour cache et rate limiting en production)
- Serveur web (Nginx/Apache)
- Supervisor/systemd (pour gérer Gunicorn)

## 🔧 Installation en Production

### 1. Cloner le projet
```bash
git clone https://github.com/ascendys-connect/backend.git
cd backend
```

### 2. Créer l'environnement virtuel
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

### 3. Installer les dépendances
```bash
pip install -r requirements/production.txt
```

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
```

Variables importantes:
```env
# Django
SECRET_KEY=your-super-secret-key-here-CHANGE-THIS
DEBUG=False
ALLOWED_HOSTS=ascendysconnect.com,www.ascendysconnect.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ascendys_connect_prod
DB_USER=ascendys_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Email (SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@ascendysconnect.com
EMAIL_HOST_PASSWORD=your-email-password

# CORS
CORS_ALLOWED_ORIGINS=https://ascendysconnect.com,https://www.ascendysconnect.com
```

### 5. Créer la base de données
```bash
sudo -u postgres psql
CREATE DATABASE ascendys_connect_prod;
CREATE USER ascendys_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ascendys_connect_prod TO ascendys_user;
\q
```

### 6. Lancer les migrations
```bash
python manage.py migrate
```

### 7. Créer un superutilisateur
```bash
python manage.py createsuperuser
```

### 8. Collecter les fichiers statiques
```bash
python manage.py collectstatic --noinput
```

## 🌐 Configuration Nginx

```nginx
server {
    listen 80;
    server_name api.ascendysconnect.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ascendysconnect.com;

    ssl_certificate /etc/letsencrypt/live/api.ascendysconnect.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ascendysconnect.com/privkey.pem;

    client_max_body_size 50M;

    location /static/ {
        alias /var/www/ascendys-backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/ascendys-backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 Configuration Gunicorn

Créer `/etc/systemd/system/gunicorn.service`:

```ini
[Unit]
Description=Gunicorn daemon for Ascendys Connect
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/ascendys-backend
Environment="PATH=/var/www/ascendys-backend/venv/bin"
ExecStart=/var/www/ascendys-backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile /var/log/gunicorn/access.log \
    --error-logfile /var/log/gunicorn/error.log \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

Activer et démarrer:
```bash
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl status gunicorn
```

## 🔴 Configuration Redis (Cache & Rate Limiting)

### Installer Redis
```bash
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis
```

### Configurer Django pour Redis
Dans `config/settings/production.py`:
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

## 📊 Monitoring & Logs

### Logs Django
```bash
tail -f logs/django.log
```

### Logs Gunicorn
```bash
tail -f /var/log/gunicorn/error.log
```

### Logs Nginx
```bash
tail -f /var/log/nginx/error.log
```

## 🔐 Sécurité

### Certificat SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.ascendysconnect.com
```

### Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Permissions des fichiers
```bash
sudo chown -R www-data:www-data /var/www/ascendys-backend
sudo chmod -R 755 /var/www/ascendys-backend
```

## 📦 Backup & Restauration

### Backup de la base de données
```bash
pg_dump -U ascendys_user ascendys_connect_prod > backup_$(date +%Y%m%d).sql
```

### Backup des médias
```bash
tar -czf media_backup_$(date +%Y%m%d).tar.gz media/
```

### Restauration
```bash
psql -U ascendys_user ascendys_connect_prod < backup_20240101.sql
tar -xzf media_backup_20240101.tar.gz
```

## 🔄 Mises à jour

```bash
# 1. Pull les changements
git pull origin main

# 2. Activer l'environnement
source venv/bin/activate

# 3. Installer les dépendances
pip install -r requirements/production.txt

# 4. Migrations
python manage.py migrate

# 5. Collecter les statiques
python manage.py collectstatic --noinput

# 6. Redémarrer Gunicorn
sudo systemctl restart gunicorn
```

## ⚙️ Variables d'environnement complètes

```env
# Django Core
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS
CORS_ALLOWED_ORIGINS=

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Maintenance
MAINTENANCE_MODE=False
MAINTENANCE_MODE_ALLOWED_IPS=
```

## 🐳 Docker (Optionnel)

### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements/production.txt .
RUN pip install --no-cache-dir -r production.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ascendys_connect_prod
      POSTGRES_USER: ascendys_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  web:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    env_file:
      - .env

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

## 📞 Support

En cas de problème:
- Documentation: https://docs.ascendysconnect.com
- Email: devops@ascendysconnect.com
- GitHub Issues: https://github.com/ascendys-connect/backend/issues
