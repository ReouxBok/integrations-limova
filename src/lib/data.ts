import agent1 from "@/assets/avatars/agent-1.png";
import agent2 from "@/assets/avatars/agent-2.png";
import agent3 from "@/assets/avatars/agent-3.png";
import agent4 from "@/assets/avatars/agent-4.png";
import agent5 from "@/assets/avatars/agent-5.png";
import agent6 from "@/assets/avatars/agent-6.png";
import agent7 from "@/assets/avatars/agent-7.png";
import agent8 from "@/assets/avatars/agent-8.png";

export type ContentType = 'video' | 'text' | 'document' | 'image';

export interface Tutorial {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  type: ContentType;
  content: string; // URL for video/image/document, or text content
  duration?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  avatar: string;
  color: string;
  tutorials: Tutorial[];
}

export const agents: Agent[] = [
  {
    id: "charly",
    name: "Charly",
    role: {
      fr: "Assistante de Direction",
      en: "Executive Assistant"
    },
    description: {
      fr: "Gère tâches variées et organisation pour simplifier ton quotidien pro.",
      en: "Manages various tasks and organization to simplify your professional daily life."
    },
    avatar: agent1,
    color: "bg-blue-500",
    tutorials: [
      {
        id: "charly-1",
        title: { fr: "Premiers pas avec Charly", en: "Getting started with Charly" },
        description: { fr: "Découvrez comment configurer et utiliser Charly", en: "Learn how to configure and use Charly" },
        type: "video",
        content: "",
        duration: "5 min"
      },
      {
        id: "charly-2",
        title: { fr: "Organiser votre agenda", en: "Organize your schedule" },
        description: { fr: "Apprenez à gérer efficacement votre calendrier", en: "Learn to manage your calendar efficiently" },
        type: "text",
        content: "Guide complet sur l'organisation de votre agenda..."
      }
    ]
  },
  {
    id: "john",
    name: "John",
    role: {
      fr: "Assistant Marketing",
      en: "Marketing Assistant"
    },
    description: {
      fr: "Anime tes réseaux et rédige tes articles pour améliorer ton rayonnement online.",
      en: "Manages your social networks and writes your articles to improve your online presence."
    },
    avatar: agent2,
    color: "bg-purple-500",
    tutorials: [
      {
        id: "john-1",
        title: { fr: "Créer du contenu engageant", en: "Create engaging content" },
        description: { fr: "Techniques pour créer du contenu qui captive", en: "Techniques to create captivating content" },
        type: "video",
        content: "",
        duration: "8 min"
      }
    ]
  },
  {
    id: "lou",
    name: "Lou",
    role: {
      fr: "Assistante SEO",
      en: "SEO Assistant"
    },
    description: {
      fr: "Audite ton SEO, crée tes présentations pour maximiser ton impact digital.",
      en: "Audits your SEO, creates your presentations to maximize your digital impact."
    },
    avatar: agent3,
    color: "bg-orange-500",
    tutorials: [
      {
        id: "lou-1",
        title: { fr: "Audit SEO complet", en: "Complete SEO Audit" },
        description: { fr: "Comment réaliser un audit SEO de A à Z", en: "How to perform a complete SEO audit" },
        type: "document",
        content: "",
        duration: "15 min"
      }
    ]
  },
  {
    id: "elio",
    name: "Elio",
    role: {
      fr: "Assistant Commercial",
      en: "Sales Assistant"
    },
    description: {
      fr: "Aide à prospecter, convaincre et transformer tes leads en nouveaux clients.",
      en: "Helps prospect, convince and convert your leads into new customers."
    },
    avatar: agent4,
    color: "bg-violet-500",
    tutorials: [
      {
        id: "elio-1",
        title: { fr: "Prospection efficace", en: "Effective prospecting" },
        description: { fr: "Maîtrisez l'art de la prospection commerciale", en: "Master the art of sales prospecting" },
        type: "video",
        content: "",
        duration: "10 min"
      }
    ]
  },
  {
    id: "tom",
    name: "Tom",
    role: {
      fr: "Assistant Relation Client",
      en: "Customer Relations Assistant"
    },
    description: {
      fr: "Répond aux questions clients et assure un suivi personnalisé au quotidien.",
      en: "Answers customer questions and provides personalized daily follow-up."
    },
    avatar: agent5,
    color: "bg-cyan-500",
    tutorials: [
      {
        id: "tom-1",
        title: { fr: "Service client excellence", en: "Customer service excellence" },
        description: { fr: "Les clés d'un service client irréprochable", en: "Keys to impeccable customer service" },
        type: "video",
        content: "",
        duration: "7 min"
      }
    ]
  },
  {
    id: "manue",
    name: "Manue",
    role: {
      fr: "Assistante Comptable",
      en: "Accounting Assistant"
    },
    description: {
      fr: "Suit ta comptabilité, gère factures et paiements pour plus de sérénité.",
      en: "Tracks your accounting, manages invoices and payments for peace of mind."
    },
    avatar: agent6,
    color: "bg-yellow-500",
    tutorials: [
      {
        id: "manue-1",
        title: { fr: "Gestion des factures", en: "Invoice management" },
        description: { fr: "Automatisez la gestion de vos factures", en: "Automate your invoice management" },
        type: "video",
        content: "",
        duration: "6 min"
      }
    ]
  },
  {
    id: "julia",
    name: "Julia",
    role: {
      fr: "Assistante Juridique",
      en: "Legal Assistant"
    },
    description: {
      fr: "Apporte clarté et rigueur à tes contrats, documents et questions légales.",
      en: "Brings clarity and rigor to your contracts, documents and legal questions."
    },
    avatar: agent7,
    color: "bg-amber-600",
    tutorials: [
      {
        id: "julia-1",
        title: { fr: "Rédiger un contrat", en: "Draft a contract" },
        description: { fr: "Les bases de la rédaction contractuelle", en: "Basics of contract drafting" },
        type: "document",
        content: "",
        duration: "12 min"
      }
    ]
  },
  {
    id: "rony",
    name: "Rony",
    role: {
      fr: "Assistant Recrutement",
      en: "Recruitment Assistant"
    },
    description: {
      fr: "Identifie, sélectionne et accompagne les talents pour renforcer ton équipe.",
      en: "Identifies, selects and supports talents to strengthen your team."
    },
    avatar: agent8,
    color: "bg-slate-500",
    tutorials: [
      {
        id: "rony-1",
        title: { fr: "Sourcing de talents", en: "Talent sourcing" },
        description: { fr: "Trouvez les meilleurs profils pour votre équipe", en: "Find the best profiles for your team" },
        type: "video",
        content: "",
        duration: "9 min"
      }
    ]
  }
];

export const getAgent = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};
