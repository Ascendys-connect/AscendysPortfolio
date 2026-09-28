# ASCENDYS CONNECT - PLATEFORME INSTITUTIONNELLE

## 📋 PRÉSENTATION DU PROJET

Plateforme institutionnelle moderne pour **Ascendys Connect**, entreprise spécialisée dans les solutions digitales, technologies de l'information et formations IT.

### Architecture globale

```
SITE OFFICIEL
     │
     ├─────────────┬─────────────┐
     │             │             │
SITE PUBLIC    ADMIN/CMS    API REST
     │             │             │
     └─────────────┴─────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   PostgreSQL   Médias    JWT Auth
```

### Stack technologique

**Backend**
- Python 3.11+
- Django 5.x
- Django REST Framework
- PostgreSQL
- JWT Authentication (djangorestframework-simplejwt)
- Swagger/OpenAPI (drf-spectacular)
- django-filter
- django-cors-headers
- Pillow (gestion images)

**Frontend**
- React.js 18+
- React Router v6
- Axios
- Context API / Redux (à définir)
- TailwindCSS / Material-UI (à définir)
- Recharts (graphiques dashboard)

---

## 🏗️ ARCHITECTURE DU BACKEND

### Structure du projet

```
backend/
│
├── config/
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── apps/
│   ├── accounts/           # Authentification, utilisateurs, rôles
│   ├── company/            # Informations entreprise
│   ├── services/           # Services offerts
│   ├── trainings/          # Formations & catégories
│   ├── offers/             # Offres & annonces
│   ├── blog/               # Blog, catégories, tags
│   ├── events/             # Événements
│   ├── testimonials/       # Témoignages clients
│   ├── partners/           # Partenaires & clients
│   ├── contact/            # Messages de contact
│   ├── newsletter/         # Newsletter & abonnés
│   ├── media/              # Gestion centralisée des médias
│   ├── dashboard/          # Dashboard admin & statistiques
│   └── core/               # Utilities, mixins, base classes
│
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
│
├── media/                  # Fichiers uploadés
├── static/                 # Fichiers statiques
├── tests/                  # Tests globaux
├── manage.py
├── .env.example
├── .gitignore
└── README.md
```

### Structure type d'une application

```
apps/example/
│
├── migrations/
├── tests/
│   ├── test_models.py
│   ├── test_serializers.py
│   └── test_views.py
├── __init__.py
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── permissions.py
├── filters.py
├── admin.py
└── services.py (si logique métier complexe)
```

---

## 📊 MODÈLES DE DONNÉES

### 1. Accounts (Authentification)

**User** (custom)
- id (UUID)
- email (unique)
- first_name
- last_name
- role (SUPER_ADMIN, ADMIN)
- avatar
- is_active
- is_staff
- date_joined
- last_login

### 2. Company (Entreprise)

**Company** (Singleton)
- id
- name
- slogan
- short_description
- full_description
- logo
- favicon
- email
- phone
- address
- city
- country
- postal_code
- website
- founded_year
- mission
- vision
- values (JSONField)
- social_links (JSONField: facebook, linkedin, twitter, instagram, youtube)
- business_hours (JSONField)
- created_at
- updated_at

### 3. Services

**Service**
- id (UUID)
- title
- slug (unique)
- short_description
- description (rich text)
- icon
- image
- features (JSONField)
- order (IntegerField)
- is_featured
- is_active
- seo_title
- seo_description
- seo_keywords
- og_image
- created_at
- updated_at

### 4. Trainings

**TrainingCategory**
- id
- name
- slug (unique)
- description
- image
- is_active
- order
- created_at
- updated_at

**Training**
- id (UUID)
- title
- slug (unique)
- short_description
- description (rich text)
- category (FK → TrainingCategory)
- image
- banner
- objectives (JSONField)
- prerequisites (JSONField)
- target_audience
- syllabus (JSONField)
- duration (ex: "5 jours", "40 heures")
- level (BEGINNER, INTERMEDIATE, ADVANCED)
- price (Decimal)
- currency (default: XOF)
- start_date
- end_date
- location
- training_mode (ONLINE, ONSITE, HYBRID)
- instructor (FK → User, null=True)
- capacity (IntegerField)
- certification (BooleanField)
- status (DRAFT, PUBLISHED, ARCHIVED)
- is_featured
- views_count
- seo_title
- seo_description
- seo_keywords
- og_image
- published_at
- created_at
- updated_at
- created_by (FK → User)

