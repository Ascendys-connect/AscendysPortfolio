import { UserRole } from "@/types/auth.types";
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  PageIcon,
  BoxCubeIcon,
  PieChartIcon,
} from "@/icons";

export type MenuItem = {
  name: string;
  key: string;
  icon: React.ReactNode;
  path?: string;
  roles: UserRole[]; // Roles allowed to see this menu
  new?: boolean;
  target?: string;
  subItems?: {
    name: string;
    key: string;
    path: string;
    roles: UserRole[];
    new?: boolean;
    pro?: boolean;
    target?: string;
  }[];
};

/**
 * Main navigation items for Ascendys Connect
 * Each item has a 'roles' array that defines which roles can see it
 */
export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    icon: <GridIcon fontSize={24} />,
    name: "Dashboard",
    key: "dashboard",
    path: "/dashboard",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
  },
  {
    icon: <UserCircleIcon fontSize={24} />,
    name: "Utilisateurs",
    key: "users",
    roles: [UserRole.SUPER_ADMIN], // Only SUPER_ADMIN can see
    subItems: [
      {
        name: "Liste des utilisateurs",
        key: "usersList",
        path: "/users",
        roles: [UserRole.SUPER_ADMIN],
      },
      {
        name: "Créer un utilisateur",
        key: "createUser",
        path: "/users/create",
        roles: [UserRole.SUPER_ADMIN],
      },
    ],
  },
  {
    name: "Formations",
    key: "trainings",
    icon: <ListIcon fontSize={24} />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
    subItems: [
      {
        name: "Liste des formations",
        key: "trainingsList",
        path: "/admin/trainings",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Créer une formation",
        key: "createTraining",
        path: "/admin/trainings/create",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Catégories",
        key: "trainingCategories",
        path: "/admin/trainings/categories",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
    ],
  },
  {
    name: "Blog",
    key: "blog",
    icon: <PageIcon fontSize={24} />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
    subItems: [
      {
        name: "Articles",
        key: "blogPosts",
        path: "/admin/blog/posts",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Créer un article",
        key: "createPost",
        path: "/admin/blog/posts/create",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Catégories",
        key: "blogCategories",
        path: "/admin/blog/categories",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Tags",
        key: "blogTags",
        path: "/admin/blog/tags",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
    ],
  },
  {
    icon: <CalenderIcon fontSize={24} />,
    name: "Événements",
    key: "events",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
    subItems: [
      {
        name: "Liste des événements",
        key: "eventsList",
        path: "/admin/events",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Créer un événement",
        key: "createEvent",
        path: "/admin/events/create",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Calendrier",
        key: "eventsCalendar",
        path: "/admin/events/calendar",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
    ],
  },
  {
    name: "Services",
    key: "services",
    icon: <BoxCubeIcon fontSize={24} />,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
    subItems: [
      {
        name: "Liste des services",
        key: "servicesList",
        path: "/admin/services",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
      {
        name: "Créer un service",
        key: "createService",
        path: "/admin/services/create",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR],
      },
    ],
  },
];

/**
 * Secondary navigation items (Contenu & Système)
 */
export const CONTENT_MENU_ITEMS: MenuItem[] = [
  {
    icon: <BoxCubeIcon fontSize={24} />,
    name: "Témoignages",
    key: "testimonials",
    path: "/testimonials",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    icon: <BoxCubeIcon fontSize={24} />,
    name: "Partenaires",
    key: "partners",
    path: "/partners",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    icon: <BoxCubeIcon fontSize={24} />,
    name: "Offres d'emploi",
    key: "offers",
    path: "/admin/offers",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    icon: <PageIcon fontSize={24} />,
    name: "Messages",
    key: "messages",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    subItems: [
      {
        name: "Contacts",
        key: "contactMessages",
        path: "/messages/contacts",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
      {
        name: "Newsletter",
        key: "newsletter",
        path: "/messages/newsletter",
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      },
    ],
  },
];

/**
 * System menu items (Only for SUPER_ADMIN)
 */
export const SYSTEM_MENU_ITEMS: MenuItem[] = [
  {
    icon: <PieChartIcon fontSize={24} />,
    name: "Statistiques Globales",
    key: "globalAnalytics",
    path: "/analytics",
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    icon: <PieChartIcon fontSize={24} />,
    name: "Médiathèque",
    key: "media",
    path: "/media",
    roles: [UserRole.SUPER_ADMIN], // Only SUPER_ADMIN
  },
  {
    icon: <ListIcon fontSize={24} />,
    name: "Informations",
    key: "company",
    path: "/company",
    roles: [UserRole.SUPER_ADMIN], // Only SUPER_ADMIN
  },
  {
    icon: <PieChartIcon fontSize={24} />,
    name: "Logs d'activité",
    key: "activityLogs",
    path: "/logs",
    roles: [UserRole.SUPER_ADMIN], // Only SUPER_ADMIN
  },
  {
    icon: <BoxCubeIcon fontSize={24} />,
    name: "Paramètres",
    key: "settings",
    path: "/settings",
    roles: [UserRole.SUPER_ADMIN], // Only SUPER_ADMIN
  },
];

/**
 * Filter menu items based on user role
 */
export const filterMenuByRole = (
  items: MenuItem[],
  userRole: UserRole
): MenuItem[] => {
  return items
    .filter((item) => item.roles.includes(userRole))
    .map((item) => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter((subItem) =>
            subItem.roles.includes(userRole)
          ),
        };
      }
      return item;
    });
};
