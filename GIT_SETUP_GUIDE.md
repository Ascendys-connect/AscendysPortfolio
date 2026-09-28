# 🚀 Guide de Configuration Git & Push

Ce guide vous accompagne pour initialiser Git et pusher le projet de manière sécurisée.

---

## ⚠️ IMPORTANT - Vérifications de sécurité

### ✅ Fichiers sensibles IGNORÉS par Git

Les fichiers suivants sont **automatiquement exclus** grâce aux `.gitignore` :

**Backend** :
- ✅ `.env` (mots de passe, clés secrètes)
- ✅ `db.sqlite3` (base de données)
- ✅ `media/` (fichiers uploadés)
- ✅ `venv/` (environnement virtuel Python)
- ✅ `__pycache__/` (cache Python)

**Frontend** :
- ✅ `.env` (configuration API)
- ✅ `node_modules/` (dépendances npm)
- ✅ `dist/` (build de production)

**Fichiers `.env.example` créés** :
- ✅ `V2/BACKEND/.env.example` (modèle sans secrets)
- ✅ `V2/FRONTEND/ascendys/.env.example` (modèle sans secrets)

---

## 📋 Étape 1 : Vérification avant Git

### 1.1 Vérifier que .env n'existe PAS dans le projet

```powershell
# Vérifier backend
if (Test-Path "V2\BACKEND\.env") {
    Write-Host "⚠️ ATTENTION: Le fichier .env existe dans le backend"
    Write-Host "Contenu (masqué):"
    Get-Content "V2\BACKEND\.env" | ForEach-Object { 
        if ($_ -match "PASSWORD|SECRET|KEY") {
            Write-Host "  [LIGNE SENSIBLE MASQUÉE]"
        } else {
            Write-Host "  $_"
        }
    }
} else {
    Write-Host "✅ Pas de fichier .env dans le backend"
}

# Vérifier frontend
if (Test-Path "V2\FRONTEND\ascendys\.env") {
    Write-Host "⚠️ ATTENTION: Le fichier .env existe dans le frontend"
    Get-Content "V2\FRONTEND\ascendys\.env"
} else {
    Write-Host "✅ Pas de fichier .env dans le frontend"
}
```

### 1.2 Si .env existe, vérifier qu'il sera ignoré

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio"

# Tester si .env serait ignoré
git check-ignore V2/BACKEND/.env
git check-ignore V2/FRONTEND/ascendys/.env

# Si les commandes affichent les chemins, c'est bon ✅
# Si rien ne s'affiche, c'est DANGEREUX ❌
```

---

## 📋 Étape 2 : Initialiser Git

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio"

# Initialiser le repository
git init

# Vérifier la configuration
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"

# OU configurer globalement
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

---

## 📋 Étape 3 : Ajouter les fichiers (SÉCURISÉ)

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio"

# Ajouter tous les fichiers (les .env sont automatiquement ignorés)
git add .

# Vérifier ce qui va être commité
git status

# ⚠️ VÉRIFIER QU'AUCUN FICHIER .env N'APPARAÎT !
# ⚠️ VÉRIFIER QU'AUCUN FICHIER venv/ node_modules/ n'APPARAÎT !
```

### ✅ Ce que vous DEVEZ voir dans `git status`

```
✅ README.md
✅ .gitignore
✅ V2/BACKEND/.env.example  ← EXEMPLE sans secrets
✅ V2/BACKEND/apps/
✅ V2/BACKEND/config/
✅ V2/BACKEND/manage.py
✅ V2/FRONTEND/ascendys/src/
✅ V2/FRONTEND/ascendys/package.json
✅ V2/FRONTEND/ascendys/.env.example  ← EXEMPLE sans secrets
```

### ❌ Ce que vous NE DEVEZ PAS voir

```
❌ V2/BACKEND/.env  ← FICHIER SENSIBLE
❌ V2/BACKEND/venv/
❌ V2/BACKEND/media/
❌ V2/BACKEND/db.sqlite3
❌ V2/FRONTEND/ascendys/.env  ← FICHIER SENSIBLE
❌ V2/FRONTEND/ascendys/node_modules/
❌ V2/FRONTEND/ascendys/dist/
```

**🚨 SI VOUS VOYEZ UN FICHIER .env, ARRÊTEZ ET FAITES** :

```powershell
# Retirer le fichier du staging
git reset V2/BACKEND/.env
git reset V2/FRONTEND/ascendys/.env

# Vérifier que .gitignore contient bien .env
Get-Content .gitignore | Select-String ".env"
```

---

## 📋 Étape 4 : Premier Commit

