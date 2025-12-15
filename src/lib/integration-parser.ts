/**
 * Script utilitaire pour extraire les données des intégrations Pipedream
 * Ce fichier génère les données à partir du dossier /components
 * 
 * Note: Ce script doit être exécuté une fois pour générer les données statiques
 */

// Helper to extract integration slug from folder name (handle special chars)
export const formatSlug = (folderName: string): string => {
  // Remove leading underscore and numbers
  return folderName.replace(/^_+/, '').replace(/^\d+/, '');
};

// Helper to format integration name from slug
export const formatName = (slug: string): string => {
  const nameMap: Record<string, string> = {
    // AI
    openai: "OpenAI",
    anthropic: "Anthropic", 
    azure_openai_service: "Azure OpenAI",
    google_dialogflow: "Dialogflow",
    cohere_platform: "Cohere",
    replicate: "Replicate",
    exa: "Exa AI",
    wit_ai: "Wit.ai",
    
    // Productivity
    notion: "Notion",
    google_sheets: "Google Sheets",
    google_docs: "Google Docs",
    google_calendar: "Google Calendar",
    google_drive: "Google Drive",
    google_tasks: "Google Tasks",
    airtable_oauth: "Airtable",
    coda: "Coda",
    todoist: "Todoist",
    dropbox: "Dropbox",
    box: "Box",
    microsoft_onedrive: "OneDrive",
    
    // Communication
    slack_v2: "Slack",
    slack_bot: "Slack Bot",
    microsoft_teams: "Microsoft Teams",
    discord: "Discord",
    discord_bot: "Discord Bot",
    telegram_bot_api: "Telegram",
    gmail: "Gmail",
    twilio: "Twilio",
    sendgrid: "SendGrid",
    mailgun: "Mailgun",
    zoom: "Zoom",
    whatsapp_business: "WhatsApp Business",
    intercom: "Intercom",
    
    // CRM
    hubspot: "HubSpot",
    salesforce_rest_api: "Salesforce",
    pipedrive: "Pipedrive",
    zoho_crm: "Zoho CRM",
    activecampaign: "ActiveCampaign",
    mailchimp: "Mailchimp",
    klaviyo: "Klaviyo",
    convertkit: "ConvertKit",
    
    // Database
    supabase: "Supabase",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    mongodb: "MongoDB",
    firebase_admin_sdk: "Firebase",
    faunadb: "FaunaDB",
    snowflake: "Snowflake",
    
    // Project Management
    trello: "Trello",
    asana: "Asana",
    monday: "Monday.com",
    clickup: "ClickUp",
    jira: "Jira",
    linear: "Linear",
    linear_app: "Linear",
    basecamp: "Basecamp",
    wrike: "Wrike",
    
    // Development
    github: "GitHub",
    gitlab: "GitLab",
    bitbucket: "Bitbucket",
    netlify: "Netlify",
    vercel_token_auth: "Vercel",
    heroku: "Heroku",
    circleci: "CircleCI",
    datadog: "Datadog",
    sentry: "Sentry",
    
    // E-commerce
    shopify: "Shopify",
    shopify_developer_app: "Shopify",
    woocommerce: "WooCommerce",
    stripe: "Stripe",
    paypal: "PayPal",
    bigcommerce: "BigCommerce",
    
    // Social
    twitter: "Twitter/X",
    linkedin: "LinkedIn",
    youtube_data_api: "YouTube",
    twitch: "Twitch",
    reddit: "Reddit",
    pinterest: "Pinterest",
    
    // Forms
    typeform: "Typeform",
    jotform: "JotForm",
    google_forms: "Google Forms",
    
    // Analytics
    google_analytics: "Google Analytics",
    mixpanel: "Mixpanel",
    segment: "Segment",
    amplitude: "Amplitude",
    
    // Support
    zendesk: "Zendesk",
    freshdesk: "Freshdesk",
    crisp: "Crisp",
    gorgias_oauth: "Gorgias",
  };
  
  return nameMap[slug] || slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Category mapping
export const getCategoryId = (slug: string): string => {
  const categoryMap: Record<string, string> = {
    // AI
    openai: "ai", anthropic: "ai", azure_openai_service: "ai", google_dialogflow: "ai",
    cohere_platform: "ai", replicate: "ai", exa: "ai", wit_ai: "ai", cerebras: "ai",
    deepl: "ai", assembly_ai: "ai", huggingface: "ai", stability_ai: "ai",
    
    // Productivity
    notion: "productivity", google_sheets: "productivity", google_docs: "productivity",
    google_calendar: "productivity", google_drive: "productivity", airtable_oauth: "productivity",
    coda: "productivity", todoist: "productivity", dropbox: "productivity", box: "productivity",
    evernote: "productivity", onenote: "productivity", google_tasks: "productivity",
    
    // Communication
    slack_v2: "communication", slack_bot: "communication", microsoft_teams: "communication",
    discord: "communication", discord_bot: "communication", telegram_bot_api: "communication",
    gmail: "communication", twilio: "communication", sendgrid: "communication",
    mailgun: "communication", zoom: "communication", whatsapp_business: "communication",
    intercom: "communication", postmark: "communication", amazon_ses: "communication",
    
    // CRM
    hubspot: "crm", salesforce_rest_api: "crm", pipedrive: "crm", zoho_crm: "crm",
    activecampaign: "crm", mailchimp: "crm", klaviyo: "crm", convertkit: "crm",
    brevo: "crm", customer_io: "crm", frontapp: "crm",
    
    // Database
    supabase: "database", mysql: "database", postgresql: "database", mongodb: "database",
    firebase_admin_sdk: "database", faunadb: "database", snowflake: "database",
    redis: "database", elasticsearch: "database", cockroachdb: "database",
    
    // Project Management
    trello: "project", asana: "project", monday: "project", clickup: "project",
    jira: "project", linear: "project", linear_app: "project", basecamp: "project",
    wrike: "project", teamwork: "project", pipefy: "project", shortcut: "project",
    
    // Development
    github: "development", gitlab: "development", bitbucket: "development",
    netlify: "development", vercel_token_auth: "development", heroku: "development",
    circleci: "development", datadog: "development", sentry: "development",
    buildkite: "development", jenkins: "development",
    
    // Payment
    stripe: "payment", paypal: "payment", chargebee: "payment", recurly: "payment",
    square: "payment", braintree: "payment", paddle: "payment",
    
    // E-commerce
    shopify: "ecommerce", shopify_developer_app: "ecommerce", woocommerce: "ecommerce",
    bigcommerce: "ecommerce", magento: "ecommerce", prestashop: "ecommerce",
    
    // Social
    twitter: "social", linkedin: "social", youtube_data_api: "social",
    twitch: "social", reddit: "social", pinterest: "social", tiktok: "social",
    
    // Forms
    typeform: "forms", jotform: "forms", google_forms: "forms", formstack: "forms",
    
    // Analytics
    google_analytics: "analytics", mixpanel: "analytics", segment: "analytics",
    amplitude: "analytics", hotjar: "analytics", plausible: "analytics",
    
    // Cloud
    aws: "cloud", google_cloud: "cloud", cloudflare_api_key: "cloud",
    digital_ocean: "cloud", azure: "cloud",
    
    // Support
    zendesk: "support", freshdesk: "support", crisp: "support",
    gorgias_oauth: "support", help_scout: "support",
    
    // Automation
    zapier: "automation", make: "automation", n8n: "automation",
    ifttt: "automation", workato: "automation",
    
    // HR
    bamboohr: "hr", workday: "hr", gusto: "hr", rippling: "hr",
    greenhouse: "hr", lever: "hr",
    
    // Finance
    quickbooks: "finance", xero_accounting_api: "finance", freshbooks: "finance",
    wave: "finance", zoho_books: "finance",
    
    // Marketing
    mailerlite: "marketing", mautic: "marketing", sendinblue: "marketing",
    constant_contact: "marketing", drip: "marketing",
  };
  
  return categoryMap[slug] || "other";
};

// Generate prompt based on action name
export const generatePrompt = (
  actionName: string,
  integrationName: string,
  description?: string
): { fr: string; en: string } => {
  const actionLower = actionName.toLowerCase();
  
  // Specific patterns based on action keywords
  if (actionLower.includes("create") && actionLower.includes("page")) {
    return {
      fr: `Crée une nouvelle page ${integrationName} intitulée [titre] avec le contenu : [contenu]`,
      en: `Create a new ${integrationName} page titled [title] with content: [content]`
    };
  }
  if (actionLower.includes("send") && actionLower.includes("message")) {
    return {
      fr: `Envoie un message via ${integrationName} à [destinataire] : [message]`,
      en: `Send a message via ${integrationName} to [recipient]: [message]`
    };
  }
  if (actionLower.includes("chat") || actionLower.includes("completion")) {
    return {
      fr: `Génère une réponse avec ${integrationName} pour : [prompt]. Paramètres : [temperature], [max_tokens]`,
      en: `Generate a response with ${integrationName} for: [prompt]. Parameters: [temperature], [max_tokens]`
    };
  }
  if (actionLower.includes("create") && actionLower.includes("image")) {
    return {
      fr: `Génère une image avec ${integrationName} représentant : [description]`,
      en: `Generate an image with ${integrationName} depicting: [description]`
    };
  }
  if (actionLower.includes("upload") || actionLower.includes("file")) {
    return {
      fr: `Upload le fichier [fichier] vers ${integrationName} dans [dossier]`,
      en: `Upload file [file] to ${integrationName} in [folder]`
    };
  }
  if (actionLower.includes("query") || actionLower.includes("database")) {
    return {
      fr: `Requête dans ${integrationName} : filtre par [critères], trie par [champ]`,
      en: `Query ${integrationName}: filter by [criteria], sort by [field]`
    };
  }
  if (actionLower.includes("add") && actionLower.includes("row")) {
    return {
      fr: `Ajoute une ligne dans ${integrationName} [feuille] avec : [colonnes et valeurs]`,
      en: `Add a row to ${integrationName} [sheet] with: [columns and values]`
    };
  }
  if (actionLower.includes("create") && actionLower.includes("contact")) {
    return {
      fr: `Crée un contact ${integrationName} : email [email], nom [nom], propriétés [propriétés]`,
      en: `Create ${integrationName} contact: email [email], name [name], properties [properties]`
    };
  }
  if (actionLower.includes("create") && actionLower.includes("task")) {
    return {
      fr: `Crée une tâche ${integrationName} : [titre], assignée à [utilisateur], échéance [date]`,
      en: `Create ${integrationName} task: [title], assigned to [user], due [date]`
    };
  }
  if (actionLower.includes("search")) {
    return {
      fr: `Recherche dans ${integrationName} : [terme de recherche], filtres : [filtres]`,
      en: `Search in ${integrationName}: [search term], filters: [filters]`
    };
  }
  if (actionLower.includes("get") || actionLower.includes("retrieve") || actionLower.includes("list")) {
    return {
      fr: `Récupère [éléments] depuis ${integrationName} avec le filtre : [critères]`,
      en: `Retrieve [items] from ${integrationName} with filter: [criteria]`
    };
  }
  if (actionLower.includes("update") || actionLower.includes("edit")) {
    return {
      fr: `Mets à jour [élément] dans ${integrationName} avec : [nouvelles valeurs]`,
      en: `Update [item] in ${integrationName} with: [new values]`
    };
  }
  if (actionLower.includes("delete") || actionLower.includes("remove")) {
    return {
      fr: `Supprime [élément] de ${integrationName}`,
      en: `Delete [item] from ${integrationName}`
    };
  }
  if (actionLower.includes("post") || actionLower.includes("publish")) {
    return {
      fr: `Publie [contenu] sur ${integrationName} avec : [paramètres]`,
      en: `Publish [content] to ${integrationName} with: [parameters]`
    };
  }
  
  // Default based on description if available
  if (description) {
    return {
      fr: `${description.replace(/\[.*?\]/g, '[paramètre]')} via ${integrationName}`,
      en: `${description} via ${integrationName}`
    };
  }
  
  return {
    fr: `Exécute "${actionName}" dans ${integrationName} avec les paramètres : [paramètres]`,
    en: `Execute "${actionName}" in ${integrationName} with parameters: [parameters]`
  };
};

// Categories list
export const categories = [
  { id: "all", label: { fr: "Toutes", en: "All" }, icon: "Blocks" },
  { id: "ai", label: { fr: "Intelligence Artificielle", en: "Artificial Intelligence" }, icon: "Brain" },
  { id: "productivity", label: { fr: "Productivité", en: "Productivity" }, icon: "Zap" },
  { id: "communication", label: { fr: "Communication", en: "Communication" }, icon: "MessageSquare" },
  { id: "crm", label: { fr: "CRM & Ventes", en: "CRM & Sales" }, icon: "Users" },
  { id: "database", label: { fr: "Base de données", en: "Database" }, icon: "Database" },
  { id: "project", label: { fr: "Gestion de projet", en: "Project Management" }, icon: "Kanban" },
  { id: "development", label: { fr: "Développement", en: "Development" }, icon: "Code" },
  { id: "marketing", label: { fr: "Marketing", en: "Marketing" }, icon: "Megaphone" },
  { id: "payment", label: { fr: "Paiement", en: "Payment" }, icon: "CreditCard" },
  { id: "forms", label: { fr: "Formulaires", en: "Forms" }, icon: "FileText" },
  { id: "cloud", label: { fr: "Cloud & Stockage", en: "Cloud & Storage" }, icon: "Cloud" },
  { id: "social", label: { fr: "Réseaux sociaux", en: "Social Media" }, icon: "Share2" },
  { id: "analytics", label: { fr: "Analytics", en: "Analytics" }, icon: "BarChart3" },
  { id: "automation", label: { fr: "Automatisation", en: "Automation" }, icon: "Workflow" },
  { id: "ecommerce", label: { fr: "E-commerce", en: "E-commerce" }, icon: "ShoppingCart" },
  { id: "support", label: { fr: "Support client", en: "Customer Support" }, icon: "HeadphonesIcon" },
  { id: "hr", label: { fr: "RH & Recrutement", en: "HR & Recruiting" }, icon: "Briefcase" },
  { id: "finance", label: { fr: "Finance", en: "Finance" }, icon: "Wallet" },
  { id: "other", label: { fr: "Autres", en: "Other" }, icon: "MoreHorizontal" },
];

// Popular integrations list
export const popularSlugs = [
  "openai", "anthropic", "notion", "slack_v2", "google_sheets", "gmail", "hubspot", 
  "airtable_oauth", "trello", "discord", "github", "stripe", "google_drive", 
  "google_calendar", "salesforce_rest_api", "mailchimp", "typeform", "asana", 
  "jira", "shopify", "twilio", "sendgrid", "supabase", "postgresql", "mongodb", 
  "telegram_bot_api", "zoom", "microsoft_teams", "dropbox", "clickup", "linear",
  "zapier", "make", "n8n", "zendesk", "intercom", "klaviyo", "figma", "webflow",
  "firebase_admin_sdk", "aws", "vercel_token_auth", "netlify", "paypal"
];
