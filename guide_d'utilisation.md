# Guide d'utilisation — Ascendys Connect

> Ce guide explique comment utiliser le site public et l'espace d'administration d'**Ascendys Connect**, pas à pas.

| | |
|---|---|
| **Public visé** | Visiteurs, éditeurs, administrateurs |
| **Version** | 1.0 |
| **Dernière mise à jour** | 23/10/2026 |

---

## Sommaire

1. [Le site public](#1-le-site-public)
2. [Accéder à l'espace d'administration](#2-accéder-à-lespace-dadministration)
3. [Les rôles et leurs droits](#3-les-rôles-et-leurs-droits)
4. [Le tableau de bord](#4-le-tableau-de-bord)
5. [Gérer les formations](#5-gérer-les-formations)
6. [Gérer les inscriptions et les paiements](#6-gérer-les-inscriptions-et-les-paiements)
7. [Gérer le blog](#7-gérer-le-blog)
8. [Gérer les événements](#8-gérer-les-événements)
9. [Gérer les services](#9-gérer-les-services)
10. [Gérer les offres](#10-gérer-les-offres)
11. [Gérer les témoignages](#11-gérer-les-témoignages)
12. [Gérer les partenaires](#12-gérer-les-partenaires)
13. [Gérer les médiathèques](#13-gérer-les-médiathèques)
14. [Gérer les messages et la newsletter](#14-gérer-les-messages-et-la-newsletter)
15. [Notifications et diffusion](#15-notifications-et-diffusion)
16. [Gérer les utilisateurs](#16-gérer-les-utilisateurs)
17. [Informations de l'entreprise](#17-informations-de-lentreprise)
18. [Statistiques et logs](#18-statistiques-et-logs)
19. [Profil et sécurité du compte](#19-profil-et-sécurité-du-compte)
20. [Bonnes pratiques](#20-bonnes-pratiques)
21. [Dépannage / FAQ](#21-dépannage--faq)

---

## 1. Le site public

Le site public est accessible à l'adresse fournie par l'administrateur (en développement : <http://localhost:5173/>).

### Navigation

Le menu principal propose :

| Section | Adresse | Contenu |
|---|---|---|
| **Accueil** | `/` | Présentation, services, formations, témoignages, actualités |
| **À propos** | `/about` | Présentation de l'entreprise |
| **Services** | `/services` | Les 5 domaines d'intervention |
| **Formations** | `/trainings` | Catalogue des formations |
| **Blog** | `/blog` | Articles et actualités |
| **Galerie** | `/gallery` | Photos et vidéos |
| **Contact** | `/contact` | Formulaire de contact |

### Consulter une formation

1. Cliquer sur **Formations** dans le menu.
2. Parcourir les cartes ou utiliser les filtres.
3. Cliquer sur une formation pour voir le détail (objectifs, programme, prérequis, tarif, dates…).
4. Cliquer sur **S'inscrire** pour accéder au formulaire.

### S'inscrire et payer

1. Renseigner le formulaire d'inscription : nom complet, email, téléphone, niveau d'études.
2. Valider : l'inscription est créée avec le statut **En attente de paiement**.
3. Sur la page de paiement, cliquer sur **Payer maintenant**.
4. Être redirigé vers **FedaPay** et effectuer le paiement.
5. Après confirmation, la page de succès s'affiche ; l'inscription passe à **Payé**.

> L'inscription expire automatiquement après **48 heures** si le paiement n'est pas effectué. Il est alors possible de recommencer.

### Contacter l'entreprise

1. Aller sur **Contact**.
2. Remplir le formulaire (nom, email, téléphone, entreprise, sujet, message).
3. Cocher le consentement de confidentialité.
4. Envoyer : un accusé et une notification administrateur sont générés.

### S'abonner à la newsletter

Saisir son email dans le bloc newsletter (pied de page ou page Contact), puis valider.

### Consulter la galerie

- Les galeries de **photos** s'ouvrent dans une visionneuse.
- Les galeries **vidéo** affichent un aperçu avec un bouton **Lecture** ; cliquer dessus lance la vidéo.

---

## 2. Accéder à l'espace d'administration

### Connexion

1. Ouvrir `<adresse-du-site>/signin`.
2. Saisir **email** et **mot de passe**.
3. Cliquer sur **Se connecter**.

### Première connexion (vérification OTP)

Lors de la première connexion, un **code à 6 chiffres** est envoyé par email :

1. Saisir le code reçu sur la page de vérification.
2. Le code est valable **15 minutes**.
3. En cas de non-réception, utiliser **Renvoyer le code**.

### Changement de mot de passe obligatoire

Après la vérification, le système demande de **définir un nouveau mot de passe**. Choisir un mot de passe robuste (au moins 8 caractères, avec majuscules, chiffres et symboles).

### Mot de passe oublié

1. Sur la page de connexion, cliquer sur **Mot de passe oublié**.
2. Saisir son email.
3. Recevoir un code à 6 chiffres, le vérifier, puis définir un nouveau mot de passe.

### Se déconnecter

Cliquer sur son avatar/profil en haut à droite, puis **Déconnexion**.

---

## 3. Les rôles et leurs droits

| Rôle | Peut faire | Ne peut pas faire |
|---|---|---|
| **SUPER_ADMIN** | Tout : contenus, utilisateurs, entreprise, logs, paramètres | — |
| **ADMIN** | Gérer les contenus, inscriptions, offres, témoignages, partenaires, statistiques | Gérer les utilisateurs, l'entreprise, les logs, les paramètres |
| **EDITOR** | Gérer les formations, le blog, les événements, les services, les médiathèques | Gérer les offres, témoignages, partenaires, utilisateurs |

> Le menu latéral s'adapte automatiquement au rôle : les sections non autorisées sont masquées.

---

## 4. Le tableau de bord

Après connexion, la page **Dashboard** (`/dashboard`) affiche une vue d'ensemble :

- nombre de formations, d'inscriptions, de messages, d'articles, d'événements ;
- graphiques d'activité (inscriptions, paiements, contenus) ;
- dernières activités.

Utiliser le menu latéral pour accéder aux différents modules.

---

## 5. Gérer les formations

### Créer une formation

1. Menu **Formations → Créer une formation**.
2. Renseigner :
   - **Titre**, **description courte**, **description complète** ;
   - **Catégorie** (créer une catégorie si nécessaire) ;
   - **Image de couverture** (obligatoire) et bannière (facultative) ;
   - **Objectifs**, **prérequis**, **public cible**, **programme** ;
   - **Durée**, **niveau**, **mode** (en ligne, présentiel, hybride) ;
   - **Prix** et **devise** ;
   - **Dates** de début et de fin, **lieu**, **formateur**, **capacité** ;
   - contenus marketing : pour qui, problèmes résolus, livrables, compétences, inclus/non inclus, modalités de paiement…
   - **Certification** (oui/non).
3. Enregistrer.

### Publier une formation

Une formation créée est en **brouillon**. Pour la rendre visible :

- utiliser l'action **Publier** depuis la liste, ou
- passer son **statut** à **Publié**.

Une formation **archivée** n'apparaît plus sur le site public.

### Modifier ou supprimer

- **Modifier** : ouvrir la formation → corriger → enregistrer.
- **Supprimer** : l'élément est retiré du site (suppression douce) ; contacter un SUPER_ADMIN pour une restauration.

### Gérer les catégories

Menu **Formations → Catégories** : créer, modifier, supprimer les catégories (nom, description, ordre).

### Consulter les inscriptions

Menu **Formations → Inscriptions & Abonnements**.

---

## 6. Gérer les inscriptions et les paiements

La page **Inscriptions** liste les inscrits avec leur statut.

| Statut | Signification | Action possible |
|---|---|---|
| **En attente de paiement** | Formulaire rempli, paiement non commencé | Relancer / attendre |
| **Paiement en cours** | Redirection FedaPay effectuée | Attendre le webhook |
| **Payé** | Paiement confirmé | Accès à la formation |
| **Échec** | Paiement refusé | Réessayer |
| **Annulé** | Annulé | Réessayer |
| **Expiré** | Plus de 48 h sans paiement | Nouvelle inscription |

Actions disponibles selon les droits :

- consulter le détail d'une inscription ;
- **envoyer une relance** de paiement ;
- **réessayer** le paiement ;
- traiter les relances en attente (action groupée).

> Les relances automatiques sont envoyées à **1 h**, **24 h** et **7 jours**.

---

## 7. Gérer le blog

### Créer un article

1. Menu **Blog → Créer un article**.
2. Renseigner : **titre**, **extrait**, **contenu**, **catégorie**, **tags**, **image de couverture**, éventuellement une **vidéo**.
3. Enregistrer, puis **publier**.

### Catégories et tags

Menus **Blog → Catégories** et **Blog → Tags** : créer, modifier ou supprimer.

> Un article en brouillon n'est pas visible sur le site public.

---

## 8. Gérer les événements

1. Menu **Événements → Créer un événement**.
2. Renseigner : **titre**, **description**, **type** (conférence, atelier, webinaire, formation, salon…), **image**, **lieu**, **dates et heures**, **capacité**, **URL d'inscription**, **mise en avant**.
3. Enregistrer et publier.

Le **Calendrier** (`Événements → Calendrier`) offre une vue mensuelle des événements planifiés.

---

## 9. Gérer les services

1. Menu **Services → Créer un service**.
2. Renseigner : **titre**, **description courte**, **description complète**, **icône** (SVG/PNG), **image**, **fonctionnalités** (liste), **SEO**.
3. Enregistrer et publier.

Les services actifs et publiés apparaissent dans la section **Nos domaines d'intervention**.

---

## 10. Gérer les offres

> Accessible aux **SUPER_ADMIN** et **ADMIN**.

1. Menu **Offres d'emploi → Créer une offre**.
2. Renseigner : **titre**, **descriptions**, **type** (formation, promotion, événement, recrutement, annonce, autre), **image/bannière**, **dates**, **SEO**.
3. Enregistrer et publier.

---

## 11. Gérer les témoignages

> Accessible aux **SUPER_ADMIN** et **ADMIN**.

1. Menu **Témoignages → Ajouter un témoignage**.
2. Renseigner : **nom**, **fonction**, **entreprise**, **photo**, **contenu**, **note** (1 à 5), **mise en avant**, **ordre** d'affichage.
3. Publier pour afficher sur le site.

Utiliser l'action **Publier / Dépublier** depuis la liste pour basculer rapidement la visibilité.

---

## 12. Gérer les partenaires

> Accessible aux **SUPER_ADMIN** et **ADMIN**.

1. Menu **Partenaires → Ajouter un partenaire**.
2. Renseigner : **nom**, **logo**, **site web**, **description**, **mise en avant**, **ordre**.
3. Activer le partenaire pour l'afficher.

---

## 13. Gérer les médiathèques

Une médiathèque contient **soit jusqu'à 5 photos, soit une seule vidéo**.

### Créer une médiathèque de photos

1. Menu **Médiathèques → Créer une médiathèque**.
2. Choisir le type **Photos**.
3. Renseigner le **titre**, la **description**.
4. Ajouter **1 à 5 photos**.
5. Enregistrer, puis **publier**.

### Créer une médiathèque vidéo

1. Choisir le type **Vidéo**.
2. Renseigner le **titre**, la **description**.
3. Téléverser **une vidéo** (formats : `mp4`, `webm`, `mov`, `avi`).
4. Enregistrer, puis **publier**.

> Pour un démarrage rapide de la lecture, privilégier des vidéos **MP4 H.264** avec l'option *faststart* (index en début de fichier) et une résolution raisonnable.

### Modifier les photos ou la vidéo

1. Menu **Médiathèques** → cliquer sur **Modifier** sur la galerie concernée.
2. Dans la fenêtre d'édition :
   - **Photos** : remplacer une photo existante, la supprimer, ou ajouter une nouvelle photo (compteur `x/5`).
   - **Vidéo** : remplacer le fichier vidéo.
3. Les nouveaux fichiers sont signalés par un badge **« Nouvelle »** / **« Nouvelle vidéo »**.
4. Enregistrer.

Règles importantes :

- Il est **impossible de supprimer la dernière photo** d'une galerie.
- Il est **impossible de supprimer la seule vidéo** d'une galerie vidéo.
- Un média remplacé ou supprimé est retiré du stockage.

### Aperçu

- Dans l'admin, chaque vidéo affiche une **vignette avec bouton Lecture**.
- Sur le site public, la galerie vidéo affiche le même aperçu ; cliquer sur **Lecture** démarre la vidéo.
- Les photos s'ouvrent en grand dans une visionneuse.

### Publier / dépublier

Utiliser l'interrupteur ou l'action **Publier / Dépublier** depuis la liste. Seules les galeries publiées apparaissent sur le site.

---

## 14. Gérer les messages et la newsletter

### Messages de contact

Menu **Messages → Contacts**.

- Consulter la liste des messages reçus.
- Ouvrir un message pour voir le détail.
- Changer son **statut** : Nouveau → En cours → Résolu → Fermé.
- Ajouter des **notes internes**.
- Assigner le message à un membre de l'équipe.

### Newsletter

Menu **Messages → Newsletter**.

- Consulter les abonnés (email, nom, statut).
- Vérifier si l'email est **vérifié** et **actif**.
- Désabonner un contact si nécessaire.

---

## 15. Notifications et diffusion

### Consulter les notifications

Menu **Notifications** : liste des notifications (paiements, contacts, newsletter, système).

- Cliquer sur une notification pour ouvrir l'élément concerné.
- Marquer comme **lu / non lu**.
- Utiliser **Tout marquer comme lu** ou **Supprimer les lues**.

Le compteur de non-lues s'affiche dans la barre de navigation.

### Diffuser un message

> Accessible aux **SUPER_ADMIN** et **ADMIN**.

1. Menu **Diffusion de messages**.
2. Renseigner le **titre**, le **message**, éventuellement un **lien**.
3. Choisir le ou les **destinataires** (rôles ou utilisateurs).
4. Envoyer.

Chaque destinataire reçoit une notification de type **Message diffusé**.

---

## 16. Gérer les utilisateurs

> Réservé au **SUPER_ADMIN**.

### Créer un utilisateur

1. Menu **Utilisateurs → Créer un utilisateur**.
2. Renseigner : **prénom**, **nom**, **email**, **téléphone**, **rôle**, **mot de passe temporaire**.
3. Enregistrer : l'utilisateur devra vérifier son email (OTP) et changer son mot de passe à la première connexion.

### Modifier / désactiver / supprimer

- **Modifier** : changer les informations ou le rôle.
- **Activer/Désactiver** : un compte désactivé ne peut plus se connecter.
- **Supprimer** : suppression logique (le compte est désactivé et marqué supprimé).

> Ne jamais partager un compte. Créer un compte nominatif par collaborateur.

---

## 17. Informations de l'entreprise

> Réservé au **SUPER_ADMIN**.

Menu **Informations** (`/company`).

Modifier :

- nom, slogan, descriptions ;
- logo, favicon ;
- email, téléphones, adresse, ville, pays ;
- site web et réseaux sociaux ;
- année de création, mission, vision, valeurs ;
- horaires d'ouverture.

Ces informations alimentent le site public (pied de page, page À propos, contact).

---

## 18. Statistiques et logs

### Statistiques globales

> Accessible aux **SUPER_ADMIN** et **ADMIN**.

Menu **Statistiques globales** (`/analytics`) : vues d'ensemble sur les contenus, les inscriptions et l'activité.

### Logs d'activité

> Réservé au **SUPER_ADMIN**.

Menu **Logs d'activité** (`/logs`) : historique des créations, modifications, suppressions, connexions et exports, avec utilisateur, IP et date.

---

## 19. Profil et sécurité du compte

### Modifier son profil

Menu **Profil** (`/profile`) : changer prénom, nom, téléphone, photo.

### Changer son mot de passe

Depuis le profil ou via l'endpoint dédié, saisir l'ancien mot de passe puis le nouveau.

### Bonnes pratiques de mot de passe

- Au moins 8 caractères.
- Mélanger majuscules, minuscules, chiffres et symboles.
- Ne pas réutiliser un mot de passe d'un autre service.
- Ne jamais communiquer son mot de passe.

---

## 20. Bonnes pratiques

### Publication de contenu

- Toujours relire avant de **publier**.
- Vérifier le **titre**, la **description courte** et l'**image** (format paysage recommandé).
- Renseigner les champs **SEO** (titre ≤ 60 caractères, description ≤ 160 caractères).
- Utiliser des **slugs** clairs (générés automatiquement à partir du titre).
- Dépublier plutôt que supprimer pour conserver l'historique.

### Images

- Utiliser des images de bonne qualité mais légères (JPG/WebP, largeur ~1200–1600 px).
- Éviter les fichiers de plusieurs Mo.
- Vérifier les droits d'utilisation des images.

### Vidéos

- Format **MP4 (H.264)**, avec *faststart*.
- Résolution 720p ou 1080p.
- Éviter les vidéos de plus de 50 Mo si la connexion est lente.

### Sécurité

- Se déconnecter sur les ordinateurs partagés.
- Ne pas partager les accès.
- Signaler toute activité suspecte à un SUPER_ADMIN.

---

## 21. Dépannage / FAQ

### Je ne reçois pas le code OTP

- Vérifier les **spams** / courriers indésirables.
- Vérifier que l'adresse email est correcte.
- Attendre quelques minutes puis **Renvoyer le code**.
- Contacter un administrateur si le problème persiste.

### Je suis déconnecté sans raison

- La session a peut-être expiré (jeton expiré).
- Se reconnecter.
- Si le problème est récurrent, vider le cache du navigateur puis se reconnecter.

### Une page reste vide ou affiche une erreur

- Vérifier la connexion internet.
- Recharger la page (Ctrl + F5).
- Vérifier que le serveur backend est démarré (en développement).

### Le paiement n'a pas été confirmé

- Le paiement peut prendre quelques instants (webhook).
- Vérifier le statut dans **Formations → Inscriptions**.
- Si le statut reste « En attente » après paiement, contacter le support avec l'email et la référence.

### Je ne vois pas ma page « Paramètres système »

Cette page est présente dans le menu mais son backend n'est pas encore branché. Les paramètres généraux se trouvent pour l'instant dans **Informations** (`/company`).

### Je ne peux pas supprimer la dernière photo d'une médiathèque

C'est une protection volontaire : une galerie doit conserver au moins un média. Ajoutez d'abord une nouvelle photo, puis supprimez l'ancienne.

### Un contenu n'apparaît pas sur le site public

Vérifier :

1. le **statut** (doit être **Publié**) ;
2. la case **Actif** (services, partenaires) ;
3. la case **Publié** (galeries, témoignages) ;
4. que la date de publication n'est pas dans le futur.

### Comment voir le site sur mon téléphone en développement ?

1. PC et téléphone sur le **même Wi-Fi**.
2. Trouver l'IP du PC avec `ipconfig` (ex. `192.168.1.42`).
3. Backend : ajouter `http://192.168.1.42:5173` à `CORS_ALLOWED_ORIGINS`, puis `python manage.py runserver 0.0.0.0:8000`.
4. Frontend : mettre `VITE_API_BASE_URL=http://192.168.1.42:8000/api/v1`, puis `npm run dev -- --host`.
5. Autoriser Node.js et Python dans le pare-feu Windows.
6. Ouvrir `http://192.168.1.42:5173` sur le téléphone.

---

## Support

Pour toute question ou problème :

- contacter l'administrateur de la plateforme ;
- préciser la page concernée, l'action effectuée et, si possible, une capture d'écran.

---

### Voir aussi

- [`documentation_détaillé.md`](./documentation_détaillé.md) — documentation technique complète.