```powershell
# Créer le commit initial
git commit -m "Initial commit: Ascendys Connect Platform V2

- Backend Django REST API (13 apps)
- Frontend React Admin Dashboard
- Documentation complète
- Configuration sécurisée (.env.example)
"
```

---

## 📋 Étape 5 : Configurer le Remote (GitHub/GitLab)

### Option A : GitHub

```powershell
# Créer un nouveau repo sur https://github.com/new
# Puis exécuter :

git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/ascendys-connect.git
git push -u origin main
```

### Option B : GitLab

```powershell
# Créer un nouveau projet sur https://gitlab.com/projects/new
# Puis exécuter :

git branch -M main
git remote add origin https://gitlab.com/VOTRE-USERNAME/ascendys-connect.git
git push -u origin main
```

### Option C : Autre service

```powershell
git branch -M main
git remote add origin VOTRE_URL_GIT_ICI
git push -u origin main
```

---

## 📋 Étape 6 : Push sécurisé

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio"

# Vérifier une dernière fois le statut
git status

# Pusher vers le remote
git push -u origin main

# Si demande d'authentification :
# - GitHub : Utiliser un Personal Access Token (pas le mot de passe)
# - GitLab : Utiliser un Personal Access Token
```

---

## 🔒 Vérification Post-Push

Après le push, allez sur votre repository GitHub/GitLab et **VÉRIFIEZ** :

### ✅ Ce qui DOIT être présent

- ✅ `README.md` à la racine
- ✅ `.gitignore` à la racine
- ✅ `V2/BACKEND/.env.example`
- ✅ `V2/FRONTEND/ascendys/.env.example`
- ✅ Code source complet
- ✅ Documentation

### ❌ Ce qui NE DOIT PAS être présent

- ❌ `V2/BACKEND/.env` 🚨
- ❌ `V2/FRONTEND/ascendys/.env` 🚨
- ❌ Dossier `venv/`
- ❌ Dossier `node_modules/`
- ❌ Fichiers `db.sqlite3`
- ❌ Dossier `media/` avec fichiers uploadés

---

## 🚨 En cas de problème : Fichier sensible pusher par erreur

### Si vous avez pusher un fichier .env par erreur :

```powershell
# 1. Supprimer le fichier de l'historique Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch V2/BACKEND/.env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push (ATTENTION : dangereux si d'autres personnes ont cloné)
git push origin --force --all

# 3. CHANGER IMMÉDIATEMENT tous les secrets exposés :
# - SECRET_KEY Django
# - Mots de passe base de données
# - Clés API
# - Tokens
```

**⚠️ IMPORTANT** : Une fois qu'un secret est exposé sur GitHub/GitLab, considérez-le comme compromis MÊME APRÈS SUPPRESSION. GitHub garde un historique.

---

## 📝 Workflow Git quotidien

### Ajouter des modifications

```powershell
cd "E:\ASCENDYS-CONNECT Portfolio"

# Voir les fichiers modifiés
git status

# Ajouter des fichiers spécifiques
git add V2/BACKEND/apps/accounts/views.py
git add V2/FRONTEND/ascendys/src/components/NewComponent.tsx

# Ou tout ajouter
git add .

# Commit
git commit -m "feat: add new feature X"

# Push
git push
```

### Branches pour nouvelles fonctionnalités

```powershell
# Créer une branche
git checkout -b feature/nom-fonctionnalite

# Travailler sur la branche
git add .
git commit -m "work on feature"

# Pousser la branche
git push -u origin feature/nom-fonctionnalite

# Fusionner dans main (après review)
git checkout main
git merge feature/nom-fonctionnalite
git push
```

---

## 🔐 Sécurité : Checklist finale

Avant chaque push, vérifiez :

- [ ] ✅ Aucun fichier `.env` dans `git status`
- [ ] ✅ Aucun mot de passe hardcodé dans le code
- [ ] ✅ Aucune clé API hardcodée
- [ ] ✅ `.gitignore` à jour
- [ ] ✅ Fichiers `.env.example` à jour (sans secrets)
- [ ] ✅ Pas de fichiers `node_modules/` ou `venv/`
- [ ] ✅ Pas de base de données `.db` ou `.sqlite3`

---

## 📞 Support

En cas de problème avec Git, consultez :
- [GitHub Docs](https://docs.github.com/)
- [GitLab Docs](https://docs.gitlab.com/)
- [Git Documentation](https://git-scm.com/doc)

---

**Dernière mise à jour** : Septembre 2026  
**Sécurité** : ✅ Vérifié - Aucun secret exposé
