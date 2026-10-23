# Documentation détaillée — Ascendys Connect

> Plateforme institutionnelle et site officiel d'**Ascendys Connect** : vitrine publique, catalogue de formations, inscription et paiement en ligne, blog, médiathèque et back-office d'administration.

| | |
|---|---|
| **Version du document** | 1.0 |
| **Dernière mise à jour** | 23/10/2026 |
| **Périmètre** | Dossier `V2/` (application active) |
| **Langue de l'interface** | Français (i18n `fr` / `en` disponible) |

---

## Table des matières

1. [Présentation](#1-présentation)
2. [Structure du dépôt](#2-structure-du-dépôt)
3. [Stack technique](#3-stack-technique)
4. [Architecture globale](#4-architecture-globale)
5. [Backend (Django REST)](#5-backend-django-rest)
6. [Frontend (React)](#6-frontend-react)
7. [Flux fonctionnels](#7-flux-fonctionnels)
8. [Installation et démarrage](#8-installation-et-démarrage)
9. [Sécurité](#9-sécurité)
10. [Déploiement](#10-déploiement)
11. [Limites connues et points d'attention](#11-limites-connues-et-points-dattention)
12. [Annexes](#12-annexes)

---

## 1. Présentation

Ascendys Connect est une entreprise spécialisée dans les solutions digitales, les technologies de l'information et la formation IT. La plateforme `V2` regroupe :

- **Un site public** : accueil, à propos, services, formations, blog, galerie/médiathèque, offres, événements, contact, pages légales.
- **Un parcours d'inscription et de paiement** pour les formations (paiement via **FedaPay**).
- **Un back-office** (CMS) permettant de gérer l'ensemble des contenus, les inscriptions, les messages, les utilisateurs et les statistiques.
- **Une API REST** documentée (Swagger / ReDoc) consommée par le frontend.

### Objectifs

- Présenter l'entreprise et ses 5 domaines d'expertise.
- Publier et gérer un catalogue de formations avec inscription en ligne.
- Diffuser des actualités (blog), événements, offres et témoignages.
- Centraliser les contacts et les abonnés à la newsletter.
- Fournir un tableau de bord et des statistiques aux administrateurs.

---

## 2. Structure du dépôt

```
ASCENDYS-CONNECT Portfolio/
├── .gitignore
├── README.md                  # Ancienne documentation (V1)
├── documentation_détaillé.md  # Ce document
├── guide_d'utilisation.md     # Guide utilisateur
├── V1/
│   └── ascendys-connect/      # Ancienne version (Next.js) — conservée pour référence
└── V2/                        # Application active
    ├── README.md              # Documentation historique détaillée du projet V2
    ├── BACKEND/               # API Django REST
    │   ├── apps/              # Applications métier
    │   ├── config/            # Settings, URLs, WSGI/ASGI
    │   ├── media/             # Fichiers uploadés (non versionné)
    │   ├── requirements/      # Dépendances Python
    │   ├── templates/         # Templates Django (emails, admin)
    │   ├── manage.py
    │   ├── DEPLOYMENT.md
    │   └── .env / .env.example
    └── FRONTEND/
        └── ascendys/          # Application React + Vite
            ├── public/        # Assets statiques publics
            ├── src/
            │   ├── components/
            │   ├── config/
            │   ├── context/
            │   ├── guards/
            │   ├── hooks/
            │   ├── i18n/
            │   ├── locales/
            │   ├── pages/
            │   ├── services/
            │   ├── types/
            │   └── utils/
            ├── index.html
            ├── package.json
            ├── tsconfig*.json
            └── vite.config.ts
```

> **V1** est l'ancienne version Next.js du site. Elle n'est plus la cible de développement : toute l'application active se trouve dans **V2**.

---

## 3. Stack technique

### Backend

| Élément | Version / choix |
|---|---|
| Python | 3.11+ (compatible 3.14 avec `psycopg[binary]`) |
| Django | 5.0.1 |
| Django REST Framework | 3.14.0 |
| Authentification | `djangorestframework-simplejwt` 5.3.1 (JWT Bearer) |
| Base de données | PostgreSQL 14+ (driver `psycopg` 3) |
| Filtres / recherche | `django-filter`, `SearchFilter`, `OrderingFilter` |
| Documentation API | `drf-spectacular` (OpenAPI 3, Swagger, ReDoc) |
| CORS | `django-cors-headers` |
| Images | Pillow |
| Configuration | `python-decouple` (`.env`) |
| Rate limiting | `django-ratelimit` (désactivé : nécessite Redis) |
| Serveur prod | Gunicorn |

### Frontend

| Élément | Version / choix |
|---|---|
| React | 19.2 |
| TypeScript | 5.8 |
| Bundler | Vite 8 |
| Routage | `react-router` 8 |
| Styles | Tailwind CSS 4 (+ `@tailwindcss/vite`) |
| Icônes | `lucide-react` |
| Graphiques | ApexCharts / `react-apexcharts` |
| Calendrier | FullCalendar |
| Cartes | Leaflet, MapLibre, `react-map-gl` |
| i18n | `i18next` / `react-i18next` (fr, en) |
| Formulaires téléphone | `react-phone-number-input`, `libphonenumber-js` |
| Notifications UI | Contexte `ToastContext` |
| Polices | Plus Jakarta Sans & Inter |

---

## 4. Architecture globale

```
┌──────────────────────────────┐
│   Navigateur (public/admin)  │
│   React 19 + Vite (5173)     │
└──────────────┬───────────────┘
               │ HTTP JSON / JWT
               │ multipart (uploads)
┌──────────────▼───────────────┐
│   API REST Django (8000)     │
│   /api/v1/...                │
│   Swagger /api/docs/         │
└──────────────┬───────────────┘
               │
     ┌─────────┼──────────┬─────────────┐
     │         │          │             │
┌────▼───┐ ┌───▼────┐ ┌───▼─────┐ ┌─────▼──────┐
│Postgres│ │ Médias │ │ FedaPay │ │  SMTP      │
│  18    │ │ /media │ │(paiement│ │ (emails,   │
│        │ │        │ │ +hook)  │ │  OTP)      │
└────────┘ └────────┘ └─────────┘ └────────────┘
```

- Le **frontend** consomme exclusivement l'API REST (`VITE_API_BASE_URL`).
- L'**authentification** se fait par JWT (`Authorization: Bearer <access>`).
- Les **fichiers média** sont servis par Django en développement (`/media/…`) et par le serveur web en production.
- Les **paiements** sont délégués à FedaPay ; la confirmation arrive par **webhook**.

---

## 5. Backend (Django REST)

### 5.1 Organisation

```
V2/BACKEND/
├── config/
│   ├── settings/
│   │   ├── base.py          # Configuration commune
│   │   ├── development.py   # DEBUG=True, ALLOWED_HOSTS=['*']
│   │   └── production.py    # Sécurité, HTTPS, HSTS
│   ├── urls.py              # Routage global + docs + médias
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/            # Utilisateurs, auth, OTP, rôles
│   ├── company/             # Informations entreprise (singleton)
│   ├── services/            # Domaines d'expertise
│   ├── trainings/           # Formations, catégories, inscriptions, FedaPay
│   ├── offers/              # Offres & annonces
│   ├── blog/                # Articles, catégories, tags
│   ├── events/              # Événements
│   ├── testimonials/        # Témoignages
│   ├── partners/            # Partenaires
│   ├── contact/             # Messages de contact, newsletter
│   ├── media/               # Médiathèque (fichiers + galeries)
│   ├── dashboard/           # Statistiques, logs d'activité
│   ├── notifications/       # Notifications in-app
│   ├── search/              # Recherche globale, SEO, sitemap
│   └── core/                # Modèles abstraits, permissions, exceptions, média
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── media/                   # Uploads (gitignoré)
├── templates/
├── manage.py                # DJANGO_SETTINGS_MODULE=config.settings.development
└── .env
```

Le module de settings par défaut est **`config.settings.development`** (défini dans `manage.py`). En production, on utilise `config.settings.production`.

### 5.2 Modèles abstraits (`apps/core/models.py`)

| Classe | Rôle |
|---|---|
| `TimeStampedModel` | Ajoute `created_at` / `updated_at` |
| `UUIDModel` | Clé primaire UUID (`id`) |
| `SEOModel` | `seo_title`, `seo_description`, `seo_keywords`, `og_image` |
| `SoftDeleteModel` | `is_deleted`, `deleted_at`, `soft_delete()`, `restore()` |
| `PublishableModel` | `status` (`DRAFT`/`PUBLISHED`/`ARCHIVED`), `published_at`, `is_featured` |

La majorité des contenus utilise la **suppression douce** (soft delete) et le **statut de publication**.

### 5.3 Applications et modèles

#### `accounts` — Utilisateurs

Modèle `User` (email comme identifiant, PK UUID) :

- `email` (unique), `first_name`, `last_name`, `phone`,
- `role` : `SUPER_ADMIN`, `ADMIN`, `EDITOR`,
- `avatar`, `is_active`, `is_staff`, `is_deleted`,
- vérification email : `is_email_verified`, `email_verification_code`, expiration, compteur de renvois,
- première connexion : `must_change_password`,
- réinitialisation : `password_reset_code`, expiration, compteur de renvois.

Rôles et capacités :

| Rôle | Portée |
|---|---|
| `SUPER_ADMIN` | Accès total : contenus, utilisateurs, entreprise, logs, paramètres |
| `ADMIN` | Contenus, inscriptions, offres, témoignages, partenaires, analytics |
| `EDITOR` | Contenus éditoriaux : formations, blog, événements, services, galeries |

#### `company` — Entreprise (singleton)

`Company` : nom, slogan, descriptions, logo, favicon, email, téléphones (JSON), adresse, ville, pays, site, réseaux sociaux, année de création, mission, vision, valeurs (JSON), horaires (JSON). **Une seule instance** autorisée (`Company.get_instance()`).

#### `services` — Domaines d'expertise

`Service` : titre, slug, description courte/complète, icône (fichier), image, fonctionnalités (JSON), `is_active`, SEO, statut, soft delete.

#### `trainings` — Formations & inscriptions

`TrainingCategory` : nom, slug, description, ordre, soft delete.

`Training` : titre, slug, descriptions, catégorie, image/bannière, objectifs, prérequis, public cible, programme (`syllabus`), durée, niveau (`BEGINNER`/`INTERMEDIATE`/`ADVANCED`), prix + devise, dates, lieu, mode (`ONLINE`/`ONSITE`/`HYBRID`), formateur, capacité, places max, sessions, contenus marketing (pour qui, problèmes résolus, livrables, compétences, transformation avant/après, inclus/non inclus, positionnement, modalités de paiement, options premium), certification, compteur de vues, statut de publication, soft delete.

`Enrollment` : formation, nom complet, email, téléphone, niveau d'études (+ autre), statut de paiement, montant/devise, `payment_id` (FedaPay), tentatives, expiration (48 h), date de paiement, notes, relances (1 h / 24 h / 7 j).

Statuts d'inscription :

| Statut | Signification |
|---|---|
| `PENDING` | En attente de paiement |
| `PROCESSING` | Paiement en cours |
| `PAID` | Payé / confirmé |
| `FAILED` | Échec du paiement |
| `CANCELLED` | Annulé |
| `EXPIRED` | Expiré (48 h) |

#### `offers` — Offres et annonces

`Offer` : titre, slug, descriptions, image/bannière, type (`TRAINING`, `PROMOTION`, `EVENT`, `RECRUITMENT`, `ANNOUNCEMENT`, `OTHER`), dates, auteur, statut, soft delete.

#### `blog` — Blog

`BlogCategory`, `Tag`, `BlogPost` (titre, slug, extrait, contenu, image de couverture, vidéo, auteur, catégorie, tags, statut, publication, soft delete).

#### `events` — Événements

`Event` : titre, slug, description, image, lieu, type (`CONFERENCE`, `WORKSHOP`, `WEBINAR`, `TRAINING`, `SALON`, `OTHER`), dates/heures, URL d'inscription, capacité, mise en avant, auteur, statut, soft delete.

#### `testimonials` — Témoignages

`Testimonial` : nom, fonction, entreprise, avatar, contenu, note (1–5), mise en avant, publication, ordre, soft delete.

#### `partners` — Partenaires

`Partner` : nom, logo, site web, description, mise en avant, actif, ordre, soft delete.

#### `contact` — Contact & newsletter

- `ContactMessage` : prénom, nom, email, téléphone, entreprise, sujet, message, statut (`NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), notes admin, assignation, date de résolution, consentement RGPD.
- `NewsletterSubscriber` : email (unique), noms, actif, vérifié, token, consentement, désabonnement, centres d'intérêt.

#### `media` — Médiathèque

- `MediaFile` : titre, description, fichier, type (`IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER`), métadonnées (nom, taille, extension, MIME, dimensions), dossier, tags, auteur, compteur de téléchargements.
- `Gallery` : titre, description, `gallery_type` (`PHOTOS` ou `VIDEO`), **jusqu'à 5 photos** (`photo_1`…`photo_5`) **ou 1 vidéo**, `cover_image`, `is_published`, auteur. Une galerie est soit une collection de photos, soit une vidéo unique.

#### `dashboard` — Statistiques et journaux

`ActivityLog` : utilisateur, action (`CREATE`, `UPDATE`, `DELETE`, `VIEW`, `LOGIN`, `LOGOUT`, `EXPORT`, `IMPORT`, `OTHER`), description, objet lié (GenericForeignKey), IP, User-Agent, métadonnées.

#### `notifications` — Notifications in-app

`Notification` : destinataire, type (`PAYMENT`, `CONTACT`, `NEWSLETTER`, `SYSTEM`, `BROADCAST`), titre, message, lien, lu/non lu, date de lecture, métadonnées.

### 5.4 Authentification et autorisations

- **JWT** via SimpleJWT : `access` (60 min par défaut), `refresh` (1 440 min = 24 h), rotation des refresh tokens activée, `UPDATE_LAST_LOGIN`.
- En-tête : `Authorization: Bearer <access_token>`.
- **Permissions DRF par défaut** : `IsAuthenticatedOrReadOnly` (lecture publique, écriture authentifiée).
- Permissions personnalisées (`apps/core/permissions.py`) :
  - `IsAdminUser` : ADMIN, SUPER_ADMIN, EDITOR (ou staff/superuser),
  - `IsSuperAdminUser` : SUPER_ADMIN uniquement,
  - `IsAdminOrReadOnly` : écriture réservée aux ADMIN/SUPER_ADMIN,
  - `IsOwnerOrAdmin`.
- **Throttling** : 60 req/min et 1 000 req/jour (authentifiés) ; 20 req/min et 100 req/jour (anonymes) ; contact 5/heure ; newsletter 3/heure.
- **Première connexion** : OTP à 6 chiffres envoyé par email (`is_email_verified`, code valable 15 min), puis changement de mot de passe obligatoire (`must_change_password`).
- **Mot de passe oublié** : code à 6 chiffres, vérification, réinitialisation.
- **Déconnexion** : endpoint dédié (les tokens sont gérés côté client).

### 5.5 API REST

Base : `http://127.0.0.1:8000/api/v1/`

#### Authentification — `/auth/`

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/auth/login/` | Connexion (email + mot de passe) |
| POST | `/auth/refresh/` | Rafraîchir l'access token (utilisateur actif vérifié) |
| POST | `/auth/logout/` | Déconnexion |
| POST | `/auth/verify-otp/` | Vérifier le code OTP |
| POST | `/auth/resend-otp/` | Renvoyer l'OTP |
| POST | `/auth/first-login-password-change/` | Changer le mot de passe à la 1ʳᵉ connexion |
| GET/PATCH | `/auth/me/` · `/auth/me/update/` | Profil |
| POST | `/auth/me/change-password/` | Changer le mot de passe |
| GET | `/auth/users/` | Lister les utilisateurs (SUPER_ADMIN) |
| POST | `/auth/users/create/` | Créer un utilisateur |
| PATCH | `/auth/users/<uuid>/` | Modifier un utilisateur |
| POST | `/auth/users/<uuid>/toggle-status/` | Activer/désactiver |
| DELETE | `/auth/users/<uuid>/delete/` | Supprimer (soft delete) |
| POST | `/auth/forgot-password/` | Demander un code |
| POST | `/auth/verify-reset-code/` | Vérifier le code |
| POST | `/auth/reset-password/` | Réinitialiser |
| POST | `/auth/resend-reset-code/` | Renvoyer le code |

#### Entreprise — `/company/`

`GET /company/`, `GET /company/info/`, `GET /company/about/`, `PUT/PATCH /company/update/`.

#### Services — `/services/`

CRUD complet (`GET`, `POST`, `PUT/PATCH`, `DELETE`) avec recherche par slug. Filtres possibles : `is_active`, `status`, `is_featured`, recherche.

#### Formations — `/trainings/`

| Méthode | Endpoint | Description |
|---|---|---|
| GET/POST | `/trainings/` | Liste / création (recherche par slug pour le détail) |
| GET/PUT/PATCH/DELETE | `/trainings/<slug>/` | Détail / modification / suppression |
| GET/POST | `/trainings/categories/` | Catégories |
| GET/PUT/PATCH/DELETE | `/trainings/categories/<slug>/` | Détail catégorie |
| GET/POST | `/trainings/enrollments/` | Inscriptions |
| GET/PATCH/DELETE | `/trainings/enrollments/<uuid>/` | Détail inscription |
| POST | `/trainings/enrollments/<uuid>/initiate-payment/` | Initier le paiement FedaPay |
| POST | `/trainings/enrollments/<uuid>/retry-payment/` | Réessayer |
| POST | `/trainings/enrollments/<uuid>/send-reminder/` | Envoyer une relance |
| POST | `/trainings/enrollments/process-reminders/` | Traiter les relances |
| POST | `/trainings/enrollments/webhook/` | Webhook FedaPay |

Actions de publication : `publish`, `archive`, `feature`, etc. (selon le ViewSet).

#### Offres — `/offers/`

CRUD complet, recherche par slug, filtres (`type`, `status`, dates, `is_featured`).

#### Blog — `/blog/`

- `/blog/` : articles (CRUD, détail par slug),
- `/blog/categories/` : catégories,
- `/blog/tags/` : tags.

#### Événements — `/events/`

CRUD complet, détail par slug, filtres (`event_type`, dates, `is_featured`).

#### Témoignages — `/testimonials/`

CRUD, actions de publication et mise en avant.

#### Partenaires — `/partners/`

CRUD, mise en avant, ordre.

#### Contact & newsletter — `/contact/`

- `/contact/messages/` : messages de contact (CRUD, `mark_resolved`, `assign`),
- `/contact/newsletter/` : abonnés newsletter.

#### Médiathèque — `/media/`

- `/media/files/` : fichiers média (upload, liste, détail, suppression),
- `/media/galleries/` : galeries (CRUD, `toggle_publish`, filtres `gallery_type`, `is_published`).

#### Tableau de bord — `/dashboard/`

| Endpoint | Description |
|---|---|
| `/dashboard/stats/` | Statistiques principales |
| `/dashboard/charts/` | Données des graphiques |
| `/dashboard/global-analytics/` | Analytique globale |
| `/dashboard/editor-stats/` | Statistiques pour les éditeurs |
| `/dashboard/activity-logs/` | Journal d'activité |

#### Notifications — `/notifications/`

Liste, détail, `unread-count`, `mark-read`, `mark-unread`, `mark-all-read`, `clear-all-read`, `broadcast` (diffusion ciblée).

#### Recherche et SEO — `/search/`

`/search/` (recherche globale), `/search/sitemap/`, `/search/robots/`, `/search/seo-meta/`.

#### Santé, documentation, administration

| URL | Description |
|---|---|
| `GET /health` et `/health/` | Vérification de disponibilité |
| `GET /api/schema/` | Schéma OpenAPI |
| `GET /api/docs/` | Swagger UI |
| `GET /api/redoc/` | ReDoc |
| `/admin/` | Administration Django |
| `/media/...` | Fichiers média (DEBUG) |
| `/static/...` | Fichiers statiques (DEBUG) |

> Pagination par défaut : `PageNumberPagination`, **20 éléments par page**.
> Filtres : `django-filter`, `SearchFilter`, `OrderingFilter`.

### 5.6 Paiement FedaPay

Configuration (`config/settings/base.py`, alimentée par `.env`) :

```env
FEDAPAY_MODE=sandbox            # ou live
FEDAPAY_SECRET_KEY=sk_...
FEDAPAY_PUBLIC_KEY=pk_...
FEDAPAY_WEBHOOK_SECRET=whsec_...
FEDAPAY_CURRENCY=XOF
FEDAPAY_CALLBACK_URL=http://localhost:5173
```

Cycle de vie :

```
1. Formulaire d'inscription                    → Enrollment PENDING
2. « Payer maintenant »                        → PROCESSING
3. Redirection vers FedaPay (checkout_url)
4. Webhook FedaPay (transaction.approved)      → PAID
   Webhook (declined / canceled)               → FAILED / CANCELLED
5. Expiration automatique après 48 h           → EXPIRED
```

- Le service `apps/trainings/services/fedapay_service.py` crée la transaction, récupère l'URL de paiement et vérifie la **signature** du webhook (`X-FedaPay-Signature`, HMAC SHA-256).
- Le webhook met à jour l'inscription et crée une **notification** de type `PAYMENT`.
- Des **relances** automatiques (1 h, 24 h, 7 j) sont gérées par `reminder_service.py` et la commande `send_payment_reminders`.

### 5.7 Médias et lecture vidéo

- Les fichiers sont stockés dans `MEDIA_ROOT` (`V2/BACKEND/media/`) et exposés sous `MEDIA_URL` (`/media/`).
- En développement, Django sert les médias via la vue `apps/core/media.py` (`serve_media`) qui ajoute la prise en charge des **requêtes HTTP Range** (nécessaire pour lire/avancer dans une vidéo sans télécharger tout le fichier).
- Types d'images acceptés par `ImageField` : formats gérés par Pillow.
- Galeries vidéo : extensions autorisées `mp4`, `webm`, `mov`, `avi`.

### 5.8 Notifications

- Modèle `Notification` (destinataire, type, titre, message, lien, lu).
- Créées automatiquement sur :
  - nouveau paiement,
  - nouveau message de contact,
  - nouvel abonné newsletter,
  - diffusion manuelle (broadcast).
- Endpoints dédiés pour le compteur de non-lus et les actions de masse.

### 5.9 Recherche et SEO

- `/api/v1/search/` : recherche globale multi-contenus.
- `/api/v1/search/sitemap/` : données de sitemap.
- `/api/v1/search/robots/` : contenu `robots.txt`.
- `/api/v1/search/seo-meta/` : métadonnées SEO.
- Chaque contenu publiable possède des champs SEO (`SEOModel`).

### 5.10 Commandes de gestion

| Commande | Rôle |
|---|---|
| `python manage.py send_payment_reminders` | Envoie les relances de paiement (1 h / 24 h / 7 j) |

### 5.11 Tests

- Un fichier de tests existe : `apps/accounts/tests.py`.
- La couverture de tests reste limitée ; les tests d'intégration frontend ne sont pas configurés.

---

## 6. Frontend (React)

### 6.1 Organisation

```
src/
├── components/
│   ├── auth/          # Écrans d'authentification
│   ├── blog/          # Cartes et composants blog
│   ├── calendar/
│   ├── charts/
│   ├── common/        # PageMeta, PageHeader, VideoThumbnail…
│   ├── ecommerce/
│   ├── events/
│   ├── form/
│   ├── gallery/
│   ├── header/
│   ├── offers/
│   ├── partners/
│   ├── public/        # Navbar, Footer, sections de la home…
│   ├── services/
│   ├── tables/
│   ├── testimonials/
│   ├── trainings/     # TrainingCard…
│   ├── ui/            # Boutons, modales, badges, toasts…
│   └── users/
├── config/
│   ├── api.ts         # URL de base, endpoints, routes publiques
│   ├── menu.config.tsx# Menus et rôles
│   └── routes.ts
├── context/           # Auth, Company, Language, Notification, Sidebar, Theme, Toast
├── guards/            # AuthGuard, GuestGuard, RoleGuard
├── hooks/             # useApi, etc.
├── i18n/              # Configuration i18next + langues
├── locales/           # fr/common.json, en/common.json
├── pages/             # Pages publiques et back-office
├── services/          # Clients API par domaine
├── types/             # Types TypeScript
└── utils/             # media.ts, helpers…
```

### 6.2 Routage

Le routage est défini dans `src/App.tsx` avec `react-router`.

#### Pages publiques

| Route | Page |
|---|---|
| `/` | Accueil |
| `/about` | À propos |
| `/services` | Services / domaines d'intervention |
| `/trainings` | Catalogue de formations |
| `/formations` | Catalogue (variante publique) |
| `/trainings/:slug` | Détail d'une formation |
| `/trainings/:slug/enroll` | Inscription à une formation |
| `/enroll?training=slug` | Formulaire d'inscription |
| `/payment/:enrollmentId` | Page de paiement |
| `/payment/success` | Confirmation de paiement |
| `/payment/error` | Erreur de paiement |
| `/blog` | Liste des articles |
| `/blog/:slug` | Détail d'un article |
| `/events/:slug` | Détail d'un événement |
| `/offers/:slug` | Détail d'une offre |
| `/gallery` | Médiathèque publique |
| `/contact` | Contact |
| `/legal-notice` | Mentions légales |
| `/privacy-policy` | Politique de confidentialité |
| `/terms-of-use` | Conditions d'utilisation |
| `/cookies` | Politique cookies |

#### Authentification

| Route | Page |
|---|---|
| `/signin` | Connexion (`GuestGuard`) |
| `/verify-otp` | Vérification OTP |
| `/change-password` | Changement de mot de passe (1ʳᵉ connexion) |
| `/forgot-password` | Mot de passe oublié |
| `/verify-reset-code` | Vérification du code |
| `/reset-password` | Réinitialisation |

#### Back-office (protégé par `AuthGuard` + `AppLayout`)

| Domaine | Routes principales |
|---|---|
| Tableau de bord | `/dashboard` |
| Profil | `/profile` |
| Notifications | `/notifications`, `/notifications/broadcast` |
| Utilisateurs | `/users`, `/users/create` (SUPER_ADMIN) |
| Formations | `/admin/trainings`, `/admin/trainings/create`, `/admin/trainings/edit/:slug` |
| Catégories | `/admin/trainings/categories`, `.../create`, `.../edit/:slug` |
| Inscriptions | `/admin/trainings/enrollments` |
| Blog | `/admin/blog/posts`, `.../create`, `.../edit/:slug` |
| Blog catégories | `/admin/blog/categories`, `.../create`, `.../edit/:slug` |
| Blog tags | `/admin/blog/tags`, `.../create`, `.../edit/:slug` |
| Événements | `/admin/events`, `.../create`, `.../edit/:slug`, `/admin/events/calendar` |
| Services | `/admin/services`, `.../create`, `.../edit/:slug` |
| Offres | `/admin/offers`, `.../create`, `.../edit/:slug` |
| Témoignages | `/admin/testimonials`, `.../create` |
| Partenaires | `/admin/partners`, `.../create` |
| Médiathèques | `/admin/galleries`, `/admin/galleries/create` |
| Messages | `/messages/contacts`, `/messages/newsletter` |
| Système | `/company`, `/analytics`, `/logs`, `/settings` |
| Divers (démo) | `/calendar`, `/blank`, `/form-elements`, `/basic-tables`, `/alerts`, `/avatars`, `/badge`, `/buttons`, `/images`, `/videos`, `/line-chart`, `/bar-chart` |

Route de secours : `*` → page `NotFound`.

### 6.3 Guards et rôles

| Guard | Rôle |
|---|---|
| `AuthGuard` | Redirige vers `/signin` si non authentifié |
| `GuestGuard` | Empêche un utilisateur connecté d'accéder à `/signin` |
| `RoleGuard` | Vérifie que le rôle est autorisé (`allowedRoles`) |

Le menu latéral est filtré par rôle via `filterMenuByRole()` (`config/menu.config.tsx`).

### 6.4 Menu d'administration

| Section | Éléments | Rôles |
|---|---|---|
| Principal | Dashboard, Notifications | Tous |
| Principal | Diffusion de messages | SUPER_ADMIN, ADMIN |
| Principal | Utilisateurs | SUPER_ADMIN |
| Principal | Formations (liste, inscriptions, création, catégories) | Tous (inscriptions : SUPER_ADMIN/ADMIN) |
| Principal | Blog (articles, catégories, tags) | Tous |
| Principal | Événements (+ calendrier) | Tous |
| Principal | Services | Tous |
| Contenu | Témoignages | SUPER_ADMIN, ADMIN |
| Contenu | Partenaires | SUPER_ADMIN, ADMIN |
| Contenu | Offres d'emploi | SUPER_ADMIN, ADMIN |
| Contenu | Messages (contacts, newsletter) | Tous |
| Contenu | Médiathèques | Tous |
| Système | Statistiques globales | SUPER_ADMIN, ADMIN |
| Système | Informations entreprise | SUPER_ADMIN |
| Système | Logs d'activité | SUPER_ADMIN |

### 6.5 Services API et gestion de session

- `src/services/api.service.ts` : client HTTP central.
  - Injecte `Authorization: Bearer <token>`.
  - **Rafraîchissement dédupliqué** : une seule requête `/auth/refresh/` à la fois.
  - **1 seule tentative** de refresh puis déconnexion si échec.
  - Les routes publiques (`PUBLIC_API_PREFIXES`) n'exigent pas de token pour un visiteur non-staff ; une session staff envoie quand même son token pour récupérer les brouillons.
  - Gère `FormData` (upload de fichiers) sans forcer `Content-Type`.
- `src/services/*.service.ts` : un service par domaine (auth, trainings, blog, events, services, offers, testimonials, partners, gallery, contact, dashboard, notifications, users, logs, settings, enrollments, company).
- `src/utils/media.ts` : construit l'URL absolue des médias à partir de `VITE_API_BASE_URL` (les URL déjà absolues sont conservées).

### 6.6 Contextes React

| Contexte | Rôle |
|---|---|
| `AuthContext` | Utilisateur, tokens, connexion/déconnexion, refresh du profil |
| `CompanyContext` | Informations de l'entreprise (nom, logo, contacts…) |
| `LanguageContext` | Langue courante |
| `NotificationContext` | Notifications et compteur de non-lus |
| `SidebarContext` | État de la barre latérale |
| `ThemeContext` | Thème clair/sombre |
| `ToastContext` | Notifications visuelles (toasts) |

### 6.7 Internationalisation

- Deux langues : **français (`fr`)** et **anglais (`en`)**.
- Fichiers : `src/locales/fr/common.json`, `src/locales/en/common.json`.
- Détection : langue sauvegardée (`i18nextLng` / `language`) puis langue du navigateur, repli sur `en`.
- Interpolation avec accolades : `{variable}`.

### 6.8 Pages publiques (fonctionnel)

- **Accueil** : hero, à propos, services, formations, témoignages, partenaires, statistiques, actualités, contact.
- **Services** : présentation des 5 domaines d'intervention (descriptions justifiées).
- **Formations** : catalogue filtrable, cartes de formation, détail, inscription.
- **Blog** : liste, détail, catégories.
- **Galerie** : grille de photos ou vidéos, aperçu vidéo avec bouton play, visionneuse.
- **Contact** : formulaire (avec consentement RGPD) et newsletter.
- **Offres / Événements** : pages de détail.
- **Pages légales** : mentions, confidentialité, CGU, cookies.

### 6.9 Composants notables

| Composant | Rôle |
|---|---|
| `common/VideoThumbnail.tsx` | Aperçu vidéo (frame + bouton play, repli sur icône) |
| `trainings/TrainingCard.tsx` | Carte de formation (image, description justifiée, prix, CTA) |
| `public/TrainingsSection.tsx` | Section formations de l'accueil |
| `public/ServicesSection.tsx` | Section services de l'accueil |
| `public/PublicNavbar.tsx` / `PublicFooter.tsx` | Navigation et pied de page publics |
| `public/WhatsAppButton.tsx` | Bouton de contact WhatsApp |
| `common/PageMeta.tsx` | Titre/description SEO par page |
| `common/PageHeader.tsx` | En-tête de page admin |
| `ui/*` | Boutons, modales, badges, tables, toasts |

### 6.10 Design system

- **Tailwind CSS 4** avec tokens de thème (couleurs `brand`, `success`, etc.).
- Mode sombre (`dark:`) pris en charge.
- Polices : **Plus Jakarta Sans** (titres) et **Inter** (texte).
- Composants réutilisables dans `components/ui`.
- Icônes : `lucide-react` + icônes SVG internes (`src/icons`).

---

## 7. Flux fonctionnels

### 7.1 Inscription et paiement d'une formation

```
Visiteur
  │  choisit une formation (/trainings)
  ▼
Formulaire (/enroll?training=slug)  ──►  POST /trainings/enrollments/
  │                                        (Enrollment PENDING, expire 48 h)
  ▼
Page de paiement (/payment/:id)
  │  « Payer maintenant »
  ▼
POST /trainings/enrollments/:id/initiate-payment/
  │                                        (PROCESSING + checkout_url)
  ▼
Redirection FedaPay  ──►  paiement
  │
  ▼
Webhook FedaPay  ──►  PAID / FAILED  ──►  Notification admin
  │
  ▼
Page succès (/payment/success) ou erreur (/payment/error)
```

### 7.2 Publication d'un contenu (formation, article, événement…)

1. Un ADMIN/EDITOR crée le contenu (statut `DRAFT`).
2. Il complète les champs, l'image et les informations SEO.
3. Il publie (statut `PUBLISHED`, `published_at` renseigné).
4. Le contenu apparaît sur le site public.
5. La suppression est douce (`is_deleted=True`) et peut être restaurée.

### 7.3 Médiathèque

1. Création d'une galerie de type `PHOTOS` (1 à 5 images) ou `VIDEO` (1 fichier).
2. Publication (`is_published`).
3. Côté public : grille de photos ou aperçu vidéo (frame + bouton play).
4. Côté admin : remplacement/suppression d'un emplacement, ajout de photos, remplacement de la vidéo.
5. Règles : impossible de supprimer la dernière photo ou la seule vidéo ; les anciens fichiers remplacés sont supprimés du stockage.

### 7.4 Contact et newsletter

1. Le visiteur envoie un message (`POST /contact/messages/`) avec consentement.
2. Une notification `CONTACT` est créée pour les administrateurs.
3. L'admin traite le message (`IN_PROGRESS` → `RESOLVED`).
4. L'inscription newsletter crée un abonné et une notification `NEWSLETTER`.

### 7.5 Notifications et diffusion

- Les événements métier créent des notifications ciblées.
- Un ADMIN/SUPER_ADMIN peut diffuser un message de masse (`/notifications/broadcast`) vers un ou plusieurs rôles.
- Chaque utilisateur peut marquer comme lu, tout marquer comme lu, ou supprimer.

---

## 8. Installation et démarrage

### 8.1 Prérequis

- Python 3.11+
- PostgreSQL 14+
- Node.js 20+ et npm
- Git

### 8.2 Backend

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio\V2\BACKEND"

# Environnement virtuel
python -m venv venv
.\venv\Scripts\activate

# Dépendances
pip install -r requirements\development.txt

# Configuration
copy .env.example .env
# Éditer .env (base de données, email, FedaPay, CORS…)

# Base de données
createdb ascendys_connect_db

# Migrations
python manage.py migrate

# Compte administrateur
python manage.py createsuperuser

# Serveur de développement
python manage.py runserver
```

- API : <http://127.0.0.1:8000/api/v1/>
- Documentation : <http://127.0.0.1:8000/api/docs/>
- Admin Django : <http://127.0.0.1:8000/admin/>

### 8.3 Frontend

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio\V2\FRONTEND\ascendys"

npm install
copy .env.example .env
# VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

npm run dev
```

- Application : <http://localhost:5173/>
- Connexion admin : <http://localhost:5173/signin>

### 8.4 Variables d'environnement

#### Backend (`V2/BACKEND/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `SECRET_KEY` | Clé secrète Django | `django-insecure-...` |
| `DEBUG` | Mode debug | `True` |
| `ALLOWED_HOSTS` | Hôtes autorisés | `localhost,127.0.0.1` |
| `DB_ENGINE` | Moteur de base | `django.db.backends.postgresql` |
| `DB_NAME` | Nom de la base | `ascendys_connect_db` |
| `DB_USER` / `DB_PASSWORD` | Identifiants | `postgres` / `***` |
| `DB_HOST` / `DB_PORT` | Hôte / port | `localhost` / `5432` |
| `JWT_ACCESS_TOKEN_LIFETIME` | Durée access (min) | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME` | Durée refresh (min) | `1440` |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées | `http://localhost:5173` |
| `EMAIL_BACKEND` | Backend email | SMTP ou console |
| `EMAIL_HOST` / `EMAIL_PORT` | Serveur SMTP | `smtp.gmail.com` / `587` |
| `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | Identifiants SMTP | — |
| `DEFAULT_FROM_EMAIL` | Expéditeur | `contact@...` |
| `MEDIA_ROOT` / `MEDIA_URL` | Stockage médias | `media` / `/media/` |
| `SECURE_SSL_REDIRECT` | Redirection HTTPS | `False` (dev) |
| `SESSION_COOKIE_SECURE` / `CSRF_COOKIE_SECURE` | Cookies sécurisés | `False` (dev) |
| `FEDAPAY_MODE` | Environnement FedaPay | `sandbox` / `live` |
| `FEDAPAY_SECRET_KEY` | Clé secrète | `sk_...` |
| `FEDAPAY_PUBLIC_KEY` | Clé publique | `pk_...` |
| `FEDAPAY_WEBHOOK_SECRET` | Secret de signature | `whsec_...` |
| `FEDAPAY_CURRENCY` | Devise | `XOF` |
| `FEDAPAY_CALLBACK_URL` | URL frontend (retour + relances) | `http://localhost:5173` |

#### Frontend (`V2/FRONTEND/ascendys/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_BASE_URL` | URL de base de l'API | `http://127.0.0.1:8000/api/v1` |
| `VITE_APP_NAME` | Nom affiché | `Ascendys Connect` |
| `VITE_APP_VERSION` | Version | `2.4.0` |

### 8.5 Accès depuis un téléphone (réseau local)

1. **Trouver l'IP du PC** : `ipconfig` → « Adresse IPv4 » (ex. `192.168.1.42`).
2. **Backend** : autoriser l'origine du téléphone dans `V2/BACKEND/.env` :
   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://192.168.1.42:5173
   ```
   puis lancer : `python manage.py runserver 0.0.0.0:8000`.
   (`ALLOWED_HOSTS = ['*']` en développement.)
3. **Frontend** : pointer l'API vers l'IP LAN dans `V2/FRONTEND/ascendys/.env` :
   ```env
   VITE_API_BASE_URL=http://192.168.1.42:8000/api/v1
   ```
   puis lancer : `npm run dev -- --host`.
4. **Pare-feu Windows** : autoriser Node.js et Python sur le réseau privé (ports TCP 5173 et 8000).
5. **Téléphone** (même Wi-Fi) : ouvrir `http://192.168.1.42:5173`.

> Si l'IP change, mettre à jour les deux `.env`. Éviter les réseaux Wi-Fi « invités » qui isolent les appareils.

### 8.6 Commandes utiles

| Commande | Contexte |
|---|---|
| `python manage.py check` | Vérifier la configuration |
| `python manage.py makemigrations` | Créer des migrations |
| `python manage.py migrate` | Appliquer les migrations |
| `python manage.py send_payment_reminders` | Relances de paiement |
| `python manage.py shell` | Shell Django |
| `npm run dev` | Serveur Vite |
| `npm run build` | Build production (`tsc -b && vite build`) |
| `npm run lint` | ESLint |
| `npm run preview` | Prévisualiser le build |

---

## 9. Sécurité

- **JWT** avec rotation des refresh tokens et vérification que l'utilisateur est toujours actif.
- **Mots de passe** hachés par Django.
- **OTP** à 6 chiffres, expiration 15 min, compteur de renvois.
- **Rôles** et permissions côté API (`IsAdminUser`, `IsSuperAdminUser`, `IsAdminOrReadOnly`, `IsOwnerOrAdmin`).
- **Permissions par route** côté frontend (`AuthGuard`, `GuestGuard`, `RoleGuard`).
- **CORS** restreint aux origines déclarées.
- **Throttling** configuré (anti-abus).
- **Suppression douce** des contenus et utilisateurs.
- **En-têtes de sécurité** : `X_FRAME_OPTIONS = DENY`, `SECURE_CONTENT_TYPE_NOSNIFF`, XSS filter.
- **Production** : HTTPS forcé, cookies sécurisés, HSTS (1 an), `DEBUG=False`.
- **Webhook FedaPay** : signature HMAC vérifiée.
- **Secrets** : jamais commités (`.env` ignoré par Git).

> ⚠️ Le fichier `.env` présent dans le dépôt local contient des identifiants réels (SMTP, FedaPay). Il doit être considéré comme **strictement confidentiel** et régénéré/renouvelé avant toute mise en production.

---

## 10. Déploiement

### 10.1 Backend

1. Cloner le dépôt sur le serveur.
2. Créer un environnement virtuel et installer `requirements/production.txt`.
3. Configurer `.env` :
   ```env
   DEBUG=False
   ALLOWED_HOSTS=api.ascendysconnect.com
   CORS_ALLOWED_ORIGINS=https://ascendysconnect.com
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   FEDAPAY_MODE=live
   ```
4. Définir `DJANGO_SETTINGS_MODULE=config.settings.production`.
5. Appliquer les migrations : `python manage.py migrate`.
6. Collecter les statiques : `python manage.py collectstatic`.
7. Lancer Gunicorn derrière Nginx (ou équivalent) :
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```
8. Configurer Nginx pour servir `/static/` et `/media/` et proxyfier `/api/`.
9. Activer HTTPS (Let's Encrypt).
10. Configurer le **webhook FedaPay** vers `https://api.ascendysconnect.com/api/v1/trainings/enrollments/webhook/`.

### 10.2 Frontend

1. Configurer `.env` (ou `.env.production`) avec l'URL d'API de production.
2. `npm ci && npm run build`.
3. Déployer le contenu de `dist/` sur un serveur statique / CDN.
4. Configurer une règle de réécriture SPA (toutes les routes → `index.html`).

### 10.3 Checklist

- [ ] `DEBUG=False`
- [ ] `SECRET_KEY` robuste et unique
- [ ] `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS` restreints
- [ ] Base PostgreSQL sauvegardée
- [ ] HTTPS actif
- [ ] Clés FedaPay `live` et webhook configuré
- [ ] Emails SMTP fonctionnels
- [ ] `collectstatic` exécuté
- [ ] Sauvegardes des médias
- [ ] Super utilisateur créé
- [ ] Logs et supervision en place

---

## 11. Limites connues et points d'attention

1. **Page « Paramètres système »** (`/settings`) : le frontend appelle `GET/PATCH /core/settings/`, mais **aucune route/back-end `core/settings` n'est implémentée** (l'application `apps.core` n'expose pas d'URL). La page ne peut donc pas enregistrer de paramètres tant que l'endpoint n'existe pas.
2. **Tests automatisés limités** : seul `apps/accounts/tests.py` existe ; pas de suite de tests frontend.
3. **Rate limiting** : `django-ratelimit` est désactivé (nécessite Redis en production) ; le throttling DRF reste actif.
4. **V1 (Next.js)** : conservée pour référence, non maintenue.
5. **Duplication de route** : `/profile` est déclarée deux fois dans `App.tsx` (la première correspond à `EditProfilePage`, la seconde à `UserProfiles`). La première est effectivement utilisée.
6. **Incohérence menu/route** : la route `/admin/trainings/enrollments` autorise les EDITOR, tandis que le menu la réserve aux SUPER_ADMIN/ADMIN. Vérifier la politique souhaitée.
7. **Médias en développement** : la prise en charge des requêtes `Range` est assurée par la vue Django personnalisée ; en production, c'est le serveur web (Nginx) qui doit gérer les `Range`.
8. **Fichier `.env` local** : contient des secrets réels ; ne jamais le commiter ni le partager.
9. **Images de la médiathèque** : les aperçus vidéo dépendent du chargement des métadonnées ; prévoir des fichiers `faststart` (moov atom en début de fichier) pour un démarrage rapide.

---

## 12. Annexes

### 12.1 Arborescence des applications Django

| App | Principaux modèles | Rôle |
|---|---|---|
| `accounts` | `User` | Authentification, OTP, rôles |
| `company` | `Company` | Informations entreprise |
| `services` | `Service` | Domaines d'expertise |
| `trainings` | `TrainingCategory`, `Training`, `Enrollment` | Formations, inscriptions, paiement |
| `offers` | `Offer` | Offres et annonces |
| `blog` | `BlogCategory`, `Tag`, `BlogPost` | Blog |
| `events` | `Event` | Événements |
| `testimonials` | `Testimonial` | Témoignages |
| `partners` | `Partner` | Partenaires |
| `contact` | `ContactMessage`, `NewsletterSubscriber` | Contact, newsletter |
| `media` | `MediaFile`, `Gallery` | Médiathèque |
| `dashboard` | `ActivityLog` | Statistiques, logs |
| `notifications` | `Notification` | Notifications |
| `search` | — (vues) | Recherche, SEO |
| `core` | Modèles abstraits | Socle commun |

### 12.2 Glossaire

| Terme | Définition |
|---|---|
| **CMS** | Système de gestion de contenu (back-office) |
| **DRF** | Django REST Framework |
| **JWT** | JSON Web Token (authentification) |
| **OTP** | One-Time Password (code à usage unique) |
| **Soft delete** | Suppression logique (l'élément reste en base, marqué supprimé) |
| **Slug** | Identifiant lisible dans l'URL (ex. `python-avance`) |
| **Webhook** | Appel HTTP envoyé par un service tiers (FedaPay) pour notifier un événement |
| **Range** | Requête HTTP partielle permettant de lire une vidéo sans la télécharger entièrement |
| **Singleton** | Modèle dont une seule instance existe (Company) |

### 12.3 Ressources

- Documentation API interactive : `/api/docs/` (Swagger) et `/api/redoc/`
- Guide utilisateur : [`guide_d'utilisation.md`](./guide_d'utilisation.md)
- Documentation backend historique : `V2/BACKEND/README.md`, `V2/BACKEND/DEPLOYMENT.md`
- Documentation projet historique : `V2/README.md`