### 5. Offers (Offres & Annonces)

**Offer**
- id (UUID)
- title
- slug (unique)
- short_description
- description (rich text)
- image
- banner
- type (TRAINING, PROMOTION, EVENT, RECRUITMENT, ANNOUNCEMENT, OTHER)
- start_date
- end_date
- status (DRAFT, PUBLISHED, ARCHIVED)
- is_featured
- seo_title
- seo_description
- og_image
- published_at
- created_at
- updated_at
- created_by (FK → User)

### 6. Blog

**BlogCategory**
- id
- name
- slug (unique)
- description
- is_active
- created_at
- updated_at

**Tag**
- id
- name
- slug (unique)

**BlogPost**
- id (UUID)
- title
- slug (unique)
- excerpt
- content (rich text)
- cover_image
- author (FK → User)
- category (FK → BlogCategory)
- tags (M2M → Tag)
- status (DRAFT, PUBLISHED, ARCHIVED)
- is_featured
- views_count
- reading_time (IntegerField, calculé)
- seo_title
- seo_description
- seo_keywords
- og_image
- published_at
- created_at
- updated_at

### 7. Events

**Event**
- id (UUID)
- title
- slug (unique)
- description (rich text)
- image
- location
- event_type (CONFERENCE, WORKSHOP, WEBINAR, TRAINING, SALON, OTHER)
- start_datetime
- end_datetime
- registration_url
- capacity
- status (UPCOMING, ONGOING, COMPLETED, CANCELLED)
- is_featured
- seo_title
- seo_description
- og_image
- created_at
- updated_at
- created_by (FK → User)

### 8. Testimonials

**Testimonial**
- id
- name
- role
- company
- avatar
- content (text)
- rating (1-5)
- is_featured
- is_published
- order
- created_at
- updated_at

### 9. Partners

**Partner**
- id
- name
- logo
- website
- description
- category (CLIENT, PARTNER, SPONSOR, OTHER)
- is_featured
- is_active
- order
- created_at
- updated_at

### 10. Contact

**ContactMessage**
- id (UUID)
- first_name
- last_name
- email
- phone
- subject
- message (text)
- status (NEW, READ, PROCESSING, RESOLVED, ARCHIVED)
- ip_address
- user_agent
- created_at
- updated_at
- handled_by (FK → User, null=True)

### 11. Newsletter

**NewsletterSubscriber**
- id (UUID)
- email (unique)
- is_active
- subscribed_at
- unsubscribed_at
- ip_address

**NewsletterCampaign**
- id (UUID)
- subject
- content (rich text)
- recipients (M2M → NewsletterSubscriber ou "all")
- status (DRAFT, SENT)
- sent_at
- created_by (FK → User)
- created_at
- updated_at

### 12. Media

**Media**
- id (UUID)
- file
- file_type (IMAGE, DOCUMENT, VIDEO, OTHER)
- alt_text
- title
- size (bytes)
- mime_type
- uploaded_by (FK → User)
- created_at
- updated_at

### 13. Dashboard

**ActivityLog**
- id (UUID)
- user (FK → User)
- action (CREATE, UPDATE, DELETE, PUBLISH, ARCHIVE)
- object_type (training, blog, offer, etc.)
- object_id (UUID)
- object_name
- description
- ip_address
- created_at

---

## 🔗 DIAGRAMME DES RELATIONS

```
User (accounts)
  │
  ├─── 1:N → Training (created_by)
  ├─── 1:N → Training (instructor)
  ├─── 1:N → BlogPost (author)
  ├─── 1:N → Offer (created_by)
  ├─── 1:N → Event (created_by)
  ├─── 1:N → Media (uploaded_by)
  ├─── 1:N → ActivityLog (user)
  ├─── 1:N → ContactMessage (handled_by)
  └─── 1:N → NewsletterCampaign (created_by)

TrainingCategory
  │
  └─── 1:N → Training

BlogCategory
  │
  └─── 1:N → BlogPost

Tag
  │
  └─── N:M → BlogPost

NewsletterSubscriber
  │
  └─── N:M → NewsletterCampaign (recipients)
```

