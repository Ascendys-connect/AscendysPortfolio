export type PremiumOption = {
  title: string;
  price?: string;
  items: string[];
};

export type Formation = {
  slug: string;
  category: "IT & Digital" | "Conseil & Transformation" | "Transversales & Innovation";
  title: string;
  shortTitle: string;
  level: string;
  duration: string;
  sessions: string;
  format: string;
  price: string;
  priceRaw: number;
  targetAudience: string[];
  problem: string[];
  deliverablesTitle: string;
  deliverables: string[];
  skills: string[];
  transformation: { from: string; to: string };
  included: string[];
  notIncluded: string[];
  paymentOptions: string[];
  premiumOptions: PremiumOption[];
  maxPlaces: number;
  prerequisites?: string[];
  strategicPositioning: string[];
  ctaText: string;
};

const formations: Formation[] = [
  // ─── 1. MAINTENANCE INFORMATIQUE ───────────────────────────────────────────
  {
    slug: "maintenance-informatique",
    category: "IT & Digital",
    title: "Formation Maintenance Informatique",
    shortTitle: "Maintenance Informatique",
    level: "Technicien Support & Maintenance",
    duration: "4 semaines",
    sessions: "12 sessions de 2h (3/semaine) ou 6 sessions de 4h (week-end)",
    format: "Présentiel uniquement",
    price: "55 000 F CFA",
    priceRaw: 55000,
    targetAudience: [
      "Vous débutez en informatique ou souhaitez acquérir une compétence pratique et recherchée",
      "Vous voulez travailler comme technicien support, agent IT ou prestataire indépendant",
      "Vous êtes étudiant, en reconversion ou autodidacte",
      "Vous savez utiliser un ordinateur mais ne comprenez pas encore comment il fonctionne réellement",
      "Vous voulez une formation concrète, pratique et orientée emploi",
    ],
    problem: [
      "Utilisent l'ordinateur sans comprendre ses composants",
      "Ne savent pas diagnostiquer une panne simple",
      "Ont peur de « casser » le matériel en intervenant",
      "Dépendent toujours de quelqu'un d'autre pour résoudre les problèmes",
      "Ne peuvent pas monétiser leurs compétences faute de méthode",
    ],
    deliverablesTitle: "À la fin de ces 4 semaines, vous aurez :",
    deliverables: [
      "Une méthodologie claire de diagnostic de pannes matérielles et logicielles",
      "La capacité de monter, démonter et entretenir un ordinateur",
      "Une check-list professionnelle de maintenance préventive et corrective",
      "La maîtrise des interventions courantes en environnement professionnel",
      "Un plan de progression pour évoluer vers l'administration système ou réseau",
    ],
    skills: [
      "Identifier rapidement l'origine d'une panne informatique",
      "Installer et configurer un système d'exploitation",
      "Sécuriser un poste utilisateur",
      "Assister efficacement les utilisateurs (support niveau 1)",
      "Intervenir avec méthode, sans improvisation",
    ],
    transformation: {
      from: "Je sais utiliser un ordinateur",
      to: "Je sais diagnostiquer, réparer et maintenir un poste informatique",
    },
    included: [
      "Bases matérielles : composants, montage, entretien",
      "Systèmes d'exploitation : installation et configuration",
      "Maintenance logicielle et optimisation",
      "Diagnostic de pannes réelles (cas pratiques)",
      "Sécurité de base des postes utilisateurs",
      "Exercices pratiques guidés pas à pas",
      "Groupe WhatsApp d'entraide et de suivi",
    ],
    notIncluded: [
      "Réparation électronique avancée",
      "Administration serveur",
      "Placement direct en entreprise",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la dernière semaine",
    ],
    premiumOptions: [
      {
        title: "Pack Pratique Avancé",
        items: [
          "Labs supplémentaires sur pannes complexes",
          "Simulations d'interventions en entreprise",
          "Guide « Devenir technicien freelance »",
        ],
      },
      {
        title: "Pack Orientation Pro",
        items: [
          "Coaching collectif : débouchés & évolution de carrière",
          "Recommandations de spécialisations (système, réseau, sécurité)",
          "Préparation à l'intégration professionnelle",
        ],
      },
    ],
    maxPlaces: 15,
    strategicPositioning: [
      "Une porte d'entrée idéale vers les métiers IT",
      "Un socle obligatoire avant Administration Système ou Réseau",
      "Une compétence directement monétisable",
    ],
    ctaText: "Inscrivez-vous maintenant",
  },

  // ─── 2. ADMINISTRATION SYSTÈME ─────────────────────────────────────────────
  {
    slug: "administration-systeme",
    category: "IT & Digital",
    title: "Formation Administration Système",
    shortTitle: "Administration Système",
    level: "Administrateur Systèmes Junior",
    duration: "4 semaines",
    sessions: "12 sessions de 2h (3/semaine) ou 6 sessions de 4h (week-end)",
    format: "À distance ou en présentiel",
    price: "80 000 F CFA",
    priceRaw: 80000,
    targetAudience: [
      "Vous avez des bases en informatique ou avez suivi la formation Maintenance Informatique",
      "Vous souhaitez gérer des serveurs et systèmes en environnement professionnel",
      "Vous voulez évoluer vers des rôles d'administrateur systèmes ou ingénieur systèmes",
      "Vous êtes technicien support et voulez monter en compétences",
      "Vous cherchez une formation pratique et structurée",
    ],
    prerequisites: [
      "Participants ayant suivi la formation Maintenance Informatique",
      "Personnes disposant déjà de bases équivalentes (validation du profil si nécessaire)",
    ],
    problem: [
      "Utilisent les serveurs sans comprendre leur fonctionnement réel",
      "Appliquent des configurations sans logique globale",
      "Ne savent pas sécuriser correctement un système",
      "Ont peur des erreurs critiques en production",
      "Dépendent d'autres personnes pour les décisions techniques",
    ],
    deliverablesTitle: "À la fin de ces 4 semaines, vous aurez :",
    deliverables: [
      "Une méthodologie claire d'administration système",
      "La capacité d'installer, configurer et maintenir un serveur",
      "Une check-list professionnelle d'exploitation système",
      "Des procédures de base de sauvegarde et restauration",
      "Une vision claire des responsabilités d'un administrateur systèmes",
    ],
    skills: [
      "Installer et administrer un système serveur",
      "Gérer les utilisateurs, droits et accès",
      "Surveiller la santé d'un système",
      "Appliquer les bases de la sécurité système",
      "Intervenir avec méthode en environnement professionnel",
    ],
    transformation: {
      from: "Je configure sans toujours comprendre",
      to: "Je maîtrise et j'exploite un système de manière professionnelle",
    },
    included: [
      "Introduction aux systèmes (Windows Server / Linux)",
      "Installation et configuration serveur",
      "Gestion des utilisateurs, groupes et permissions",
      "Services essentiels (DNS, DHCP, Active Directory, fichiers, impression, accès distant)",
      "Sauvegarde, restauration et supervision",
      "Sécurité de base des systèmes",
      "Labs pratiques en environnement virtualisé",
      "Groupe WhatsApp d'entraide et suivi",
    ],
    notIncluded: [
      "Administration avancée ou cloud",
      "Haute disponibilité et clustering",
      "Gestion d'infrastructure à grande échelle",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la dernière semaine",
    ],
    premiumOptions: [
      {
        title: "Pack Labs Avancés",
        price: "35 000 F CFA",
        items: [
          "Scénarios supplémentaires de pannes systèmes",
          "Cas pratiques inspirés d'environnements réels",
          "Exercices de sécurisation avancée",
        ],
      },
      {
        title: "Pack Évolution Pro",
        price: "50 000 F CFA",
        items: [
          "Coaching collectif : évolution de carrière",
          "Orientation vers Réseau, Sécurité ou Cloud",
          "Préparation à la certification (optionnel)",
        ],
      },
    ],
    maxPlaces: 12,
    strategicPositioning: [
      "Un socle indispensable avant Réseau et Sécurité",
      "Directement exploitable en entreprise",
      "Prépare à des rôles à responsabilité technique",
    ],
    ctaText: "Prenez le contrôle de vos systèmes",
  },

  // ─── 3. ADMINISTRATION RÉSEAU — CCNA ──────────────────────────────────────
  {
    slug: "administration-reseau-ccna",
    category: "IT & Digital",
    title: "Administration Réseau – CCNA 200-301",
    shortTitle: "Réseau CCNA 200-301",
    level: "Administrateur Réseau (CCNA 200-301)",
    duration: "8 semaines",
    sessions: "16 sessions de 2h (2/semaine) ou 8 sessions de 4h (week-end)",
    format: "À distance ou en présentiel",
    price: "180 000 F CFA",
    priceRaw: 180000,
    targetAudience: [
      "Vous souhaitez comprendre et gérer des réseaux informatiques professionnels",
      "Vous visez un poste d'administrateur réseau ou d'ingénieur réseau junior",
      "Vous préparez la certification Cisco CCNA (200-301)",
      "Vous avez suivi Administration Système ou disposez de bases équivalentes",
      "Vous voulez une formation structurée, pratique et reconnue mondialement",
    ],
    prerequisites: [
      "Accessible à toute personne souhaitant acquérir ou structurer des compétences en réseaux",
      "Aucun diplôme spécifique requis",
      "La formation est progressive et inclut une mise à niveau",
    ],
    problem: [
      "Se perdent entre vidéos, documents et tutos sans fil conducteur",
      "Connectent des équipements sans comprendre la logique réseau",
      "Ne savent pas diagnostiquer une panne de connectivité",
      "Configurent des équipements « par copier-coller »",
      "Ne maîtrisent pas les bases indispensables (IP, VLAN, routage)",
      "Se sentent dépassés face à une infrastructure réseau réelle",
      "Ont peur de la certification CCNA, jugée trop technique ou complexe",
    ],
    deliverablesTitle: "À la fin de ces 8 semaines, vous aurez :",
    deliverables: [
      "Une compréhension complète des réseaux informatiques modernes",
      "La capacité de concevoir, configurer et dépanner un réseau LAN/WAN",
      "Des labs pratiques Packet Tracer reproduisant des cas réels",
      "Une méthodologie de dépannage réseau claire et professionnelle",
      "Une préparation solide à l'examen Cisco CCNA 200-301",
    ],
    skills: [
      "Comprendre et configurer l'adressage IP (IPv4 / IPv6)",
      "Mettre en place des VLANs et inter-VLAN",
      "Configurer le routage de base et les protocoles essentiels",
      "Sécuriser un réseau (ACL, concepts de base sécurité)",
      "Comprendre les bases du réseau sans fil et de l'automatisation",
      "Diagnostiquer et résoudre les pannes réseau",
    ],
    transformation: {
      from: "Le réseau, c'est flou pour moi",
      to: "Je comprends, je configure et je dépanne un réseau professionnel",
    },
    included: [
      "Cours théoriques simplifiés et accessibles",
      "Programme aligné sur le contenu officiel Cisco CCNA (à jour)",
      "Labs pratiques guidés pas à pas (Packet Tracer & scénarios réels)",
      "Exercices pratiques chaque semaine",
      "Études de cas inspirées d'environnements professionnels",
      "Simulations complètes de réseaux d'entreprise",
      "Groupe WhatsApp pour le suivi et l'entraide",
    ],
    notIncluded: [
      "Routage avancé (niveau CCNP)",
      "Passage de l'examen officiel Cisco CCNA",
      "Coaching individuel illimité après la formation",
      "Garantie d'emploi ou placement automatique",
    ],
    paymentOptions: [
      "En un seul versement",
      "70 % à l'inscription et 30 % avant la 6ᵉ semaine",
    ],
    premiumOptions: [
      {
        title: "Pack Labs Avancés",
        price: "30 000 F CFA",
        items: [
          "Labs supplémentaires de dépannage réseau",
          "Scénarios proches d'environnements réels",
          "Corrections détaillées",
        ],
      },
      {
        title: "Pack Certification CCNA",
        price: "50 000 F CFA + 300 USD (si passage d'examen)",
        items: [
          "Simulations d'examen CCNA",
          "Stratégie de passage à l'examen",
          "Coaching préparation certification",
        ],
      },
    ],
    maxPlaces: 10,
    strategicPositioning: [
      "Alignée sur le standard mondial Cisco CCNA",
      "Un pilier fondamental des métiers IT",
      "Ouvre la voie vers Sécurité, Cloud et Ingénierie Réseau avancée",
    ],
    ctaText: "Devenez administrateur réseau opérationnel",
  },

  // ─── 4. CONSULTANT IT — NIVEAU 1 ───────────────────────────────────────────
  {
    slug: "consultant-it-foundations",
    category: "Conseil & Transformation",
    title: "Devenir Consultant IT/Digital – Niveau 1 : Consultant Foundations",
    shortTitle: "Consultant IT – Foundations",
    level: "Consultant Foundations",
    duration: "4 semaines",
    sessions: "12 sessions de 2h (3/semaine) ou 6 sessions de 4h (week-end)",
    format: "À distance ou en présentiel",
    price: "110 000 F CFA",
    priceRaw: 110000,
    targetAudience: [
      "Vous êtes développeur, professionnel IT ou du digital et voulez passer consultant",
      "Vous voulez lancer votre activité de conseil mais ne savez pas par où commencer",
      "Vous avez des compétences techniques mais aucune expérience commerciale",
      "Vous cherchez une méthodologie claire pour créer votre offre et trouver vos premiers clients",
    ],
    problem: [
      "Perdent 6 à 12 mois à tâtonner sans méthode claire",
      "Ne savent pas comment transformer leurs compétences en offres vendables",
      "Ont peur de prospecter ou de « vendre » leurs services",
      "Ratent des opportunités faute de méthode pour créer une offre, prospecter ou convaincre",
    ],
    deliverablesTitle: "À la fin de ces 4 semaines, vous aurez :",
    deliverables: [
      "Comprendre le rôle d'un consultant IT/Digital et comment il crée de la valeur",
      "Identifier les besoins des entreprises et les transformer en offres concrètes",
      "1 à 2 offres de conseil structurées et prêtes à présenter",
      "Confiance dans la prospection et les techniques de vente",
      "Un plan d'action sur 90 jours pour décrocher vos premiers clients",
    ],
    skills: [
      "Identifier les besoins cachés des entreprises et les transformer en missions",
      "Pitcher votre valeur ajoutée avec confiance, même face à des décideurs",
      "Prospecter efficacement sans être intrusif ni « vendeur de tapis »",
      "Structurer vos propositions commerciales comme un consultant expérimenté",
    ],
    transformation: {
      from: "J'ai des compétences mais je ne sais pas comment les vendre",
      to: "J'ai une offre claire et je sais comment approcher mes clients",
    },
    included: [
      "Cours théoriques simplifiés avec études de cas réels",
      "Exercices pratiques guidés pas à pas",
      "Modèles et templates prêts à l'emploi (offres, emails, propositions)",
      "Labs virtuels : simulations de prospection et pitch clients",
      "Groupe WhatsApp pour l'entraide entre participants",
    ],
    notIncluded: [
      "Coaching individuel illimité après la formation",
      "Accompagnement sur vos missions clients réelles (disponible en option Premium)",
      "Création de site web ou identité visuelle",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la dernière semaine",
    ],
    premiumOptions: [
      {
        title: "Pack Mentorat",
        price: "50 000 F CFA",
        items: [
          "3 mois d'accompagnement post-formation",
          "2 appels coaching/mois (30 min)",
          "Revue de vos propositions clients avant envoi",
          "Accès prioritaire au groupe d'entraide",
        ],
      },
      {
        title: "Pack Accélérateur",
        price: "25 000 F CFA",
        items: [
          "5 labs supplémentaires avancés",
          "Mini-formation « Négociation commerciale pour débutants »",
          "Templates avancés (contrats, factures)",
        ],
      },
    ],
    maxPlaces: 15,
    strategicPositioning: [
      "Dans 4 semaines, vous pourriez être en train de présenter votre première proposition client",
    ],
    ctaText: "Démarrez votre activité de conseil",
  },

  // ─── 5. CONSULTANT IT — NIVEAU 2 ───────────────────────────────────────────
  {
    slug: "consultant-it-elite",
    category: "Conseil & Transformation",
    title: "Devenir Consultant IT/Digital – Niveau 2 : Consultant Elite",
    shortTitle: "Consultant IT – Elite",
    level: "Consultant Elite",
    duration: "6 semaines",
    sessions: "12 sessions de 2h (2/semaine) ou 6 sessions de 4h (week-end intensif)",
    format: "À distance ou en présentiel",
    price: "250 000 F CFA",
    priceRaw: 250000,
    targetAudience: [
      "Vous avez déjà une première expérience en prestation, freelance ou conseil IT/Digital",
      "Vous avez suivi le Niveau 1 : Consultant Foundations",
      "Vous disposez déjà d'une base solide et souhaitez passer à un niveau supérieur",
      "Vous voulez structurer une activité de conseil crédible et durable",
      "Vous souhaitez convaincre des décideurs et signer des contrats à plus forte valeur",
    ],
    prerequisites: [
      "Participants ayant validé le Niveau 1 Consultant Foundations",
      "Professionnels avec une première expérience en conseil ou prestation IT/Digital (validation du profil)",
    ],
    problem: [
      "Ont des revenus irréguliers et imprévisibles",
      "Sous-facturent leurs prestations par manque de méthode",
      "Acceptent des missions mal cadrées et peu rentables",
      "Dépendent trop du bouche-à-oreille",
      "Ne savent pas structurer une relation client long terme",
    ],
    deliverablesTitle: "À la fin de ces 6 semaines, vous aurez :",
    deliverables: [
      "Une offre de conseil premium, claire et différenciante",
      "Un processus de vente structuré, de la qualification à la signature",
      "Une méthodologie de diagnostic client orientée valeur et résultats",
      "Une stratégie de pricing professionnelle (forfait, rétention, récurrence)",
      "Un plan d'acquisition clients sur 6 mois, réaliste et actionnable",
    ],
    skills: [
      "Parler le langage des décideurs et dirigeants",
      "Diagnostiquer rapidement les enjeux d'une organisation",
      "Justifier vos honoraires avec calme et crédibilité",
      "Négocier et conclure des contrats avec méthode",
      "Piloter une relation client rentable et durable",
    ],
    transformation: {
      from: "Je fais des missions quand on m'appelle",
      to: "Je pilote une activité de conseil structurée, crédible et rentable",
    },
    included: [
      "Études de cas réels issus de missions de conseil",
      "Méthodologie de diagnostic et cadrage client",
      "Simulations avancées de rendez-vous décideurs",
      "Templates professionnels (offres premium, propositions, cadrage)",
      "Labs business : pricing, négociation, closing",
      "Groupe WhatsApp Consultant Elite (accès réservé)",
    ],
    notIncluded: [
      "Génération de clients à votre place",
      "Garantie de chiffre d'affaires",
      "Recrutement ou gestion d'équipe opérationnelle",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la 3ᵉ semaine",
    ],
    premiumOptions: [
      {
        title: "Pack Mentorat Elite",
        items: [
          "6 mois d'accompagnement personnalisé",
          "2 sessions de coaching stratégique / mois (45 min)",
          "Relecture et optimisation de vos propositions clients",
          "Support prioritaire sur vos négociations en cours",
        ],
      },
      {
        title: "Pack Scale Consultant",
        items: [
          "Structuration d'offres récurrentes (support, audit, advisory)",
          "Mini-module : Passer du freelance au cabinet de conseil",
          "Templates avancés : contrats cadre, missions longues",
        ],
      },
    ],
    maxPlaces: 10,
    strategicPositioning: [
      "Vous avez déjà les compétences. Vous avez le potentiel.",
      "Transformez vos compétences en activité de conseil structurée et rentable",
    ],
    ctaText: "Passez au niveau Consultant Elite",
  },

  // ─── 6. IA ESSENTIALS — NIVEAU 1 ──────────────────────────────────────────
  {
    slug: "ia-essentials",
    category: "Transversales & Innovation",
    title: "Intelligence Artificielle appliquée aux métiers – Niveau 1 : IA Essentials",
    shortTitle: "IA Essentials – Niveau 1",
    level: "IA Essentials – Découverte & Usage Métier",
    duration: "3 semaines",
    sessions: "9 sessions de 2h (3/semaine) ou 6 sessions de 3h (week-end)",
    format: "En ligne ou présentiel",
    price: "55 000 F CFA",
    priceRaw: 55000,
    targetAudience: [
      "Vous débutez avec l'IA et voulez comprendre comment l'utiliser concrètement",
      "Vous voulez gagner du temps et améliorer vos résultats dans votre activité",
      "Vous êtes professionnel, manager, entrepreneur ou employé motivé",
      "Vous ne connaissez pas la programmation mais souhaitez exploiter l'IA efficacement",
      "Vous cherchez une formation pratique, orientée résultats et immédiatement applicable",
    ],
    problem: [
      "Perdent du temps à tester des outils IA sans méthode",
      "Ne savent pas quelles tâches automatiser",
      "N'exploitent pas le potentiel de l'IA pour améliorer leur travail",
      "Dépendent de prestataires ou de solutions toutes faites",
      "Ne savent pas transformer l'IA en avantage concret",
    ],
    deliverablesTitle: "À la fin de ces 3 semaines, vous aurez :",
    deliverables: [
      "Une méthodologie simple pour identifier les tâches automatisables",
      "Une bibliothèque de prompts prêts à l'emploi",
      "Workflows simples appliqués à votre métier",
      "Un plan d'action pour intégrer l'IA dans votre activité",
    ],
    skills: [
      "Créer et utiliser des prompts efficaces",
      "Automatiser des tâches simples",
      "Améliorer la productivité quotidienne",
      "Intégrer l'IA dans votre organisation de manière pratique",
    ],
    transformation: {
      from: "Je sais que l'IA existe mais je ne sais pas comment l'utiliser",
      to: "Je sais utiliser l'IA pour gagner en efficacité et automatiser des tâches concrètes",
    },
    included: [
      "Concepts clés de l'IA expliqués simplement",
      "Identification des tâches automatisables dans votre métier",
      "Création et utilisation de prompts simples",
      "Cas pratiques métiers (administratif, commercial, technique…)",
      "Exercices guidés pas à pas",
      "Groupe WhatsApp pour entraide et suivi",
    ],
    notIncluded: [
      "Développement IA avancé",
      "Automatisation complexe",
      "Coaching individuel illimité",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la dernière session",
    ],
    premiumOptions: [
      {
        title: "Pack Pratique Avancé",
        price: "25 000 F CFA",
        items: [
          "Workflows supplémentaires",
          "Scénarios métiers plus complexes",
          "Guide « Exploiter l'IA dans votre activité professionnelle »",
        ],
      },
      {
        title: "Pack Orientation Pro",
        price: "35 000 F CFA",
        items: [
          "Coaching collectif : intégration IA dans vos processus",
          "Méthodologie pour scaler l'IA",
          "Conseils stratégiques pour l'organisation",
        ],
      },
    ],
    maxPlaces: 10,
    strategicPositioning: [
      "La porte d'entrée idéale pour utiliser l'IA dans votre métier",
      "Une compétence immédiatement applicable et monétisable",
      "La base nécessaire pour passer au Niveau 2 – IA Avancée",
    ],
    ctaText: "Démarrez votre parcours IA",
  },

  // ─── 7. IA AVANCÉE — NIVEAU 2 ─────────────────────────────────────────────
  {
    slug: "ia-avancee",
    category: "Transversales & Innovation",
    title: "Intelligence Artificielle appliquée aux métiers – Niveau 2 : IA Avancée",
    shortTitle: "IA Avancée – Niveau 2",
    level: "IA Avancée – Automatisation & Pilotage",
    duration: "3 semaines",
    sessions: "9 sessions de 2h (3/semaine) ou 6 sessions de 3h (week-end)",
    format: "En ligne ou présentiel",
    price: "55 000 F CFA",
    priceRaw: 55000,
    targetAudience: [
      "Vous maîtrisez les bases de l'IA et voulez automatiser vos tâches et processus",
      "Vous êtes manager, entrepreneur ou responsable d'équipe",
      "Vous voulez intégrer l'IA dans vos workflows et créer un avantage stratégique",
      "Vous cherchez une méthode structurée pour scaler l'usage de l'IA",
      "Vous voulez passer de l'utilisation individuelle à l'intégration organisationnelle",
    ],
    prerequisites: [
      "Avoir suivi le Niveau 1 : IA Essentials ou maîtriser les bases de l'IA",
    ],
    problem: [
      "Automatisent seulement quelques tâches isolées",
      "Ne savent pas structurer les processus IA dans une équipe ou une entreprise",
      "Dépendent d'outils sans méthodologie claire",
      "Ne mesurent pas l'impact réel de l'IA",
      "Ne peuvent pas créer de valeur stratégique à partir de l'IA",
    ],
    deliverablesTitle: "À la fin de ces 3 semaines, vous aurez :",
    deliverables: [
      "Workflows IA complexes et réutilisables",
      "Méthodologie pour intégrer l'IA dans vos processus métier",
      "Templates de prompts avancés",
      "Plan d'action pour piloter et scaler l'IA dans votre activité ou équipe",
    ],
    skills: [
      "Structurer une stratégie IA organisationnelle",
      "Automatiser des processus complexes",
      "Piloter et sécuriser l'usage de l'IA",
      "Créer un avantage compétitif durable grâce à l'IA",
    ],
    transformation: {
      from: "J'utilise l'IA ponctuellement et de façon isolée",
      to: "L'IA est intégrée dans mes processus, automatisée et pilotée efficacement",
    },
    included: [
      "Workflows avancés et automatisation complexe",
      "Prompts stratégiques et réutilisables",
      "Cas pratiques et simulations organisationnelles",
      "Méthodologie de pilotage et suivi des usages",
      "Exercices guidés pas à pas",
      "Groupe WhatsApp pour entraide et suivi",
    ],
    notIncluded: [
      "Développement IA sur mesure",
      "Projet de data science complexe",
      "Coaching individuel illimité",
    ],
    paymentOptions: [
      "Un seul versement",
      "70 % à l'inscription et 30 % avant la dernière session",
    ],
    premiumOptions: [
      {
        title: "Pack Pratique Avancé",
        items: [
          "Workflows organisationnels supplémentaires",
          "Scénarios d'automatisation avancée",
          "Guide « Piloter l'IA dans une équipe ou entreprise »",
        ],
      },
      {
        title: "Pack Orientation Pro",
        items: [
          "Coaching collectif : adoption et stratégie IA",
          "Méthodologie pour valoriser l'IA dans l'organisation",
          "Conseils stratégiques pour créer un avantage compétitif",
        ],
      },
    ],
    maxPlaces: 10,
    strategicPositioning: [
      "La suite logique du Niveau 1 – cohérente et cumulative",
      "Une compétence stratégique pour manager, consultant ou entrepreneur",
      "Immédiatement applicable pour piloter et automatiser l'IA à l'échelle d'une équipe",
    ],
    ctaText: "Transformez vos acquis IA en avantage stratégique",
  },
];

export default formations;

export const getFormationBySlug = (slug: string): Formation | undefined =>
  formations.find((f) => f.slug === slug);

export const getFormationsByCategory = (
  category: Formation["category"]
): Formation[] => formations.filter((f) => f.category === category);

export const categories: Formation["category"][] = [
  "IT & Digital",
  "Conseil & Transformation",
  "Transversales & Innovation",
];
