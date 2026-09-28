# 📚 Ascendys Connect API - Documentation

## 🌐 Base URL
```
Development: http://127.0.0.1:8000/api/v1/
Production: https://api.ascendysconnect.com/api/v1/
```

## 🔐 Authentication

### JWT Token Authentication
Tous les endpoints nécessitant une authentification utilisent JWT Bearer tokens.

**Header requis:**
```
Authorization: Bearer <access_token>
```

### Endpoints d'authentification

#### Register (POST /auth/register/)
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login (POST /auth/login/)
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "USER"
    }
  }
}
```

## 📊 Modules & Endpoints

### 1. **Trainings** (`/trainings/`)
- `GET /trainings/` - Liste des formations
- `GET /trainings/{slug}/` - Détail d'une formation
- `GET /trainings/categories/` - Liste des catégories
- `POST /trainings/{id}/publish/` - Publier (admin)
- `POST /trainings/{id}/archive/` - Archiver (admin)

### 2. **Blog** (`/blog/`)
- `GET /blog/posts/` - Liste des articles
- `GET /blog/posts/{slug}/` - Détail d'un article
- `GET /blog/categories/` - Liste des catégories
- `GET /blog/tags/` - Liste des tags
- `POST /blog/posts/{id}/publish/` - Publier (admin)

### 3. **Events** (`/events/`)
- `GET /events/` - Liste des événements
- `GET /events/{slug}/` - Détail d'un événement
- `GET /events/upcoming/` - Événements à venir
- `GET /events/featured/` - Événements mis en avant
- `POST /events/{id}/mark_ongoing/` - Marquer en cours (admin)

### 4. **Services** (`/services/`)
- `GET /services/` - Liste des services
- `GET /services/{slug}/` - Détail d'un service
- `GET /services/featured/` - Services mis en avant
- `POST /services/{id}/toggle_featured/` - Mise en avant (admin)

### 5. **Contact & Newsletter** (`/contact/`)
- `POST /contact/messages/` - Envoyer un message (public)
- `GET /contact/messages/` - Liste des messages (admin)
- `POST /contact/messages/{id}/mark_resolved/` - Résoudre (admin)
- `POST /contact/newsletter/subscribe/` - S'abonner (public)
- `POST /contact/newsletter/unsubscribe/` - Se désabonner (public)

### 6. **Media Library** (`/media/`)
- `GET /media/` - Liste des fichiers (admin)
- `POST /media/` - Upload fichier (admin, max 50MB)
- `DELETE /media/{id}/` - Supprimer (admin)
- `GET /media/stats/` - Statistiques (admin)

### 7. **Dashboard** (`/dashboard/`)
- `GET /dashboard/stats/` - Statistiques globales (admin)
- `GET /dashboard/charts/` - Données graphiques (admin)
- `GET /dashboard/activity-logs/` - Logs d'activité (admin)

### 8. **Search & SEO** (`/search/`)
- `GET /search/?q=keyword` - Recherche globale (public)
- `GET /search/sitemap/` - Données sitemap (public)
- `GET /search/seo-meta/` - Métadonnées SEO (public)

### 9. **Company** (`/company/`)
- `GET /company/` - Informations de l'entreprise (public)
- `PUT /company/` - Mettre à jour (admin)

### 10. **Testimonials & Partners**
- `GET /testimonials/` - Liste des témoignages (public)
- `GET /testimonials/featured/` - Témoignages mis en avant
- `GET /partners/` - Liste des partenaires (public)
- `GET /partners/featured/` - Partenaires mis en avant

## 🔍 Filtrage & Pagination

### Pagination
Tous les endpoints de liste supportent la pagination:
```
GET /trainings/?page=2&page_size=10
```

**Response:**
```json
{
  "count": 45,
  "next": "http://.../api/v1/trainings/?page=3",
  "previous": "http://.../api/v1/trainings/?page=1",
  "results": [...]
}
```

### Filtres
```
# Par statut
GET /blog/posts/?status=PUBLISHED

# Par catégorie
GET /trainings/?category={id}

# Par date
GET /events/?date_from=2024-01-01&date_to=2024-12-31

# Recherche
GET /trainings/?search=python

# Tri
GET /blog/posts/?ordering=-created_at
```

### Filtres avancés
```
# Derniers 7 jours
GET /contact/messages/?last_7_days=true

# Ce mois
GET /blog/posts/?this_month=true

# Prix
GET /trainings/?min_price=50000&max_price=200000
```

## ⚡ Rate Limiting

### Utilisateurs authentifiés
- **Burst:** 60 requêtes/minute
- **Sustained:** 1000 requêtes/jour

### Utilisateurs anonymes
- **Burst:** 20 requêtes/minute
- **Sustained:** 100 requêtes/jour

### Endpoints spéciaux
- **Contact form:** 5 soumissions/heure
- **Newsletter:** 3 soumissions/heure

## 🛡️ Permissions

### Niveaux d'accès
1. **Public** - Lecture seule pour contenu publié
2. **USER** - Utilisateur authentifié
3. **ADMIN** - Administrateur (création, modification)
4. **SUPER_ADMIN** - Super administrateur (toutes permissions)

## 📝 Format des réponses

### Succès
```json
{
  "success": true,
  "message": "Opération réussie",
  "data": { ... }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": {
    "field": ["Message d'erreur détaillé"]
  }
}
```

## 🔗 Documentation interactive

- **Swagger UI:** http://127.0.0.1:8000/api/docs/
- **ReDoc:** http://127.0.0.1:8000/api/redoc/
- **OpenAPI Schema:** http://127.0.0.1:8000/api/schema/

## 🚀 Exemples d'utilisation

### cURL
```bash
# Login
curl -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get trainings
curl -X GET http://127.0.0.1:8000/api/v1/trainings/ \
  -H "Authorization: Bearer {token}"
```

### JavaScript (Fetch)
```javascript
// Login
const login = async () => {
  const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'admin123'
    })
  });
  const data = await response.json();
  return data.data.access;
};

// Get trainings
const getTrainings = async (token) => {
  const response = await fetch('http://127.0.0.1:8000/api/v1/trainings/', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

### Python (Requests)
```python
import requests

# Login
response = requests.post(
    'http://127.0.0.1:8000/api/v1/auth/login/',
    json={
        'email': 'admin@example.com',
        'password': 'admin123'
    }
)
token = response.json()['data']['access']

# Get trainings
response = requests.get(
    'http://127.0.0.1:8000/api/v1/trainings/',
    headers={'Authorization': f'Bearer {token}'}
)
trainings = response.json()
```

## 🔧 Codes d'erreur HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable (Maintenance)

## 📞 Support

- Email: support@ascendysconnect.com
- Documentation: https://docs.ascendysconnect.com
- GitHub: https://github.com/ascendys-connect
