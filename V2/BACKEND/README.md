# ASCENDYS CONNECT - BACKEND API

API REST Django pour la plateforme institutionnelle Ascendys Connect.

## 🚀 Installation

### Prérequis

- Python 3.11+
- PostgreSQL 14+
- pip

### Étapes d'installation

1. **Créer et activer l'environnement virtuel**

```powershell
python -m venv venv
.\venv\Scripts\activate
```

2. **Installer les dépendances**

```powershell
pip install -r requirements\development.txt
```

3. **Configurer les variables d'environnement**

```powershell
copy .env.example .env
# Éditer .env avec vos configurations
```

4. **Créer la base de données PostgreSQL**

```powershell
# Via psql ou pgAdmin
createdb ascendys_connect_db
```

5. **Effectuer les migrations**

```powershell
python manage.py makemigrations
python manage.py migrate
```

6. **Créer un superutilisateur**

```powershell
python manage.py createsuperuser
```

7. **Lancer le serveur de développement**

```powershell
python manage.py runserver
```

L'API est maintenant accessible sur : http://localhost:8000

## 📚 Documentation API

- **Swagger UI** : http://localhost:8000/api/docs/
- **ReDoc** : http://localhost:8000/api/redoc/
- **Schema OpenAPI** : http://localhost:8000/api/schema/
- **Admin Django** : http://localhost:8000/admin/

## 🏗️ Architecture

```
backend/
├── config/                 # Configuration du projet
│   ├── settings/
│   │   ├── base.py        # Settings communs
│   │   ├── development.py # Settings dev
│   │   └── production.py  # Settings prod
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/          # ✅ Authentification & utilisateurs
│   ├── company/           # ✅ Informations entreprise
│   ├── core/              # ✅ Utilitaires, permissions, mixins
│   ├── services/          # 🔄 À venir
│   ├── trainings/         # 🔄 À venir
│   ├── offers/            # 🔄 À venir
│   ├── blog/              # 🔄 À venir
│   ├── events/            # 🔄 À venir
│   ├── testimonials/      # 🔄 À venir
│   ├── partners/          # 🔄 À venir
│   ├── contact/           # 🔄 À venir
│   ├── newsletter/        # 🔄 À venir
│   ├── media/             # 🔄 À venir
│   └── dashboard/         # 🔄 À venir
├── media/                 # Fichiers uploadés
├── static/                # Fichiers statiques
└── requirements/          # Dépendances
```

## 📡 Endpoints disponibles

### Authentification (`/api/v1/auth/`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| POST | `/auth/login/` | Connexion (JWT) | Public |
| POST | `/auth/refresh/` | Refresh token | Public |
| POST | `/auth/logout/` | Déconnexion | Authentifié |
| GET | `/auth/me/` | Profil utilisateur | Authentifié |
| PATCH | `/auth/me/update/` | Modifier profil | Authentifié |
| POST | `/auth/me/change-password/` | Changer mot de passe | Authentifié |
| GET | `/auth/users/` | Liste utilisateurs | Admin |
| POST | `/auth/users/create/` | Créer utilisateur | Admin |

### Entreprise (`/api/v1/company/`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| GET | `/company/` | Info entreprise | Public |
| GET | `/company/about/` | Page À propos | Public |
| PUT/PATCH | `/company/update/` | Modifier entreprise | Admin |

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Obtenir un token

```bash
POST /api/v1/auth/login/
{
  "email": "admin@example.com",
  "password": "votre_mot_de_passe"
}
```

Réponse :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "first_name": "Admin",
      "last_name": "User",
      "role": "ADMIN"
    }
  }
}
```

### Utiliser le token

Inclure le token dans les headers :

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

## 👥 Rôles utilisateurs

- **SUPER_ADMIN** : Accès complet (gestion utilisateurs, configuration système)
- **ADMIN** : Gestion du contenu (formations, blog, offres, etc.)

## 🗄️ Modèles de données

### User (accounts)
- Authentification basée sur email
- Rôles : SUPER_ADMIN, ADMIN
- Avatar, profil complet

### Company (company)
- Singleton (une seule instance)
- Informations complètes de l'entreprise
- Contact, réseaux sociaux, valeurs

### Core (utilitaires)
- **TimeStampedModel** : created_at, updated_at
- **UUIDModel** : ID en UUID
- **SEOModel** : Champs SEO (title, description, keywords, og_image)
- **PublishableModel** : Workflow publication (DRAFT, PUBLISHED, ARCHIVED)

## 🧪 Tests

```powershell
# Lancer tous les tests
python manage.py test

# Tests d'une app spécifique
python manage.py test apps.accounts

# Avec coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

## 📝 Commandes utiles

```powershell
# Créer une migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Collecter les fichiers statiques
python manage.py collectstatic

# Shell Django
python manage.py shell

# Créer une nouvelle app
python manage.py startapp nom_app
# Puis déplacer dans apps/
```

## 🔧 Configuration

### Variables d'environnement (.env)

Voir `.env.example` pour la liste complète des variables.

Principales variables :
- `SECRET_KEY` : Clé secrète Django
- `DEBUG` : Mode debug (True/False)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` : Configuration PostgreSQL
- `CORS_ALLOWED_ORIGINS` : Origins CORS autorisées

### Settings par environnement

- **Development** : `config.settings.development`
- **Production** : `config.settings.production`

Changer d'environnement :
```powershell
$env:DJANGO_SETTINGS_MODULE = "config.settings.production"
```

## 📦 Dépendances principales

- **Django 5.0** : Framework web
- **Django REST Framework 3.14** : API REST
- **djangorestframework-simplejwt 5.3** : Authentification JWT
- **PostgreSQL** : Base de données
- **drf-spectacular** : Documentation OpenAPI/Swagger
- **django-cors-headers** : Gestion CORS
- **django-filter** : Filtrage avancé
- **Pillow** : Gestion images

## 🚀 Déploiement

### Production

1. Définir les variables d'environnement en production
2. Définir `DEBUG=False`
3. Configurer `ALLOWED_HOSTS`
4. Utiliser un serveur WSGI (Gunicorn)
5. Servir les fichiers statiques avec Nginx
6. Utiliser HTTPS
7. Configurer PostgreSQL en production

### Exemple avec Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## 📊 Statut du développement

### ✅ Complété (Étapes 1, 2, 3)

- [x] Configuration initiale du projet
- [x] Structure modulaire (config + apps)
- [x] PostgreSQL configuration
- [x] JWT Authentication
- [x] App accounts (utilisateurs, rôles)
- [x] App company (informations entreprise)
- [x] App core (utilitaires, permissions)
- [x] Admin Django configuré
- [x] Documentation API (Swagger)
- [x] CORS configuration
- [x] Format réponses uniformisé

### 🔄 À venir (Étapes 4-15)

- [ ] App services
- [ ] App trainings (formations + catégories)
- [ ] App offers
- [ ] App blog (posts + catégories + tags)
- [ ] App events
- [ ] App testimonials
- [ ] App partners
- [ ] App contact
- [ ] App newsletter
- [ ] App media
- [ ] App dashboard
- [ ] Recherche globale
- [ ] Tests complets
- [ ] Optimisations

## 🤝 Contribution

Ce projet est développé pour Ascendys Connect.

## 📄 Licence

Propriétaire - Ascendys Connect © 2026