---

## 🛣️ ENDPOINTS API (v1)

### Base URL : `/api/v1/`

### 🔐 Authentification

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| POST | `/auth/register/` | ✅ | Inscription (désactivée ou admin only) |
| POST | `/auth/login/` | ✅ | Connexion (JWT) |
| POST | `/auth/refresh/` | ✅ | Refresh token |
| POST | `/auth/logout/` | 🔒 | Déconnexion |
| GET | `/auth/me/` | 🔒 | Profil utilisateur |
| PATCH | `/auth/me/` | 🔒 | Modifier profil |

### 🏢 Company

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/company/` | ✅ | Info entreprise |
| GET | `/company/about/` | ✅ | Page à propos |
| PUT | `/company/` | 🔒 Admin | Modifier infos |
| PATCH | `/company/` | 🔒 Admin | Modifier partiellement |

### 🛠️ Services

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/services/` | ✅ | Liste services |
| GET | `/services/featured/` | ✅ | Services à la une |
| GET | `/services/{slug}/` | ✅ | Détail service |
| POST | `/services/` | 🔒 Admin | Créer service |
| PUT | `/services/{id}/` | 🔒 Admin | Modifier service |
| PATCH | `/services/{id}/` | 🔒 Admin | Modifier partiellement |
| DELETE | `/services/{id}/` | 🔒 Admin | Supprimer service |

### 🎓 Training Categories

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/training-categories/` | ✅ | Liste catégories |
| GET | `/training-categories/{slug}/` | ✅ | Détail catégorie |
| POST | `/training-categories/` | 🔒 Admin | Créer catégorie |
| PATCH | `/training-categories/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/training-categories/{id}/` | 🔒 Admin | Supprimer |

### 📚 Trainings

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/trainings/` | ✅ | Liste formations (publiées) |
| GET | `/trainings/featured/` | ✅ | Formations à la une |
| GET | `/trainings/{slug}/` | ✅ | Détail formation |
| POST | `/trainings/` | 🔒 Admin | Créer formation |
| PUT | `/trainings/{id}/` | 🔒 Admin | Modifier formation |
| PATCH | `/trainings/{id}/` | 🔒 Admin | Modifier partiellement |
| DELETE | `/trainings/{id}/` | 🔒 Admin | Supprimer formation |
| POST | `/trainings/{id}/publish/` | 🔒 Admin | Publier formation |
| POST | `/trainings/{id}/archive/` | 🔒 Admin | Archiver formation |

**Filtres** : `?category=slug&level=beginner&mode=online&search=python`

### 📢 Offers

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/offers/` | ✅ | Liste offres (publiées) |
| GET | `/offers/featured/` | ✅ | Offres à la une |
| GET | `/offers/{slug}/` | ✅ | Détail offre |
| POST | `/offers/` | 🔒 Admin | Créer offre |
| PATCH | `/offers/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/offers/{id}/` | 🔒 Admin | Supprimer |
| POST | `/offers/{id}/publish/` | 🔒 Admin | Publier |
| POST | `/offers/{id}/archive/` | 🔒 Admin | Archiver |

**Filtres** : `?type=promotion&status=published`

### 📝 Blog

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/blog/` | ✅ | Liste articles (publiés) |
| GET | `/blog/featured/` | ✅ | Articles à la une |
| GET | `/blog/{slug}/` | ✅ | Détail article |
| GET | `/blog/categories/` | ✅ | Liste catégories |
| GET | `/blog/tags/` | ✅ | Liste tags |
| POST | `/blog/` | 🔒 Admin | Créer article |
| PATCH | `/blog/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/blog/{id}/` | 🔒 Admin | Supprimer |
| POST | `/blog/{id}/publish/` | 🔒 Admin | Publier |
| POST | `/blog/{id}/archive/` | 🔒 Admin | Archiver |

**Filtres** : `?category=slug&tags=tag1,tag2&search=keyword`

### 📅 Events

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/events/` | ✅ | Liste événements |
| GET | `/events/{slug}/` | ✅ | Détail événement |
| POST | `/events/` | 🔒 Admin | Créer événement |
| PATCH | `/events/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/events/{id}/` | 🔒 Admin | Supprimer |

**Filtres** : `?status=upcoming&type=webinar&date_from=2026-01-01`

### 💬 Testimonials

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/testimonials/` | ✅ | Liste témoignages (publiés) |
| POST | `/testimonials/` | 🔒 Admin | Créer témoignage |
| PATCH | `/testimonials/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/testimonials/{id}/` | 🔒 Admin | Supprimer |

