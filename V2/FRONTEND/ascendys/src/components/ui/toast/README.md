# Toast Notifications

Système de notifications toast pour afficher des messages informatifs, de succès, d'erreur ou d'avertissement à l'utilisateur.

## Utilisation

### 1. Import du hook

```tsx
import { useToast } from "@/context/ToastContext";
```

### 2. Dans votre composant

```tsx
function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleAction = async () => {
    try {
      // Votre logique...
      showSuccess("Succès", "L'opération a été effectuée avec succès");
    } catch (error) {
      showError("Erreur", "Une erreur est survenue");
    }
  };

  return <button onClick={handleAction}>Action</button>;
}
```

## Méthodes disponibles

### `showSuccess(title, message, duration?)`
Affiche un toast de succès (vert).
- **title**: Titre du toast
- **message**: Message détaillé
- **duration**: Durée d'affichage en ms (défaut: 5000)

```tsx
showSuccess("Utilisateur créé", "Le nouvel utilisateur a été créé avec succès");
```

### `showError(title, message, duration?)`
Affiche un toast d'erreur (rouge).
- **title**: Titre du toast
- **message**: Message détaillé
- **duration**: Durée d'affichage en ms (défaut: 7000)

```tsx
showError("Erreur de connexion", "Email ou mot de passe incorrect");
```

### `showWarning(title, message, duration?)`
Affiche un toast d'avertissement (orange).
- **title**: Titre du toast
- **message**: Message détaillé
- **duration**: Durée d'affichage en ms (défaut: 6000)

```tsx
showWarning("Attention", "Cette action est irréversible");
```

### `showInfo(title, message, duration?)`
Affiche un toast d'information (bleu).
- **title**: Titre du toast
- **message**: Message détaillé
- **duration**: Durée d'affichage en ms (défaut: 5000)

```tsx
showInfo("Information", "Les modifications seront appliquées dans quelques instants");
```

### `showToast(options)`
Méthode générique pour afficher un toast personnalisé.

```tsx
showToast({
  type: 'success',
  title: 'Mon titre',
  message: 'Mon message',
  duration: 3000
});
```

### `hideToast(id)`
Ferme manuellement un toast spécifique (rarement utilisé car les toasts se ferment automatiquement).

## Exemples pratiques

### Création d'utilisateur

```tsx
const handleCreateUser = async (userData: UserData) => {
  try {
    showInfo("Création en cours", "Création du nouvel utilisateur...");
    await userService.create(userData);
    showSuccess("Utilisateur créé", `${userData.email} a été créé avec succès`);
  } catch (error: any) {
    showError("Erreur de création", error.message || "Impossible de créer l'utilisateur");
  }
};
```

### Suppression avec confirmation

```tsx
const handleDelete = async (id: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
    try {
      await deleteItem(id);
      showSuccess("Suppression réussie", "L'élément a été supprimé");
    } catch (error) {
      showError("Erreur", "Impossible de supprimer l'élément");
    }
  }
};
```

### Validation de formulaire

```tsx
const validateForm = () => {
  if (!email) {
    showError("Email requis", "Veuillez entrer votre adresse email");
    return false;
  }
  
  if (!isValidEmail(email)) {
    showWarning("Email invalide", "Veuillez entrer une adresse email valide");
    return false;
  }
  
  return true;
};
```

## Configuration

Le `ToastProvider` est déjà configuré dans `src/main.tsx` et entoure toute l'application.

## Positionnement

Les toasts apparaissent en **haut à droite** de l'écran et se superposent les uns sous les autres.

## Accessibilité

- Les toasts utilisent `role="alert"` pour l'accessibilité
- Le conteneur utilise `aria-live="polite"` pour annoncer les changements
- Bouton de fermeture avec `aria-label="Fermer"`

## Durées par défaut

- **Success**: 5 secondes
- **Error**: 7 secondes (plus long pour lire les messages d'erreur)
- **Warning**: 6 secondes
- **Info**: 5 secondes

Vous pouvez personnaliser la durée pour chaque toast en passant le paramètre `duration`.
