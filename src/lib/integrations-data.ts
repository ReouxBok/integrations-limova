export interface IntegrationAction {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  prompt: {
    fr: string;
    en: string;
  };
}

export interface Integration {
  id: string;
  slug: string;
  name: string;
  description: {
    fr: string;
    en: string;
  };
  category: {
    fr: string;
    en: string;
  };
  logoUrl: string;
  isPopular: boolean;
  actions: IntegrationAction[];
}

export const integrationCategories = [
  { id: "all", label: { fr: "Toutes", en: "All" } },
  { id: "productivity", label: { fr: "Productivité", en: "Productivity" } },
  { id: "communication", label: { fr: "Communication", en: "Communication" } },
  { id: "crm", label: { fr: "CRM", en: "CRM" } },
  { id: "database", label: { fr: "Base de données", en: "Database" } },
  { id: "project", label: { fr: "Gestion de projet", en: "Project Management" } },
  { id: "development", label: { fr: "Développement", en: "Development" } },
  { id: "marketing", label: { fr: "Marketing", en: "Marketing" } },
  { id: "payment", label: { fr: "Paiement", en: "Payment" } },
  { id: "forms", label: { fr: "Formulaires", en: "Forms" } },
];

export const integrations: Integration[] = [
  {
    id: "notion",
    slug: "notion",
    name: "Notion",
    description: {
      fr: "Espace de travail tout-en-un pour notes, docs, bases de données et gestion de projet.",
      en: "All-in-one workspace for notes, docs, databases and project management."
    },
    category: { fr: "Productivité", en: "Productivity" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/notion-2.svg",
    isPopular: true,
    actions: [
      {
        id: "create-page",
        name: { fr: "Créer une page", en: "Create a page" },
        description: { fr: "Crée une nouvelle page dans un espace Notion", en: "Create a new page in a Notion workspace" },
        prompt: { fr: "Crée une nouvelle page Notion intitulée [titre] dans l'espace [nom de l'espace]", en: "Create a new Notion page titled [title] in workspace [workspace name]" }
      },
      {
        id: "search-pages",
        name: { fr: "Rechercher des pages", en: "Search pages" },
        description: { fr: "Recherche des pages par mot-clé", en: "Search pages by keyword" },
        prompt: { fr: "Recherche les pages Notion contenant [mot-clé]", en: "Search Notion pages containing [keyword]" }
      },
      {
        id: "read-database",
        name: { fr: "Lire une base de données", en: "Read a database" },
        description: { fr: "Récupère les entrées d'une base de données Notion", en: "Retrieve entries from a Notion database" },
        prompt: { fr: "Récupère toutes les entrées de ma base Notion [nom de la base]", en: "Retrieve all entries from my Notion database [database name]" }
      },
      {
        id: "add-entry",
        name: { fr: "Ajouter une entrée", en: "Add an entry" },
        description: { fr: "Ajoute une nouvelle entrée dans une base de données", en: "Add a new entry to a database" },
        prompt: { fr: "Ajoute une nouvelle entrée dans ma base Notion [nom] avec [propriétés]", en: "Add a new entry to my Notion database [name] with [properties]" }
      },
      {
        id: "update-page",
        name: { fr: "Mettre à jour une page", en: "Update a page" },
        description: { fr: "Met à jour le contenu d'une page existante", en: "Update the content of an existing page" },
        prompt: { fr: "Mets à jour la page Notion [titre ou ID] avec le contenu suivant : [contenu]", en: "Update Notion page [title or ID] with the following content: [content]" }
      }
    ]
  },
  {
    id: "slack",
    slug: "slack",
    name: "Slack",
    description: {
      fr: "Plateforme de messagerie d'équipe pour la collaboration professionnelle.",
      en: "Team messaging platform for professional collaboration."
    },
    category: { fr: "Communication", en: "Communication" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
    isPopular: true,
    actions: [
      {
        id: "send-message",
        name: { fr: "Envoyer un message", en: "Send a message" },
        description: { fr: "Envoie un message dans un canal ou en DM", en: "Send a message to a channel or DM" },
        prompt: { fr: "Envoie le message [contenu] dans le canal Slack [nom du canal]", en: "Send message [content] to Slack channel [channel name]" }
      },
      {
        id: "create-channel",
        name: { fr: "Créer un canal", en: "Create a channel" },
        description: { fr: "Crée un nouveau canal Slack", en: "Create a new Slack channel" },
        prompt: { fr: "Crée un nouveau canal Slack nommé [nom] avec la description [description]", en: "Create a new Slack channel named [name] with description [description]" }
      },
      {
        id: "list-channels",
        name: { fr: "Lister les canaux", en: "List channels" },
        description: { fr: "Récupère la liste des canaux disponibles", en: "Get the list of available channels" },
        prompt: { fr: "Liste tous les canaux Slack de mon workspace", en: "List all Slack channels in my workspace" }
      },
      {
        id: "add-reaction",
        name: { fr: "Ajouter une réaction", en: "Add a reaction" },
        description: { fr: "Ajoute une réaction emoji à un message", en: "Add an emoji reaction to a message" },
        prompt: { fr: "Ajoute la réaction [emoji] au message [ID du message] dans [canal]", en: "Add reaction [emoji] to message [message ID] in [channel]" }
      }
    ]
  },
  {
    id: "google-sheets",
    slug: "google-sheets",
    name: "Google Sheets",
    description: {
      fr: "Tableur collaboratif en ligne de Google.",
      en: "Google's collaborative online spreadsheet."
    },
    category: { fr: "Productivité", en: "Productivity" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/google-sheets-logo-icon.svg",
    isPopular: true,
    actions: [
      {
        id: "read-rows",
        name: { fr: "Lire des lignes", en: "Read rows" },
        description: { fr: "Lit les données d'une plage de cellules", en: "Read data from a cell range" },
        prompt: { fr: "Récupère les données de la feuille [nom] dans la plage [A1:Z100]", en: "Get data from sheet [name] in range [A1:Z100]" }
      },
      {
        id: "add-row",
        name: { fr: "Ajouter une ligne", en: "Add a row" },
        description: { fr: "Ajoute une nouvelle ligne de données", en: "Add a new row of data" },
        prompt: { fr: "Ajoute une nouvelle ligne dans Google Sheets [nom de la feuille] avec les valeurs [valeurs]", en: "Add a new row to Google Sheets [sheet name] with values [values]" }
      },
      {
        id: "update-cell",
        name: { fr: "Mettre à jour une cellule", en: "Update a cell" },
        description: { fr: "Met à jour la valeur d'une cellule spécifique", en: "Update the value of a specific cell" },
        prompt: { fr: "Mets à jour la cellule [référence] de [nom de la feuille] avec la valeur [valeur]", en: "Update cell [reference] in [sheet name] with value [value]" }
      },
      {
        id: "create-sheet",
        name: { fr: "Créer une feuille", en: "Create a sheet" },
        description: { fr: "Crée une nouvelle feuille de calcul", en: "Create a new spreadsheet" },
        prompt: { fr: "Crée une nouvelle feuille Google Sheets nommée [nom]", en: "Create a new Google Sheets spreadsheet named [name]" }
      }
    ]
  },
  {
    id: "gmail",
    slug: "gmail",
    name: "Gmail",
    description: {
      fr: "Service de messagerie électronique de Google.",
      en: "Google's email service."
    },
    category: { fr: "Communication", en: "Communication" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/gmail-icon-1.svg",
    isPopular: true,
    actions: [
      {
        id: "send-email",
        name: { fr: "Envoyer un email", en: "Send an email" },
        description: { fr: "Envoie un nouvel email", en: "Send a new email" },
        prompt: { fr: "Envoie un email à [destinataire] avec le sujet [sujet] et le contenu [contenu]", en: "Send an email to [recipient] with subject [subject] and content [content]" }
      },
      {
        id: "search-emails",
        name: { fr: "Rechercher des emails", en: "Search emails" },
        description: { fr: "Recherche des emails par critères", en: "Search emails by criteria" },
        prompt: { fr: "Recherche les emails contenant [mot-clé] reçus depuis [date]", en: "Search emails containing [keyword] received since [date]" }
      },
      {
        id: "create-draft",
        name: { fr: "Créer un brouillon", en: "Create a draft" },
        description: { fr: "Crée un brouillon d'email", en: "Create an email draft" },
        prompt: { fr: "Crée un brouillon d'email pour [destinataire] avec le sujet [sujet]", en: "Create an email draft for [recipient] with subject [subject]" }
      },
      {
        id: "add-label",
        name: { fr: "Ajouter un libellé", en: "Add a label" },
        description: { fr: "Ajoute un libellé à un email", en: "Add a label to an email" },
        prompt: { fr: "Ajoute le libellé [nom] aux emails correspondant à [critère]", en: "Add label [name] to emails matching [criteria]" }
      }
    ]
  },
  {
    id: "hubspot",
    slug: "hubspot",
    name: "HubSpot",
    description: {
      fr: "Plateforme CRM complète pour le marketing, les ventes et le service client.",
      en: "Complete CRM platform for marketing, sales and customer service."
    },
    category: { fr: "CRM", en: "CRM" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/hubspot-1.svg",
    isPopular: true,
    actions: [
      {
        id: "create-contact",
        name: { fr: "Créer un contact", en: "Create a contact" },
        description: { fr: "Crée un nouveau contact dans HubSpot", en: "Create a new contact in HubSpot" },
        prompt: { fr: "Crée un nouveau contact HubSpot avec l'email [email] et le nom [nom]", en: "Create a new HubSpot contact with email [email] and name [name]" }
      },
      {
        id: "update-contact",
        name: { fr: "Mettre à jour un contact", en: "Update a contact" },
        description: { fr: "Met à jour les propriétés d'un contact", en: "Update contact properties" },
        prompt: { fr: "Mets à jour le contact HubSpot [email] avec [propriétés]", en: "Update HubSpot contact [email] with [properties]" }
      },
      {
        id: "create-deal",
        name: { fr: "Créer une transaction", en: "Create a deal" },
        description: { fr: "Crée une nouvelle transaction/opportunité", en: "Create a new deal/opportunity" },
        prompt: { fr: "Crée une nouvelle transaction HubSpot [nom] d'une valeur de [montant]€", en: "Create a new HubSpot deal [name] worth [amount]€" }
      },
      {
        id: "search-contacts",
        name: { fr: "Rechercher des contacts", en: "Search contacts" },
        description: { fr: "Recherche des contacts par critères", en: "Search contacts by criteria" },
        prompt: { fr: "Recherche les contacts HubSpot correspondant à [critère]", en: "Search HubSpot contacts matching [criteria]" }
      }
    ]
  },
  {
    id: "airtable",
    slug: "airtable",
    name: "Airtable",
    description: {
      fr: "Base de données collaborative avec interface tableur.",
      en: "Collaborative database with spreadsheet interface."
    },
    category: { fr: "Base de données", en: "Database" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/airtable-1.svg",
    isPopular: true,
    actions: [
      {
        id: "list-records",
        name: { fr: "Lister les enregistrements", en: "List records" },
        description: { fr: "Récupère les enregistrements d'une table", en: "Get records from a table" },
        prompt: { fr: "Récupère tous les enregistrements de la table Airtable [nom de la table]", en: "Get all records from Airtable table [table name]" }
      },
      {
        id: "create-record",
        name: { fr: "Créer un enregistrement", en: "Create a record" },
        description: { fr: "Crée un nouvel enregistrement", en: "Create a new record" },
        prompt: { fr: "Crée un nouvel enregistrement dans Airtable [table] avec [champs]", en: "Create a new record in Airtable [table] with [fields]" }
      },
      {
        id: "update-record",
        name: { fr: "Mettre à jour un enregistrement", en: "Update a record" },
        description: { fr: "Met à jour un enregistrement existant", en: "Update an existing record" },
        prompt: { fr: "Mets à jour l'enregistrement [ID] dans Airtable [table] avec [champs]", en: "Update record [ID] in Airtable [table] with [fields]" }
      },
      {
        id: "delete-record",
        name: { fr: "Supprimer un enregistrement", en: "Delete a record" },
        description: { fr: "Supprime un enregistrement", en: "Delete a record" },
        prompt: { fr: "Supprime l'enregistrement [ID] de la table Airtable [table]", en: "Delete record [ID] from Airtable table [table]" }
      }
    ]
  },
  {
    id: "trello",
    slug: "trello",
    name: "Trello",
    description: {
      fr: "Outil de gestion de projet basé sur des tableaux Kanban.",
      en: "Kanban-based project management tool."
    },
    category: { fr: "Gestion de projet", en: "Project Management" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/trello.svg",
    isPopular: true,
    actions: [
      {
        id: "create-card",
        name: { fr: "Créer une carte", en: "Create a card" },
        description: { fr: "Crée une nouvelle carte dans une liste", en: "Create a new card in a list" },
        prompt: { fr: "Crée une carte Trello [nom] dans la liste [liste] du tableau [tableau]", en: "Create Trello card [name] in list [list] on board [board]" }
      },
      {
        id: "move-card",
        name: { fr: "Déplacer une carte", en: "Move a card" },
        description: { fr: "Déplace une carte vers une autre liste", en: "Move a card to another list" },
        prompt: { fr: "Déplace la carte Trello [nom] vers la liste [liste]", en: "Move Trello card [name] to list [list]" }
      },
      {
        id: "add-comment",
        name: { fr: "Ajouter un commentaire", en: "Add a comment" },
        description: { fr: "Ajoute un commentaire à une carte", en: "Add a comment to a card" },
        prompt: { fr: "Ajoute le commentaire [texte] à la carte Trello [nom]", en: "Add comment [text] to Trello card [name]" }
      },
      {
        id: "list-boards",
        name: { fr: "Lister les tableaux", en: "List boards" },
        description: { fr: "Récupère la liste des tableaux", en: "Get the list of boards" },
        prompt: { fr: "Liste tous mes tableaux Trello", en: "List all my Trello boards" }
      }
    ]
  },
  {
    id: "discord",
    slug: "discord",
    name: "Discord",
    description: {
      fr: "Plateforme de communication pour communautés et équipes.",
      en: "Communication platform for communities and teams."
    },
    category: { fr: "Communication", en: "Communication" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/discord-6.svg",
    isPopular: true,
    actions: [
      {
        id: "send-message",
        name: { fr: "Envoyer un message", en: "Send a message" },
        description: { fr: "Envoie un message dans un canal", en: "Send a message to a channel" },
        prompt: { fr: "Envoie le message [contenu] dans le canal Discord [canal]", en: "Send message [content] to Discord channel [channel]" }
      },
      {
        id: "create-channel",
        name: { fr: "Créer un canal", en: "Create a channel" },
        description: { fr: "Crée un nouveau canal sur le serveur", en: "Create a new channel on the server" },
        prompt: { fr: "Crée un nouveau canal Discord [nom] de type [texte/vocal]", en: "Create a new Discord channel [name] of type [text/voice]" }
      },
      {
        id: "add-role",
        name: { fr: "Attribuer un rôle", en: "Assign a role" },
        description: { fr: "Attribue un rôle à un utilisateur", en: "Assign a role to a user" },
        prompt: { fr: "Attribue le rôle [rôle] à l'utilisateur Discord [utilisateur]", en: "Assign role [role] to Discord user [user]" }
      }
    ]
  },
  {
    id: "github",
    slug: "github",
    name: "GitHub",
    description: {
      fr: "Plateforme de développement collaboratif et hébergement de code.",
      en: "Collaborative development platform and code hosting."
    },
    category: { fr: "Développement", en: "Development" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/github-icon-1.svg",
    isPopular: true,
    actions: [
      {
        id: "create-issue",
        name: { fr: "Créer une issue", en: "Create an issue" },
        description: { fr: "Crée une nouvelle issue dans un repo", en: "Create a new issue in a repo" },
        prompt: { fr: "Crée une issue GitHub dans [repo] avec le titre [titre] et la description [description]", en: "Create a GitHub issue in [repo] with title [title] and description [description]" }
      },
      {
        id: "create-pr",
        name: { fr: "Créer une Pull Request", en: "Create a Pull Request" },
        description: { fr: "Crée une nouvelle PR", en: "Create a new PR" },
        prompt: { fr: "Crée une Pull Request de [branche source] vers [branche cible] dans [repo]", en: "Create a Pull Request from [source branch] to [target branch] in [repo]" }
      },
      {
        id: "list-repos",
        name: { fr: "Lister les repos", en: "List repos" },
        description: { fr: "Liste les repositories", en: "List repositories" },
        prompt: { fr: "Liste tous mes repositories GitHub", en: "List all my GitHub repositories" }
      },
      {
        id: "search-code",
        name: { fr: "Rechercher du code", en: "Search code" },
        description: { fr: "Recherche dans le code source", en: "Search in source code" },
        prompt: { fr: "Recherche [terme] dans le code de [repo]", en: "Search [term] in [repo] code" }
      }
    ]
  },
  {
    id: "google-calendar",
    slug: "google-calendar",
    name: "Google Calendar",
    description: {
      fr: "Service de calendrier et planification de Google.",
      en: "Google's calendar and scheduling service."
    },
    category: { fr: "Productivité", en: "Productivity" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/google-calendar-2020.svg",
    isPopular: true,
    actions: [
      {
        id: "create-event",
        name: { fr: "Créer un événement", en: "Create an event" },
        description: { fr: "Crée un nouvel événement", en: "Create a new event" },
        prompt: { fr: "Crée un événement Google Calendar [titre] le [date] de [heure début] à [heure fin]", en: "Create a Google Calendar event [title] on [date] from [start time] to [end time]" }
      },
      {
        id: "list-events",
        name: { fr: "Lister les événements", en: "List events" },
        description: { fr: "Récupère les événements d'une période", en: "Get events for a period" },
        prompt: { fr: "Liste mes événements Google Calendar du [date début] au [date fin]", en: "List my Google Calendar events from [start date] to [end date]" }
      },
      {
        id: "update-event",
        name: { fr: "Modifier un événement", en: "Update an event" },
        description: { fr: "Modifie un événement existant", en: "Update an existing event" },
        prompt: { fr: "Modifie l'événement [nom] pour le reprogrammer au [nouvelle date]", en: "Update event [name] to reschedule to [new date]" }
      },
      {
        id: "delete-event",
        name: { fr: "Supprimer un événement", en: "Delete an event" },
        description: { fr: "Supprime un événement", en: "Delete an event" },
        prompt: { fr: "Supprime l'événement Google Calendar [nom ou ID]", en: "Delete Google Calendar event [name or ID]" }
      }
    ]
  },
  {
    id: "stripe",
    slug: "stripe",
    name: "Stripe",
    description: {
      fr: "Plateforme de paiement en ligne pour entreprises.",
      en: "Online payment platform for businesses."
    },
    category: { fr: "Paiement", en: "Payment" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
    isPopular: false,
    actions: [
      {
        id: "create-customer",
        name: { fr: "Créer un client", en: "Create a customer" },
        description: { fr: "Crée un nouveau client Stripe", en: "Create a new Stripe customer" },
        prompt: { fr: "Crée un client Stripe avec l'email [email] et le nom [nom]", en: "Create a Stripe customer with email [email] and name [name]" }
      },
      {
        id: "create-invoice",
        name: { fr: "Créer une facture", en: "Create an invoice" },
        description: { fr: "Crée une nouvelle facture", en: "Create a new invoice" },
        prompt: { fr: "Crée une facture Stripe pour le client [client] d'un montant de [montant]€", en: "Create a Stripe invoice for customer [customer] for [amount]€" }
      },
      {
        id: "list-payments",
        name: { fr: "Lister les paiements", en: "List payments" },
        description: { fr: "Récupère l'historique des paiements", en: "Get payment history" },
        prompt: { fr: "Liste les paiements Stripe des 30 derniers jours", en: "List Stripe payments from the last 30 days" }
      }
    ]
  },
  {
    id: "typeform",
    slug: "typeform",
    name: "Typeform",
    description: {
      fr: "Création de formulaires et sondages interactifs.",
      en: "Interactive forms and surveys creation."
    },
    category: { fr: "Formulaires", en: "Forms" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/typeform-1.svg",
    isPopular: false,
    actions: [
      {
        id: "list-responses",
        name: { fr: "Lister les réponses", en: "List responses" },
        description: { fr: "Récupère les réponses d'un formulaire", en: "Get responses from a form" },
        prompt: { fr: "Récupère les réponses du formulaire Typeform [nom ou ID]", en: "Get responses from Typeform form [name or ID]" }
      },
      {
        id: "create-form",
        name: { fr: "Créer un formulaire", en: "Create a form" },
        description: { fr: "Crée un nouveau formulaire", en: "Create a new form" },
        prompt: { fr: "Crée un nouveau formulaire Typeform avec les questions [questions]", en: "Create a new Typeform form with questions [questions]" }
      }
    ]
  },
  {
    id: "mailchimp",
    slug: "mailchimp",
    name: "Mailchimp",
    description: {
      fr: "Plateforme de marketing par email et automatisation.",
      en: "Email marketing and automation platform."
    },
    category: { fr: "Marketing", en: "Marketing" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon-wink.svg",
    isPopular: false,
    actions: [
      {
        id: "add-subscriber",
        name: { fr: "Ajouter un abonné", en: "Add a subscriber" },
        description: { fr: "Ajoute un contact à une liste", en: "Add a contact to a list" },
        prompt: { fr: "Ajoute l'email [email] à la liste Mailchimp [nom de la liste]", en: "Add email [email] to Mailchimp list [list name]" }
      },
      {
        id: "send-campaign",
        name: { fr: "Envoyer une campagne", en: "Send a campaign" },
        description: { fr: "Envoie une campagne email", en: "Send an email campaign" },
        prompt: { fr: "Envoie la campagne Mailchimp [nom] à la liste [liste]", en: "Send Mailchimp campaign [name] to list [list]" }
      },
      {
        id: "list-campaigns",
        name: { fr: "Lister les campagnes", en: "List campaigns" },
        description: { fr: "Récupère la liste des campagnes", en: "Get the list of campaigns" },
        prompt: { fr: "Liste toutes mes campagnes Mailchimp", en: "List all my Mailchimp campaigns" }
      }
    ]
  },
  {
    id: "zoom",
    slug: "zoom",
    name: "Zoom",
    description: {
      fr: "Plateforme de visioconférence et réunions en ligne.",
      en: "Video conferencing and online meetings platform."
    },
    category: { fr: "Communication", en: "Communication" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/zoom-app.svg",
    isPopular: false,
    actions: [
      {
        id: "create-meeting",
        name: { fr: "Créer une réunion", en: "Create a meeting" },
        description: { fr: "Planifie une nouvelle réunion Zoom", en: "Schedule a new Zoom meeting" },
        prompt: { fr: "Crée une réunion Zoom [titre] le [date] à [heure] pour [durée] minutes", en: "Create a Zoom meeting [title] on [date] at [time] for [duration] minutes" }
      },
      {
        id: "list-meetings",
        name: { fr: "Lister les réunions", en: "List meetings" },
        description: { fr: "Récupère les réunions planifiées", en: "Get scheduled meetings" },
        prompt: { fr: "Liste mes réunions Zoom à venir", en: "List my upcoming Zoom meetings" }
      },
      {
        id: "get-recording",
        name: { fr: "Récupérer un enregistrement", en: "Get a recording" },
        description: { fr: "Récupère l'enregistrement d'une réunion", en: "Get a meeting recording" },
        prompt: { fr: "Récupère l'enregistrement de la réunion Zoom [ID ou nom]", en: "Get the recording for Zoom meeting [ID or name]" }
      }
    ]
  },
  {
    id: "salesforce",
    slug: "salesforce",
    name: "Salesforce",
    description: {
      fr: "CRM leader pour la gestion de la relation client.",
      en: "Leading CRM for customer relationship management."
    },
    category: { fr: "CRM", en: "CRM" },
    logoUrl: "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg",
    isPopular: false,
    actions: [
      {
        id: "create-lead",
        name: { fr: "Créer un lead", en: "Create a lead" },
        description: { fr: "Crée un nouveau prospect", en: "Create a new lead" },
        prompt: { fr: "Crée un lead Salesforce avec le nom [nom], l'entreprise [entreprise] et l'email [email]", en: "Create a Salesforce lead with name [name], company [company] and email [email]" }
      },
      {
        id: "update-opportunity",
        name: { fr: "Mettre à jour une opportunité", en: "Update an opportunity" },
        description: { fr: "Met à jour une opportunité existante", en: "Update an existing opportunity" },
        prompt: { fr: "Mets à jour l'opportunité Salesforce [nom] avec le statut [statut]", en: "Update Salesforce opportunity [name] with status [status]" }
      },
      {
        id: "search-records",
        name: { fr: "Rechercher des enregistrements", en: "Search records" },
        description: { fr: "Recherche dans les objets Salesforce", en: "Search in Salesforce objects" },
        prompt: { fr: "Recherche les [type d'objet] Salesforce correspondant à [critère]", en: "Search Salesforce [object type] matching [criteria]" }
      }
    ]
  }
];

export const getIntegrationBySlug = (slug: string): Integration | undefined => {
  return integrations.find(i => i.slug === slug);
};