### 🤝 Partners

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/partners/` | ✅ | Liste partenaires (actifs) |
| POST | `/partners/` | 🔒 Admin | Créer partenaire |
| PATCH | `/partners/{id}/` | 🔒 Admin | Modifier |
| DELETE | `/partners/{id}/` | 🔒 Admin | Supprimer |

### 📧 Contact

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| POST | `/contact/` | ✅ | Envoyer message (rate limited) |
| GET | `/contact/` | 🔒 Admin | Liste messages |
| GET | `/contact/{id}/` | 🔒 Admin | Détail message |
| PATCH | `/contact/{id}/` | 🔒 Admin | Changer statut |

### 📬 Newsletter

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| POST | `/newsletter/subscribe/` | ✅ | S'abonner (rate limited) |
| POST | `/newsletter/unsubscribe/` | ✅ | Se désabonner |
| GET | `/newsletter/subscribers/` | 🔒 Admin | Liste abonnés |
| POST | `/newsletter/campaigns/` | 🔒 Admin | Créer campagne |
| POST | `/newsletter/campaigns/{id}/send/` | 🔒 Admin | Envoyer campagne |

### 🖼️ Media

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/media/` | 🔒 Admin | Liste médias |
| POST | `/media/` | 🔒 Admin | Upload fichier |
| DELETE | `/media/{id}/` | 🔒 Admin | Supprimer média |

