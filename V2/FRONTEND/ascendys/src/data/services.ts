export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: string[];
};

const services: Service[] = [
  {
    id: "ingenierie",
    title: "Ingénierie & Solutions Techniques",
    description:
      "Conception, déploiement et maintenance de vos infrastructures IT avec les meilleurs standards du secteur.",
    icon: "Network",
    items: [
      "Réseaux d'entreprise (LAN, WAN, Wi-Fi)",
      "Systèmes, virtualisation, stockage",
      "Téléphonie IP & communications unifiées",
      "Continuité d'activité (PCA / PRA)",
    ],
  },
  {
    id: "conseil",
    title: "Conseil – Audit – Expertise",
    description:
      "Audit complet de vos systèmes, diagnostic de performance et conseil stratégique pour orienter vos investissements IT.",
    icon: "BarChart3",
    items: [
      "Audit IT & Digital",
      "Diagnostic de performance et optimisation",
      "Conseil stratégique IT",
      "Fractional CTO / CISO",
    ],
  },
  {
    id: "securite",
    title: "Sécurité Informatique & Défense Active",
    description:
      "Protection proactive de vos systèmes d'information contre les menaces modernes et les cyberattaques.",
    icon: "ShieldCheck",
    items: [
      "Antivirus & EDR professionnels",
      "Détection d'intrusion",
      "Monitoring et alertes",
      "Résilience et reprise d'activité",
    ],
  },
  {
    id: "digital",
    title: "Informatique & Solutions Digitales",
    description:
      "Accompagnement de la transformation numérique de votre organisation, du cloud à l'automatisation.",
    icon: "Cloud",
    items: [
      "Maintenance informatique",
      "Cloud & collaboration",
      "Digitalisation des processus",
      "Outils métiers et automatisation",
    ],
  },
  {
    id: "formation",
    title: "Formation & Renforcement de capacités",
    description:
      "Programmes de formation professionnelle intensifs, orientés terrain et axés sur les livrables concrets.",
    icon: "GraduationCap",
    items: [
      "Formations techniques professionnelles",
      "Programmes Express orientés terrain",
      "Formation IT & Digital orientée livrables",
    ],
  },
];

export default services;
