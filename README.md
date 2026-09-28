# 🌐 Ascendys Connect - Site Web Officiel

> Plateforme institutionnelle de formation et de conseil IT en Côte d'Ivoire

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Django](https://img.shields.io/badge/Django-5.0.1-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

---

## 📋 À propos

**Ascendys Connect** est une plateforme web complète dédiée à la formation professionnelle en technologies de l'information en Côte d'Ivoire. Ce repository contient le code source complet du site web officiel de l'entreprise.

### 🎯 Objectifs de la plateforme

- 🎓 **Formation** : Catalogue de formations IT (développement, data science, cybersécurité, cloud, etc.)
- 📝 **Blog** : Articles techniques et actualités IT
- 📅 **Événements** : Webinaires, ateliers, conférences
- 💼 **Services** : Accompagnement stratégique et conseil IT
- 🤝 **Témoignages** : Retours d'expérience clients
- 📞 **Contact** : Formulaire de contact et newsletter

---

## 🏗️ Architecture

Le projet est structuré en **2 versions** :

### 📁 Structure du repository

```
ASCENDYS-CONNECT Portfolio/
├── V1/                          # Version 1 (Next.js - Frontend uniquement)
│   └── ascendys-connect/        # Application Next.js 15
│       ├── app/                 # Pages et routes
│       ├── components/          # Composants réutilisables
│       ├── data/               # Données statiques
│       └── public/             # Assets statiques
│
├── V2/                          # Version 2 (Full-stack Django + React)
│   ├── BACKEND/                # API Django REST Framework
│   │   ├── apps/               # 13 applications Django modulaires
│   │   ├── config/             # Configuration Django
│   │   └── media/              # Fichiers uploadés
│   │
│   └── FRONTEND/               # Admin Dashboard React
│       └── ascendys/           # Application React + TypeScript
│           ├── src/
│           │   ├── components/ # Composants UI
│           │   ├── pages/      # Pages admin
│           │   ├── services/   # API services
│           │   ├── types/      # Types TypeScript
│           │   └── guards/     # Route guards
│           └── public/         # Assets
│
└── README.md                    # Ce fichier
```

---

## 🚀 Version 1 - Site Vitrine (Next.js)

### Technologies
- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Déploiement** : Vercel / Netlify

### Caractéristiques
- ✅ Site institutionnel statique
- ✅ Pages : Accueil, Formations, Services, À propos, Contact
- ✅ SEO optimisé
- ✅ Responsive design
- ✅ Performance optimale

### 📦 Installation

```bash
cd V1/ascendys-connect
npm install
npm run dev
# Ouvrir http://localhost:3000
```

### 🔧 Configuration

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_SITE_URL=https://ascendysconnect.com
NEXT_PUBLIC_CONTACT_EMAIL=contact@ascendysconnect.com
```

---

## 🚀 Version 2 - Plateforme Full-Stack (Django + React)

### 🎨 Frontend - Admin Dashboard

**Stack technique** :
- **Framework** : React 19 + Vite
- **Language** : TypeScript 5.7
- **UI** : TailAdmin Pro (Tailwind CSS v4)
- **State** : Context API
- **Auth** : JWT (simple-jwt)
- **HTTP Client** : Axios

**Caractéristiques** :
- ✅ Dashboard dynamique (2 niveaux : SUPER_ADMIN, ADMIN)
- ✅ Gestion utilisateurs (CRUD)
- ✅ Gestion contenus (formations, blog, événements, services, témoignages)
- ✅ Médiathèque (upload fichiers)
- ✅ Paramètres système (SEO, SMTP, etc.)
- ✅ Journaux d'activité
- ✅ Dark mode
- ✅ Responsive

**Installation** :

```bash
cd V2/FRONTEND/ascendys
npm install
npm run dev
# Ouvrir http://localhost:5173
```

**Configuration** :

Créer `.env` :

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

### ⚙️ Backend - API REST

**Stack technique** :
- **Framework** : Django 5.0.1
- **API** : Django REST Framework 3.14.0
- **Database** : PostgreSQL 18
- **Auth** : JWT (djangorestframework-simplejwt)
- **Storage** : Pillow (images)
- **Documentation** : drf-spectacular (Swagger)

**Architecture modulaire (13 apps)** :
1. `accounts` - Authentification & utilisateurs
2. `company` - Informations entreprise (singleton)
3. `core` - Modèles de base & middleware
4. `services` - Services proposés
5. `trainings` - Catalogue de formations
6. `offers` - Offres promotionnelles
7. `blog` - Articles & catégories
8. `events` - Événements & webinaires
9. `testimonials` - Témoignages clients
10. `partners` - Partenaires
11. `contact` - Messages & newsletter
12. `media` - Médiathèque
13. `dashboard` - Statistiques & logs
14. `search` - Recherche globale & SEO

**Endpoints principaux** :
- `/api/v1/auth/` - Authentification
- `/api/v1/trainings/` - Formations
- `/api/v1/blog/` - Blog
- `/api/v1/events/` - Événements
- `/api/v1/services/` - Services
- `/api/v1/testimonials/` - Témoignages
- `/api/v1/media/` - Médiathèque
- `/api/v1/dashboard/` - Dashboard stats

**Installation** :

```bash
cd V2/BACKEND

# Créer environnement virtuel
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Installer dépendances
pip install -r requirements.txt

# Configuration base de données
# Créer base PostgreSQL "ascendys_connect_db"

# Appliquer migrations
python manage.py migrate

# Créer superutilisateur
python manage.py createsuperuser

# Lancer serveur
python manage.py runserver
# API disponible sur http://127.0.0.1:8000
```

**Configuration** :

Créer `.env` à la racine du BACKEND :

```env
# Django
SECRET_KEY=votre-secret-key-ici
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=ascendys_connect_db
DB_USER=postgres
DB_PASSWORD=votre-mot-de-passe
DB_HOST=localhost
DB_PORT=5432

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-app-password
EMAIL_USE_TLS=True

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 👥 Rôles & Permissions

| Fonctionnalité | USER | ADMIN | SUPER_ADMIN |
|----------------|------|-------|-------------|
| Voir dashboard | ❌ | ✅ | ✅ |
| Gérer formations | ❌ | ✅ | ✅ |
| Gérer blog | ❌ | ✅ | ✅ |
| Gérer événements | ❌ | ✅ | ✅ |
| Gérer services | ❌ | ✅ | ✅ |
| Gérer témoignages | ❌ | ✅ | ✅ |
| **Gérer utilisateurs** | ❌ | ❌ | ✅ |
| **Médiathèque** | ❌ | ❌ | ✅ |
| **Infos entreprise** | ❌ | ❌ | ✅ |
| **Journaux d'activité** | ❌ | ❌ | ✅ |
| **Paramètres système** | ❌ | ❌ | ✅ |

---

## 🔒 Sécurité

### Credentials par défaut

**⚠️ À CHANGER EN PRODUCTION !**

```
Email: admin@ascendysconnect.com
Password: admin123
```

### Bonnes pratiques appliquées

- ✅ JWT avec refresh tokens
- ✅ Mots de passe hashés (PBKDF2)
- ✅ CORS configuré
- ✅ CSRF protection
- ✅ Rate limiting (à configurer)
- ✅ Validation des entrées
- ✅ Permissions basées sur les rôles
- ✅ Logs d'activité
- ✅ Variables sensibles dans .env (jamais commitées)

---

## 📊 Base de données

### Modèle de données (28 tables)

**Utilisateurs & Auth** :
- User (email, role, statut)
- Token (JWT blacklist)

**Contenu** :
- Training (formations)
- Category (catégories formations)
- BlogPost (articles)
- BlogCategory, BlogTag
- Event (événements)
- Service (services)
- Offer (offres)
- Testimonial (témoignages)
- Partner (partenaires)

**Système** :
- CompanyInfo (infos entreprise - singleton)
- MediaFile (fichiers uploadés)
- ContactMessage (messages contact)
- NewsletterSubscriber (abonnés)
- ActivityLog (logs activité)

---

## 📚 Documentation API

Après lancement du backend :

- **Swagger UI** : http://127.0.0.1:8000/api/docs/
- **ReDoc** : http://127.0.0.1:8000/api/redoc/
- **Schema JSON** : http://127.0.0.1:8000/api/schema/

---

## 🧪 Tests

### Backend
```bash
cd V2/BACKEND
python manage.py test
```

### Frontend
```bash
cd V2/FRONTEND/ascendys
npm run test  # (à configurer)
```

---

## 📦 Déploiement

### Production Checklist

**Backend** :
- [ ] `DEBUG=False` dans settings
- [ ] Secret key sécurisée (générer nouvelle)
- [ ] ALLOWED_HOSTS configuré
- [ ] Database PostgreSQL production
- [ ] Collectstatic (`python manage.py collectstatic`)
- [ ] Migrations appliquées
- [ ] HTTPS activé
- [ ] Variables d'environnement sécurisées
- [ ] Logs configurés
- [ ] Backup automatique DB

**Frontend** :
- [ ] Build production (`npm run build`)
- [ ] Variables d'environnement production
- [ ] CDN pour assets statiques
- [ ] Analytics configuré
- [ ] SEO vérifié
- [ ] Performance optimisée (Lighthouse)

### Hébergement recommandé

**Backend** :
- Railway
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Heroku

**Frontend** :
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

**Database** :
- Railway (PostgreSQL)
- Supabase
- AWS RDS
- DigitalOcean Managed Database

---

## 🛠️ Technologies utilisées

### Frontend
- React 19
- TypeScript 5.7
- Vite 8
- Tailwind CSS v4
- React Router v7
- Axios
- React Hook Form
- Zustand (state)

### Backend
- Django 5.0.1
- Django REST Framework 3.14.0
- PostgreSQL 18
- djangorestframework-simplejwt
- django-cors-headers
- Pillow
- drf-spectacular

### DevOps
- Git
- npm / pip
- Vite (dev server)
- Django dev server

---

## 📞 Contact & Support

**Entreprise** : Ascendys Connect  
**Site web** : https://ascendysconnect.com  
**Email** : contact@ascendysconnect.com  
**Téléphone** : +225 XX XX XX XX XX  
**Localisation** : Abidjan, Côte d'Ivoire

---

## 📄 Licence

**Proprietary** - © 2024 Ascendys Connect. Tous droits réservés.

Ce code est la propriété exclusive d'Ascendys Connect. Toute reproduction, distribution ou modification sans autorisation écrite est strictement interdite.

---

## 👨‍💻 Équipe de développement

Développé avec ❤️ par l'équipe Ascendys Connect.

**Stack utilisée** : Django REST Framework + React + TypeScript + PostgreSQL

---

## 📝 Notes de version

### V2.0.0 (Actuelle)
- ✅ Backend Django REST complet (13 apps)
- ✅ Frontend React admin dashboard
- ✅ Authentification JWT
- ✅ Gestion multi-rôles
- ✅ CRUD complet sur toutes les entités
- ✅ Médiathèque avec upload
- ✅ Paramètres système
- ✅ Journaux d'activité

### V1.0.0
- ✅ Site vitrine Next.js
- ✅ Pages institutionnelles
- ✅ SEO optimisé

---

## 🚧 Roadmap

### Phase 3 (À venir)
- [ ] Frontend public (site vitrine dynamique)
- [ ] Système de paiement (formations payantes)
- [ ] Espace membre (suivi formations)
- [ ] Certificats de formation
- [ ] Forum communautaire
- [ ] Notifications push
- [ ] Application mobile (React Native)
- [ ] Analytics avancés

---

**Dernière mise à jour** : Septembre 2026  
**Version** : 2.0.0