### 📊 Dashboard

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/dashboard/` | 🔒 Admin | Statistiques globales |
| GET | `/dashboard/activity/` | 🔒 Admin | Activité récente |

**Retourne** :
```json
{
  "trainings_count": 12,
  "trainings_published": 10,
  "trainings_upcoming": 5,
  "blog_posts_count": 24,
  "offers_active": 5,
  "events_upcoming": 3,
  "messages_unread": 7,
  "newsletter_subscribers": 156,
  "recent_activity": [...]
}
```

### 🔍 Search

| Méthode | Endpoint | Public | Description |
|---------|----------|--------|-------------|
| GET | `/search/?q=keyword` | ✅ | Recherche globale |

**Retourne** : Résultats structurés par type (trainings, blog, services, offers, events)

---

## 🔐 MATRICE DES PERMISSIONS

| Ressource | Public (GET) | Admin (GET) | Admin (POST/PUT/PATCH/DELETE) |
|-----------|--------------|-------------|-------------------------------|
| Company | ✅ | ✅ | ✅ |
| Services | ✅ (publiés) | ✅ (tous) | ✅ |
| Trainings | ✅ (publiés) | ✅ (tous) | ✅ |
| Training Categories | ✅ | ✅ | ✅ |
| Offers | ✅ (publiés) | ✅ (tous) | ✅ |
| Blog | ✅ (publiés) | ✅ (tous) | ✅ |
| Events | ✅ | ✅ | ✅ |
| Testimonials | ✅ (publiés) | ✅ (tous) | ✅ |
| Partners | ✅ (actifs) | ✅ (tous) | ✅ |
| Contact | ❌ (POST only) | ✅ | ✅ (PATCH only) |
| Newsletter | ❌ (POST only) | ✅ | ✅ |
| Media | ❌ | ✅ | ✅ |
| Dashboard | ❌ | ✅ | ❌ |

---

## 🎯 PLAN D'EXÉCUTION - BACKEND (15 ÉTAPES)

### ✅ ÉTAPE 1 : Configuration initiale
**Durée estimée** : 2-3h

**Tâches** :
- Créer projet Django avec structure modulaire
- Configurer PostgreSQL
- Settings (base, dev, prod)
- Requirements (base, dev, prod)
- .env.example
- .gitignore
- Configuration CORS
- Configuration timezone/langue

**Livrables** :
- Projet démarrable
- Base de données créée
- Structure dossiers complète

---

### ✅ ÉTAPE 2 : Authentification & Users
**Durée estimée** : 4-5h

**Tâches** :
- Créer app `accounts`
- Modèle User personnalisé avec rôles
- JWT configuration (djangorestframework-simplejwt)
- Serializers (UserSerializer, LoginSerializer, RegisterSerializer)
- ViewSets auth (login, refresh, logout, me)
- Permissions personnalisées (IsAdmin, IsSuperAdmin)
- Tests authentification

**Livrables** :
- Endpoints `/api/v1/auth/*`
- Authentification JWT fonctionnelle
- Gestion des rôles

---

### ✅ ÉTAPE 3 : Module Company
**Durée estimée** : 3-4h

**Tâches** :
- Créer app `company`
- Modèle Company (singleton pattern)
- Serializers (CompanySerializer)
- ViewSet (GET public, PUT/PATCH admin)
- Permissions
- Tests

**Livrables** :
- Endpoints `/api/v1/company/`
- Admin Django configuré

---

### ✅ ÉTAPE 4 : Module Services
**Durée estimée** : 4-5h

**Tâches** :
- Créer app `services`
- Modèle Service
- Serializers (lecture/écriture séparés)
- ViewSet avec filtres
- Filtres (is_active, is_featured, search)
- Permissions (public GET, admin write)
- Tests CRUD

**Livrables** :
- Endpoints `/api/v1/services/*`
- Filtrage fonctionnel
- Featured services

---

### ✅ ÉTAPE 5 : Module Trainings
**Durée estimée** : 6-8h

**Tâches** :
- Créer app `trainings`
- Modèle TrainingCategory
- Modèle Training (complet)
- Serializers imbriqués (avec category details)
- ViewSets avec filtres avancés
- Actions publish/archive
- Filtres (category, level, mode, status, search)
- Pagination
- Tests complets

**Livrables** :
- Endpoints `/api/v1/trainings/*`
- Endpoints `/api/v1/training-categories/*`
- Workflow publication fonctionnel

---

### ✅ ÉTAPE 6 : Module Offers
**Durée estimée** : 4-5h

**Tâches** :
- Créer app `offers`
- Modèle Offer
- Serializers
- ViewSet avec actions publish/archive
- Filtres (type, status, dates)
- Tests

**Livrables** :
- Endpoints `/api/v1/offers/*`
- Featured offers
- Workflow publication

---

### ✅ ÉTAPE 7 : Module Blog
**Durée estimée** : 6-7h

**Tâches** :
- Créer app `blog`
- Modèles (BlogPost, BlogCategory, Tag)
- Relations M2M (tags)
- Serializers imbriqués
- ViewSets séparés (posts, categories, tags)
- Actions publish/archive
- Calcul reading_time
- Filtres (category, tags, author, search)
- Tests

**Livrables** :
- Endpoints `/api/v1/blog/*`
- Gestion catégories/tags
- Articles avec auteur

---

### ✅ ÉTAPE 8 : Module Events
**Durée estimée** : 3-4h

**Tâches** :
- Créer app `events`
- Modèle Event
- Serializers
- ViewSet
- Filtres (status, type, dates)
- Tests

**Livrables** :
- Endpoints `/api/v1/events/*`
- Filtrage par date

---

### ✅ ÉTAPE 9 : Modules Testimonials & Partners
**Durée estimée** : 4-5h

**Tâches** :
- Créer app `testimonials`
- Modèle Testimonial
- Créer app `partners`
- Modèle Partner
- Serializers respectifs
- ViewSets avec filtres
- Ordering (order field)
- Tests

**Livrables** :
- Endpoints `/api/v1/testimonials/*`
- Endpoints `/api/v1/partners/*`
- Featured/published logic

---

### ✅ ÉTAPE 10 : Modules Contact & Newsletter
**Durée estimée** : 5-6h

**Tâches** :
- Créer app `contact`
- Modèle ContactMessage
- Rate limiting (django-ratelimit)
- Validation anti-spam
- Changement statuts
- Créer app `newsletter`
- Modèle NewsletterSubscriber
- Modèle NewsletterCampaign
- Logic subscribe/unsubscribe
- Email sending (Django mail + template)
- Tests

**Livrables** :
- Endpoints `/api/v1/contact/*`
- Endpoints `/api/v1/newsletter/*`
- Rate limiting fonctionnel
- Envoi emails newsletter

---

### ✅ ÉTAPE 11 : Module Media
**Durée estimée** : 4-5h

**Tâches** :
- Créer app `media`
- Modèle Media
- Upload sécurisé (validation types, taille)
- Optimisation images (Pillow)
- Organisation storage (par type/date)
- Serializers
- ViewSet
- Tests upload

**Livrables** :
- Endpoints `/api/v1/media/*`
- Upload sécurisé
- Validation fichiers

---

### ✅ ÉTAPE 12 : Dashboard & Activity Logs
**Durée estimée** : 5-6h

**Tâches** :
- Créer app `dashboard`
- Modèle ActivityLog
- Signals pour auto-logging (post_save, post_delete)
- Endpoint statistiques agrégées
- Endpoint activité récente
- Serializers dashboard
- Tests

**Livrables** :
- Endpoint `/api/v1/dashboard/`
- Statistiques en temps réel
- Logs automatiques

---

### ✅ ÉTAPE 13 : Recherche globale & SEO
**Durée estimée** : 4-5h

**Tâches** :
- Endpoint search global
- Q objects multiples modèles
- Ajouter champs SEO à tous les modèles principaux
- Sitemap dynamique (django.contrib.sitemaps)
- robots.txt
- Tests recherche

**Livrables** :
- Endpoint `/api/v1/search/`
- Sitemap `/sitemap.xml`
- robots.txt `/robots.txt`
- Champs SEO partout

---

### ✅ ÉTAPE 14 : Permissions, filtres, pagination
**Durée estimée** : 3-4h

**Tâches** :
- Affiner toutes les permissions
- django-filter sur tous les ViewSets
- Pagination uniformisée (PageNumberPagination)
- CORS final configuration
- Rate limiting global
- Tests permissions

**Livrables** :
- Permissions cohérentes
- Filtres partout
- Pagination uniforme

---

### ✅ ÉTAPE 15 : Documentation, tests, sécurité
**Durée estimée** : 5-6h

**Tâches** :
- Installer drf-spectacular
- Configurer Swagger UI
- Documenter tous les endpoints
- Format réponses uniformisé (success, message, data)
- Gestion erreurs centralisée
- Security headers
- Tests API complets
- Documentation README backend

**Livrables** :
- `/api/docs/` (Swagger UI)
- `/api/schema/` (OpenAPI schema)
- Tests coverage >80%
- Backend production-ready

---

## 🎨 PLAN D'EXÉCUTION - FRONTEND (15 ÉTAPES)

### ✅ ÉTAPE 16 : Configuration initiale React
**Durée estimée** : 2-3h

**Tâches** :
- Create React App ou Vite
- Structure dossiers (components, pages, services, contexts, hooks, utils)
- React Router v6
- Axios configuration (interceptors, base URL)
- .env.local
- TailwindCSS / Material-UI installation

**Livrables** :
- Application démarrable
- Structure complète
- Routing de base

---

### ✅ ÉTAPE 17 : Authentification frontend
**Durée estimée** : 4-5h

**Tâches** :
- AuthContext (Context API)
- Login/Logout pages
- Protected routes (PrivateRoute component)
- Token storage (localStorage/sessionStorage)
- Axios interceptors (auto refresh token)
- Redirect logic

**Livrables** :
- Pages login/logout
- Routes protégées
- Auto refresh JWT

---

### ✅ ÉTAPE 18 : Layout & Navigation
**Durée estimée** : 5-6h

**Tâches** :
- Header/Navbar (responsive)
- Footer
- Sidebar admin (collapsible)
- Navigation menu (public/admin)
- Logo, liens sociaux
- Mobile menu

**Livrables** :
- Layout complet
- Navigation responsive
- Design cohérent

---

### ✅ ÉTAPE 19 : Page d'accueil dynamique
**Durée estimée** : 6-8h

**Tâches** :
- Hero section (vidéo/image)
- Services featured (cartes)
- Trainings featured (cartes)
- Stats section (compteurs animés)
- Testimonials carousel
- Partners logos
- Blog recent posts
- CTA section
- Fetch data from API

**Livrables** :
- Homepage complète
- Animations
- Responsive

---

### ✅ ÉTAPE 20 : Pages Services & À propos
**Durée estimée** : 4-5h

**Tâches** :
- Page liste services (grid)
- Page détail service
- Page À propos (company info)
- Fetch from `/api/v1/services/` et `/api/v1/company/`

**Livrables** :
- Pages services
- Page about
- Responsive

---

### ✅ ÉTAPE 21 : Catalogue Formations
**Durée estimée** : 6-7h

**Tâches** :
- Page liste formations
- Filtres sidebar (catégorie, niveau, mode)
- Barre recherche
- Cartes formations
- Pagination
- Loading states
- Empty states

**Livrables** :
- Catalogue formations
- Filtres fonctionnels
- Pagination

---

### ✅ ÉTAPE 22 : Détail Formation
**Durée estimée** : 5-6h

**Tâches** :
- Page détail formation complète
- Tabs (description, objectifs, programme, prérequis)
- Sidebar (prix, dates, formateur, capacité)
- Bouton inscription (préparation)
- Breadcrumb
- SEO meta tags

**Livrables** :
- Page détail riche
- UX soignée
- SEO

---

### ✅ ÉTAPE 23 : Blog & Actualités
**Durée estimée** : 5-6h

**Tâches** :
- Page liste articles (grid)
- Filtres (catégories, tags)
- Barre recherche
- Page détail article
- Sidebar (articles récents, catégories, tags)
- Reading time
- Social share buttons

**Livrables** :
- Blog complet
- Filtres
- Page article

---

### ✅ ÉTAPE 24 : Offres & Événements
**Durée estimée** : 4-5h

**Tâches** :
- Page liste offres
- Filtres (type)
- Page détail offre
- Page liste événements
- Filtres (status, type, date)
- Page détail événement
- Calendrier (optionnel)

**Livrables** :
- Pages offres
- Pages événements
- Filtres

---

### ✅ ÉTAPE 25 : Contact & Newsletter
**Durée estimée** : 4-5h

**Tâches** :
- Page contact
- Formulaire (validation Formik/React Hook Form)
- Toast notifications
- Google Maps embed (optionnel)
- Footer newsletter form
- Success/error messages

**Livrables** :
- Formulaire contact
- Newsletter form
- Validation frontend

---

### ✅ ÉTAPE 26 : Dashboard Admin
**Durée estimée** : 6-8h

**Tâches** :
- Layout admin (sidebar + topbar)
- Dashboard page
- Cards statistiques
- Graphiques (Recharts: line, bar, pie)
- Activité récente (timeline)
- Liens rapides
- Fetch `/api/v1/dashboard/`

**Livrables** :
- Dashboard admin impressionnant
- Graphiques visuels
- Responsive

---

### ✅ ÉTAPE 27 : Gestion Formations (Admin)
**Durée estimée** : 8-10h

**Tâches** :
- Page liste formations admin (table avec actions)
- Formulaire création/édition (multi-step ou long form)
- Upload images (drag & drop)
- Rich text editor (TinyMCE/Quill)
- Gestion objectives/prerequisites/syllabus (dynamic fields)
- Boutons publish/archive
- Status badges
- Modal confirmation delete

**Livrables** :
- CRUD formations complet
- Formulaire riche
- Upload images

---

### ✅ ÉTAPE 28 : Gestion Blog, Services, Offres (Admin)
**Durée estimée** : 8-10h

**Tâches** :
- CRUD Blog posts (liste, form, delete)
- Gestion catégories/tags blog
- CRUD Services
- CRUD Offres
- Rich text editors
- Upload images
- Publish/archive actions
- Status management

**Livrables** :
- CRUD blog complet
- CRUD services
- CRUD offres

---

### ✅ ÉTAPE 29 : Gestion Messages, Newsletter, Partenaires (Admin)
**Durée estimée** : 6-8h

**Tâches** :
- Page liste messages contact (table, filtres statut)
- Modal détail message
- Changement statut
- Page liste abonnés newsletter
- Formulaire composer email newsletter (destinataires sélectionnables)
- Envoi email
- CRUD Partenaires
- CRUD Témoignages
- Upload logos/avatars

**Livrables** :
- Gestion messages
- Envoi newsletter
- CRUD partenaires/témoignages

---

### ✅ ÉTAPE 30 : Optimisation, SEO, déploiement
**Durée estimée** : 5-6h

**Tâches** :
- React Helmet (meta tags dynamiques par page)
- OpenGraph tags
- Sitemap frontend (react-router-sitemap)
- Lazy loading components
- Code splitting
- Image optimization
- Performance audit (Lighthouse)
- Build production
- README frontend
- Documentation déploiement (Vercel/Netlify)

**Livrables** :
- SEO optimisé
- Performance >90 Lighthouse
- Build prod ready
- Documentation complète

---

## 📦 DÉPENDANCES

### Backend (requirements/base.txt)

```txt
Django==5.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.3.1
django-filter==23.5
drf-spectacular==0.27.0
psycopg2-binary==2.9.9
Pillow==10.2.0
python-decouple==3.8
django-ratelimit==4.1.0
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "axios": "^1.6.5",
    "recharts": "^2.10.3",
    "react-helmet-async": "^2.0.4",
    "formik": "^2.4.5",
    "yup": "^1.3.3",
    "react-toastify": "^10.0.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33"
  }
}
```

---

## 🚀 DÉMARRAGE DU PROJET

### Backend

```bash
cd V2/BACKEND

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements/development.txt

# Configurer .env
cp .env.example .env
# Éditer .env avec vos configs

# Créer base de données
createdb ascendys_connect_db

# Migrations
python manage.py makemigrations
python manage.py migrate

# Créer superuser
python manage.py createsuperuser

# Lancer serveur
python manage.py runserver
```

### Frontend

```bash
cd V2/FRONTEND

# Installer dépendances
npm install

# Configurer .env.local
cp .env.example .env.local
# Éditer avec URL API

# Lancer dev server
npm run dev
```

---

## 🧪 TESTS

### Backend

```bash
# Tous les tests
python manage.py test

# App spécifique
python manage.py test apps.trainings

# Avec coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Frontend

```bash
npm run test
npm run test:coverage
```

---

## 📚 DOCUMENTATION

- **API Documentation** : http://localhost:8000/api/docs/
- **Admin Django** : http://localhost:8000/admin/
- **Frontend** : http://localhost:3000/

---

## 🔒 SÉCURITÉ

### Bonnes pratiques implémentées

✅ JWT Authentication
✅ Role-based permissions
✅ CORS configuré
✅ Rate limiting (contact, newsletter)
✅ File upload validation
✅ SQL injection protection (Django ORM)
✅ XSS protection
✅ CSRF protection
✅ Secrets dans .env
✅ HTTPS en production
✅ Security headers

---

## 🌐 DÉPLOIEMENT

### Backend (Recommandations)

- **Hébergement** : DigitalOcean, AWS, Heroku, Railway
- **Base de données** : PostgreSQL managé
- **Médias** : AWS S3, Cloudinary, DigitalOcean Spaces
- **Web server** : Gunicorn + Nginx
- **SSL** : Let's Encrypt

### Frontend (Recommandations)

- **Hébergement** : Vercel, Netlify, AWS S3 + CloudFront
- **Build** : npm run build
- **Env variables** : Configurées dans la plateforme

---

## 📞 SUPPORT

Pour toute question concernant l'architecture ou l'implémentation, référez-vous à ce document.

---

## 📝 NOTES IMPORTANTES

### Évolutivité future

Le projet est conçu pour permettre facilement l'ajout de :

1. **Inscriptions formations**
   - Modèle `TrainingRegistration`
   - Relation User ↔ Training
   - Workflow validation inscription

2. **Paiements**
   - Intégration CinetPay/FedaPay
   - Modèle `Payment`
   - Statuts paiement

3. **Espace étudiant**
   - App `students`
   - Dashboard étudiant
   - Mes formations
   - Certificats

4. **Notifications**
   - Django Channels (WebSockets)
   - Email notifications
   - SMS (Twilio, etc.)

5. **Analytics**
   - Google Analytics
   - Statistiques internes
   - Rapports

### Principe architectural clé

🎯 **Le frontend ne contient AUCUNE donnée en dur**

Tout le contenu dynamique (formations, services, offres, blog, etc.) vient de l'API.

L'équipe d'Ascendys Connect peut gérer le contenu du site depuis l'interface d'administration sans intervention du développeur.

---

**Version** : 1.0  
**Dernière mise à jour** : 26 Septembre 2026  
**Statut** : Architecture définie - Prêt pour implémentation

---

© 2026 Ascendys Connect - Tous droits réservés
