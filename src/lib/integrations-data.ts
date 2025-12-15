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
  categoryId: string;
  logoUrl: string;
  isPopular: boolean;
  actions: IntegrationAction[];
}

export interface Category {
  id: string;
  label: { fr: string; en: string };
  icon: string;
}

export const integrationCategories: Category[] = [
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

// Helper to generate prompts based on action type
const generatePrompt = (actionName: string, integrationName: string): { fr: string; en: string } => {
  const actionLower = actionName.toLowerCase();
  
  // Create patterns
  if (actionLower.includes("create") || actionLower.includes("add") || actionLower.includes("new")) {
    return {
      fr: `Crée un(e) nouveau/nouvelle [élément] dans ${integrationName} avec les propriétés suivantes : [propriétés]`,
      en: `Create a new [item] in ${integrationName} with the following properties: [properties]`
    };
  }
  if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("modify")) {
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
  if (actionLower.includes("get") || actionLower.includes("retrieve") || actionLower.includes("fetch") || actionLower.includes("list")) {
    return {
      fr: `Récupère [éléments] depuis ${integrationName} avec le filtre : [critères]`,
      en: `Retrieve [items] from ${integrationName} with filter: [criteria]`
    };
  }
  if (actionLower.includes("search") || actionLower.includes("find") || actionLower.includes("query")) {
    return {
      fr: `Recherche dans ${integrationName} : [terme de recherche]`,
      en: `Search in ${integrationName}: [search term]`
    };
  }
  if (actionLower.includes("send") || actionLower.includes("post") || actionLower.includes("publish")) {
    return {
      fr: `Envoie/Publie [contenu] via ${integrationName} vers [destination]`,
      en: `Send/Publish [content] via ${integrationName} to [destination]`
    };
  }
  if (actionLower.includes("upload")) {
    return {
      fr: `Upload [fichier] vers ${integrationName} dans [dossier/emplacement]`,
      en: `Upload [file] to ${integrationName} in [folder/location]`
    };
  }
  if (actionLower.includes("download")) {
    return {
      fr: `Télécharge [fichier] depuis ${integrationName}`,
      en: `Download [file] from ${integrationName}`
    };
  }
  
  return {
    fr: `Exécute l'action "${actionName}" dans ${integrationName} avec les paramètres : [paramètres]`,
    en: `Execute "${actionName}" action in ${integrationName} with parameters: [parameters]`
  };
};

// Category mapping for integrations
const getCategoryForIntegration = (slug: string): { id: string; fr: string; en: string } => {
  const categoryMap: Record<string, { id: string; fr: string; en: string }> = {
    // AI
    openai: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    anthropic: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    azure_openai_service: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    google_dialogflow: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    wit_ai: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    cohere_platform: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    replicate: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    exa: { id: "ai", fr: "Intelligence Artificielle", en: "Artificial Intelligence" },
    
    // Productivity
    notion: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_sheets: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_docs: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_calendar: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_drive: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_tasks: { id: "productivity", fr: "Productivité", en: "Productivity" },
    google_forms: { id: "productivity", fr: "Productivité", en: "Productivity" },
    dropbox: { id: "productivity", fr: "Productivité", en: "Productivity" },
    airtable_oauth: { id: "productivity", fr: "Productivité", en: "Productivity" },
    coda: { id: "productivity", fr: "Productivité", en: "Productivity" },
    todoist: { id: "productivity", fr: "Productivité", en: "Productivity" },
    raindrop: { id: "productivity", fr: "Productivité", en: "Productivity" },
    clockify: { id: "productivity", fr: "Productivité", en: "Productivity" },
    toggl: { id: "productivity", fr: "Productivité", en: "Productivity" },
    box: { id: "productivity", fr: "Productivité", en: "Productivity" },
    microsoft_onedrive: { id: "productivity", fr: "Productivité", en: "Productivity" },
    
    // Communication
    slack_v2: { id: "communication", fr: "Communication", en: "Communication" },
    slack_bot: { id: "communication", fr: "Communication", en: "Communication" },
    microsoft_teams: { id: "communication", fr: "Communication", en: "Communication" },
    discord: { id: "communication", fr: "Communication", en: "Communication" },
    discord_bot: { id: "communication", fr: "Communication", en: "Communication" },
    telegram_bot_api: { id: "communication", fr: "Communication", en: "Communication" },
    gmail: { id: "communication", fr: "Communication", en: "Communication" },
    twilio: { id: "communication", fr: "Communication", en: "Communication" },
    sendgrid: { id: "communication", fr: "Communication", en: "Communication" },
    mailgun: { id: "communication", fr: "Communication", en: "Communication" },
    amazon_ses: { id: "communication", fr: "Communication", en: "Communication" },
    postmark: { id: "communication", fr: "Communication", en: "Communication" },
    zoom: { id: "communication", fr: "Communication", en: "Communication" },
    zoom_admin: { id: "communication", fr: "Communication", en: "Communication" },
    line: { id: "communication", fr: "Communication", en: "Communication" },
    line_messaging_api: { id: "communication", fr: "Communication", en: "Communication" },
    pushover: { id: "communication", fr: "Communication", en: "Communication" },
    pushbullet: { id: "communication", fr: "Communication", en: "Communication" },
    onesignal_rest_api: { id: "communication", fr: "Communication", en: "Communication" },
    whatsapp_business: { id: "communication", fr: "Communication", en: "Communication" },
    cisco_webex: { id: "communication", fr: "Communication", en: "Communication" },
    intercom: { id: "communication", fr: "Communication", en: "Communication" },
    drift: { id: "communication", fr: "Communication", en: "Communication" },
    
    // CRM & Sales
    hubspot: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    salesforce_rest_api: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    zoho_crm: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    pipedrive: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    activecampaign: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    klaviyo: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    convertkit: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    mailchimp: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    sendinblue: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    frontapp: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    clearbit: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    people_data_labs: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    customer_io: { id: "crm", fr: "CRM & Ventes", en: "CRM & Sales" },
    
    // Database
    supabase: { id: "database", fr: "Base de données", en: "Database" },
    mysql: { id: "database", fr: "Base de données", en: "Database" },
    postgresql: { id: "database", fr: "Base de données", en: "Database" },
    mongodb: { id: "database", fr: "Base de données", en: "Database" },
    faunadb: { id: "database", fr: "Base de données", en: "Database" },
    firebase_admin_sdk: { id: "database", fr: "Base de données", en: "Database" },
    snowflake: { id: "database", fr: "Base de données", en: "Database" },
    
    // Project Management
    trello: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    asana: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    monday: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    clickup: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    jira: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    linear: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    linear_app: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    basecamp: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    wrike: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    teamwork: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    pipefy: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    shortcut: { id: "project", fr: "Gestion de projet", en: "Project Management" },
    
    // Development
    github: { id: "development", fr: "Développement", en: "Development" },
    gitlab: { id: "development", fr: "Développement", en: "Development" },
    bitbucket: { id: "development", fr: "Développement", en: "Development" },
    netlify: { id: "development", fr: "Développement", en: "Development" },
    vercel_token_auth: { id: "development", fr: "Développement", en: "Development" },
    heroku: { id: "development", fr: "Développement", en: "Development" },
    circleci: { id: "development", fr: "Développement", en: "Development" },
    datadog: { id: "development", fr: "Développement", en: "Development" },
    sentry: { id: "development", fr: "Développement", en: "Development" },
    buildkite: { id: "development", fr: "Développement", en: "Development" },
    
    // Marketing
    mailerlite: { id: "marketing", fr: "Marketing", en: "Marketing" },
    mautic: { id: "marketing", fr: "Marketing", en: "Marketing" },
    ortto: { id: "marketing", fr: "Marketing", en: "Marketing" },
    moosend: { id: "marketing", fr: "Marketing", en: "Marketing" },
    
    // Payment
    stripe: { id: "payment", fr: "Paiement", en: "Payment" },
    paypal: { id: "payment", fr: "Paiement", en: "Payment" },
    chargebee: { id: "payment", fr: "Paiement", en: "Payment" },
    recurly: { id: "payment", fr: "Paiement", en: "Payment" },
    
    // Forms
    typeform: { id: "forms", fr: "Formulaires", en: "Forms" },
    jotform: { id: "forms", fr: "Formulaires", en: "Forms" },
    formstack: { id: "forms", fr: "Formulaires", en: "Forms" },
    
    // Cloud
    aws: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    google_cloud: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    cloudflare_api_key: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    bunnycdn: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    cloudinary: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    imgbb: { id: "cloud", fr: "Cloud & Stockage", en: "Cloud & Storage" },
    
    // Social
    twitter: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    linkedin: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    pinterest: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    reddit: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    youtube_data_api: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    twitch: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    spotify: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    dev_to: { id: "social", fr: "Réseaux sociaux", en: "Social Media" },
    
    // Analytics
    google_analytics: { id: "analytics", fr: "Analytics", en: "Analytics" },
    segment: { id: "analytics", fr: "Analytics", en: "Analytics" },
    mixpanel: { id: "analytics", fr: "Analytics", en: "Analytics" },
    
    // E-commerce
    shopify: { id: "ecommerce", fr: "E-commerce", en: "E-commerce" },
    shopify_developer_app: { id: "ecommerce", fr: "E-commerce", en: "E-commerce" },
    woocommerce: { id: "ecommerce", fr: "E-commerce", en: "E-commerce" },
    bigcommerce: { id: "ecommerce", fr: "E-commerce", en: "E-commerce" },
    
    // Support
    zendesk: { id: "support", fr: "Support client", en: "Customer Support" },
    freshdesk: { id: "support", fr: "Support client", en: "Customer Support" },
    servicenow: { id: "support", fr: "Support client", en: "Customer Support" },
    gorgias_oauth: { id: "support", fr: "Support client", en: "Customer Support" },
  };
  
  return categoryMap[slug] || { id: "other", fr: "Autres", en: "Other" };
};

// Popular integrations (shown first)
const popularSlugs = [
  "openai", "notion", "slack_v2", "google_sheets", "gmail", "hubspot", 
  "airtable_oauth", "trello", "discord", "github", "stripe", "zapier",
  "google_drive", "google_calendar", "salesforce_rest_api", "mailchimp",
  "typeform", "asana", "jira", "shopify", "twilio", "sendgrid",
  "supabase", "postgresql", "mongodb", "anthropic", "telegram_bot_api",
  "zoom", "microsoft_teams", "dropbox", "clickup", "linear"
];

// All integration slugs from Pipedream
const allIntegrationSlugs = [
  "openai", "notion", "anthropic", "google_sheets", "telegram_bot_api", "google_drive", 
  "google_calendar", "shopify_developer_app", "supabase", "mysql", "postgresql", "aws", 
  "sendgrid", "amazon_ses", "klaviyo", "zendesk", "servicenow", "slack_v2", "microsoft_teams", 
  "salesforce_rest_api", "hubspot", "zoho_crm", "stripe", "woocommerce", "snowflake", 
  "mongodb", "pinterest", "azure_openai_service", "github", "formatting", "exa", 
  "airtable_oauth", "zoom", "gmail", "zoom_admin", "twilio", "youtube_data_api", 
  "spotify", "google_forms", "typeform", "helper_functions", "jotform", "dropbox", 
  "trello", "firebase_admin_sdk", "discord", "google", "reddit", "shopify", 
  "mailchimp", "discord_bot", "mailgun", "jira", "twitch", "google_analytics", 
  "linkedin", "netlify", "activecampaign", "google_cloud", "asana", "pipedrive", 
  "gitlab", "bitbucket", "google_docs", "webflow", "pushover", "todoist", 
  "faunadb", "microsoft_graph_api", "clickup", "slack_bot", "dev_to", "amazon", 
  "intercom", "sendinblue", "line_messaging_api", "line", "giphy", "blogger", 
  "calendly_v2", "ifttt", "people_data_labs", "monday", "coda", "pushbullet", 
  "figma", "coinbase", "google_dialogflow", "bitly", "wordpress_com", "strava", 
  "heroku", "wordpress_org", "mailerlite", "cloudflare_api_key", "formstack", 
  "postmark", "google_tasks", "ssh", "segment", "ipdata_co", "raindrop", "imgbb", 
  "browserless", "shipstation", "onesignal_rest_api", "openweather_api", "sentry", 
  "algolia", "mautic", "mandrill", "xero_accounting_api", "google_classroom", 
  "zoho_books", "sftp_password_based_auth", "zoho_creator", "dynamics_365_business_central_api", 
  "google_search_console", "basecamp", "pipefy", "wrike", "box", "ghost_org_admin_api", 
  "clicksend", "quickbooks", "whatsapp_business", "supersaas", "product_hunt", 
  "pagerduty", "telnyx", "sftp", "toggl", "chargebee", "datadog", "bubble", 
  "convertkit", "ghost_org_content_api", "paypal", "cloudinary", "memberstack", 
  "waboxapp", "message_bird", "customer_io", "zoho_mail", "thinkific", 
  "stack_exchange", "vercel_token_auth", "clearbit", "gorgias_oauth", "instapaper", 
  "circleci", "infobip", "ortto", "wit_ai", "ringcentral", "linear", "kvdb", 
  "shortcut", "linear_app", "eventbrite", "here", "storyblok", "webinarjam", 
  "pinboard", "moosend", "teamwork", "fibery", "rocketreach", "auth0_management_api", 
  "pocket", "erpnext", "alpha_vantage", "invoice_ninja", "cloud_convert", "clockify", 
  "coinmarketcap", "bexio", "pusher", "bunnycdn", "rockset", "silfer_bots", 
  "you_need_a_budget", "msg91", "algorithmia", "microsoft_onedrive", "alpaca", 
  "acuity_scheduling", "youtube_analytics_api", "meistertask", "shipengine", 
  "sendpulse", "remove_bg", "ssh_password_based_auth", "foursquare", "drift", 
  "goodreads", "harry_potter_api", "plivo", "lifx", "smugmug", "chargify", 
  "google_cloud_translate", "dribbble", "discourse", "vimeo", "streamlabs", 
  "sendfox_personal_access_token", "datarobot", "assembla", "baremetrics", "procore", 
  "contentful", "buildkite", "remotelock", "influxdb_cloud", "freelancer", "textlocal", 
  "rev_ai", "abstract_ip_geo", "moneybird", "cisco_webex", "awork", "bannerbear", 
  "phrase", "everwebinar", "geocodio", "launchdarkly", "neverbounce", "lawmatics", 
  "revel_systems", "cobalt", "onesignal_user_auth", "linkish", "flexie", "bigcommerce", 
  "adversus", "unity_cloud_build", "gitter", "thanks_io", "rebrandly", "outreach", 
  "sendoso", "frontapp", "printful_oauth", "greenhouse", "gitea", "monkeylearn", 
  "contacts", "harvest", "full_contact", "new_relic", "workboard", "quickbooks_sandbox", 
  "loyaltylion", "payhere", "printful", "docupilot", "polygon", "accuranker", 
  "travis_ci", "ibm_cloud_speech_to_text", "contentful_graphql", "sslmate_cert_spotter_api", 
  "quipu", "datawaves", "lusha", "directus", "okta", "lemon_squeezy", "easy_project", 
  "yoast_seo", "user_com", "easy_projects", "commercehq", "seventodos", "yanado", 
  "apify", "dokan", "formtitan", "groundhogg", "dpd2", "convenia", "tutor_lms", 
  "lifterlms", "detectify", "klenty", "teamleader_focus", "smaily", "cloudcart", 
  "mumara", "fluent_support", "revamp_crm", "planso_forms", "triggercmd", "coassemble", 
  "textit", "sendloop", "rippling", "youcanbook_me", "digistore24", "recurly", 
  "t2m_url_shortener", "simple_analytics", "junip", "optimoroute", "supportivekoala", 
  "tidy", "bugherd", "lattice", "sapling_ai", "form_io", "geckoboard", "nasa", 
  "sendowl", "uipath_automation_hub", "leadfeeder", "snipcart", "replicate", 
  "vivifyscrum", "mode", "wire2air", "gtmetrix", "followup", "cohere_platform", 
  "new_york_times", "delighted", "levity", "sportsdata", "jira_service_desk", 
  "transloadit", "proprofs_knowledge_base", "smartsuite", "brandmentions", "whosonlocation"
];

// Integration name formatting
const formatIntegrationName = (slug: string): string => {
  const nameMap: Record<string, string> = {
    openai: "OpenAI",
    notion: "Notion",
    anthropic: "Anthropic",
    google_sheets: "Google Sheets",
    telegram_bot_api: "Telegram",
    google_drive: "Google Drive",
    google_calendar: "Google Calendar",
    shopify_developer_app: "Shopify",
    supabase: "Supabase",
    mysql: "MySQL",
    postgresql: "PostgreSQL",
    aws: "AWS",
    sendgrid: "SendGrid",
    amazon_ses: "Amazon SES",
    klaviyo: "Klaviyo",
    zendesk: "Zendesk",
    servicenow: "ServiceNow",
    slack_v2: "Slack",
    microsoft_teams: "Microsoft Teams",
    salesforce_rest_api: "Salesforce",
    hubspot: "HubSpot",
    zoho_crm: "Zoho CRM",
    stripe: "Stripe",
    woocommerce: "WooCommerce",
    snowflake: "Snowflake",
    mongodb: "MongoDB",
    pinterest: "Pinterest",
    azure_openai_service: "Azure OpenAI",
    github: "GitHub",
    formatting: "Formatting",
    exa: "Exa AI",
    airtable_oauth: "Airtable",
    zoom: "Zoom",
    gmail: "Gmail",
    zoom_admin: "Zoom Admin",
    twilio: "Twilio",
    youtube_data_api: "YouTube",
    spotify: "Spotify",
    google_forms: "Google Forms",
    typeform: "Typeform",
    helper_functions: "Helper Functions",
    jotform: "JotForm",
    dropbox: "Dropbox",
    trello: "Trello",
    firebase_admin_sdk: "Firebase",
    discord: "Discord",
    google: "Google",
    reddit: "Reddit",
    shopify: "Shopify",
    mailchimp: "Mailchimp",
    discord_bot: "Discord Bot",
    mailgun: "Mailgun",
    jira: "Jira",
    twitch: "Twitch",
    google_analytics: "Google Analytics",
    linkedin: "LinkedIn",
    netlify: "Netlify",
    activecampaign: "ActiveCampaign",
    google_cloud: "Google Cloud",
    asana: "Asana",
    pipedrive: "Pipedrive",
    gitlab: "GitLab",
    bitbucket: "Bitbucket",
    google_docs: "Google Docs",
    webflow: "Webflow",
    pushover: "Pushover",
    todoist: "Todoist",
    faunadb: "FaunaDB",
    microsoft_graph_api: "Microsoft Graph",
    clickup: "ClickUp",
    slack_bot: "Slack Bot",
    dev_to: "Dev.to",
    amazon: "Amazon",
    intercom: "Intercom",
    sendinblue: "Brevo (Sendinblue)",
    line_messaging_api: "LINE",
    line: "LINE",
    giphy: "Giphy",
    blogger: "Blogger",
    calendly_v2: "Calendly",
    ifttt: "IFTTT",
    people_data_labs: "People Data Labs",
    monday: "Monday.com",
    coda: "Coda",
    pushbullet: "Pushbullet",
    figma: "Figma",
    coinbase: "Coinbase",
    google_dialogflow: "Dialogflow",
    bitly: "Bitly",
    wordpress_com: "WordPress.com",
    strava: "Strava",
    heroku: "Heroku",
    wordpress_org: "WordPress",
    mailerlite: "MailerLite",
    cloudflare_api_key: "Cloudflare",
    formstack: "Formstack",
    postmark: "Postmark",
    google_tasks: "Google Tasks",
    ssh: "SSH",
    segment: "Segment",
    ipdata_co: "IPdata",
    raindrop: "Raindrop.io",
    imgbb: "ImgBB",
    browserless: "Browserless",
    shipstation: "ShipStation",
    onesignal_rest_api: "OneSignal",
    openweather_api: "OpenWeather",
    sentry: "Sentry",
    algolia: "Algolia",
    mautic: "Mautic",
    mandrill: "Mandrill",
    xero_accounting_api: "Xero",
    google_classroom: "Google Classroom",
    zoho_books: "Zoho Books",
    sftp_password_based_auth: "SFTP",
    zoho_creator: "Zoho Creator",
    dynamics_365_business_central_api: "Dynamics 365",
    google_search_console: "Google Search Console",
    basecamp: "Basecamp",
    pipefy: "Pipefy",
    wrike: "Wrike",
    box: "Box",
    ghost_org_admin_api: "Ghost",
    clicksend: "ClickSend",
    quickbooks: "QuickBooks",
    whatsapp_business: "WhatsApp Business",
    supersaas: "SuperSaaS",
    product_hunt: "Product Hunt",
    pagerduty: "PagerDuty",
    telnyx: "Telnyx",
    sftp: "SFTP",
    toggl: "Toggl",
    chargebee: "Chargebee",
    datadog: "Datadog",
    bubble: "Bubble",
    convertkit: "ConvertKit",
    ghost_org_content_api: "Ghost Content",
    paypal: "PayPal",
    cloudinary: "Cloudinary",
    memberstack: "Memberstack",
    waboxapp: "WABoxApp",
    message_bird: "MessageBird",
    customer_io: "Customer.io",
    zoho_mail: "Zoho Mail",
    thinkific: "Thinkific",
    stack_exchange: "Stack Exchange",
    vercel_token_auth: "Vercel",
    clearbit: "Clearbit",
    gorgias_oauth: "Gorgias",
    instapaper: "Instapaper",
    circleci: "CircleCI",
    infobip: "Infobip",
    ortto: "Ortto",
    wit_ai: "Wit.ai",
    ringcentral: "RingCentral",
    linear: "Linear",
    kvdb: "KVDB",
    shortcut: "Shortcut",
    linear_app: "Linear",
    eventbrite: "Eventbrite",
    here: "HERE Maps",
    storyblok: "Storyblok",
    webinarjam: "WebinarJam",
    pinboard: "Pinboard",
    moosend: "Moosend",
    teamwork: "Teamwork",
    fibery: "Fibery",
    rocketreach: "RocketReach",
    auth0_management_api: "Auth0",
    pocket: "Pocket",
    erpnext: "ERPNext",
    alpha_vantage: "Alpha Vantage",
    invoice_ninja: "Invoice Ninja",
    cloud_convert: "CloudConvert",
    clockify: "Clockify",
    coinmarketcap: "CoinMarketCap",
    bexio: "bexio",
    pusher: "Pusher",
    bunnycdn: "BunnyCDN",
    rockset: "Rockset",
    silfer_bots: "Silfer Bots",
    you_need_a_budget: "YNAB",
    msg91: "MSG91",
    algorithmia: "Algorithmia",
    microsoft_onedrive: "OneDrive",
    alpaca: "Alpaca",
    acuity_scheduling: "Acuity Scheduling",
    youtube_analytics_api: "YouTube Analytics",
    meistertask: "MeisterTask",
    shipengine: "ShipEngine",
    sendpulse: "SendPulse",
    remove_bg: "Remove.bg",
    ssh_password_based_auth: "SSH",
    foursquare: "Foursquare",
    drift: "Drift",
    goodreads: "Goodreads",
    harry_potter_api: "Harry Potter API",
    plivo: "Plivo",
    lifx: "LIFX",
    smugmug: "SmugMug",
    chargify: "Chargify",
    google_cloud_translate: "Google Translate",
    dribbble: "Dribbble",
    discourse: "Discourse",
    vimeo: "Vimeo",
    streamlabs: "Streamlabs",
    sendfox_personal_access_token: "SendFox",
    datarobot: "DataRobot",
    assembla: "Assembla",
    baremetrics: "Baremetrics",
    procore: "Procore",
    contentful: "Contentful",
    buildkite: "Buildkite",
    remotelock: "RemoteLock",
    influxdb_cloud: "InfluxDB",
    freelancer: "Freelancer",
    textlocal: "Textlocal",
    rev_ai: "Rev AI",
    abstract_ip_geo: "Abstract IP Geo",
    moneybird: "Moneybird",
    cisco_webex: "Webex",
    awork: "awork",
    bannerbear: "Bannerbear",
    phrase: "Phrase",
    everwebinar: "EverWebinar",
    geocodio: "Geocodio",
    launchdarkly: "LaunchDarkly",
    neverbounce: "NeverBounce",
    lawmatics: "Lawmatics",
    revel_systems: "Revel Systems",
    cobalt: "Cobalt",
    onesignal_user_auth: "OneSignal",
    linkish: "Linkish",
    flexie: "Flexie",
    bigcommerce: "BigCommerce",
    adversus: "Adversus",
    unity_cloud_build: "Unity Cloud Build",
    gitter: "Gitter",
    thanks_io: "Thanks.io",
    rebrandly: "Rebrandly",
    outreach: "Outreach",
    sendoso: "Sendoso",
    frontapp: "Front",
    printful_oauth: "Printful",
    greenhouse: "Greenhouse",
    gitea: "Gitea",
    monkeylearn: "MonkeyLearn",
    contacts: "Contacts",
    harvest: "Harvest",
    full_contact: "FullContact",
    new_relic: "New Relic",
    workboard: "Workboard",
    quickbooks_sandbox: "QuickBooks Sandbox",
    loyaltylion: "LoyaltyLion",
    payhere: "PayHere",
    printful: "Printful",
    docupilot: "Docupilot",
    polygon: "Polygon.io",
    accuranker: "AccuRanker",
    travis_ci: "Travis CI",
    ibm_cloud_speech_to_text: "IBM Speech to Text",
    contentful_graphql: "Contentful GraphQL",
    sslmate_cert_spotter_api: "SSLMate",
    quipu: "Quipu",
    datawaves: "Datawaves",
    lusha: "Lusha",
    directus: "Directus",
    okta: "Okta",
    lemon_squeezy: "Lemon Squeezy",
    easy_project: "Easy Project",
    yoast_seo: "Yoast SEO",
    user_com: "User.com",
    easy_projects: "Easy Projects",
    commercehq: "CommerceHQ",
    seventodos: "7todos",
    yanado: "Yanado",
    apify: "Apify",
    dokan: "Dokan",
    formtitan: "FormTitan",
    groundhogg: "Groundhogg",
    dpd2: "DPD",
    convenia: "Convenia",
    tutor_lms: "Tutor LMS",
    lifterlms: "LifterLMS",
    detectify: "Detectify",
    klenty: "Klenty",
    teamleader_focus: "Teamleader Focus",
    smaily: "Smaily",
    cloudcart: "CloudCart",
    mumara: "Mumara",
    fluent_support: "Fluent Support",
    revamp_crm: "Revamp CRM",
    planso_forms: "Planso Forms",
    triggercmd: "TRIGGERcmd",
    coassemble: "Coassemble",
    textit: "TextIt",
    sendloop: "Sendloop",
    rippling: "Rippling",
    youcanbook_me: "YouCanBook.me",
    digistore24: "Digistore24",
    recurly: "Recurly",
    t2m_url_shortener: "T2M URL Shortener",
    simple_analytics: "Simple Analytics",
    junip: "Junip",
    optimoroute: "OptimoRoute",
    supportivekoala: "Supportive Koala",
    tidy: "Tidy",
    bugherd: "BugHerd",
    lattice: "Lattice",
    sapling_ai: "Sapling AI",
    form_io: "Form.io",
    geckoboard: "Geckoboard",
    nasa: "NASA",
    sendowl: "SendOwl",
    uipath_automation_hub: "UiPath",
    leadfeeder: "Leadfeeder",
    snipcart: "Snipcart",
    replicate: "Replicate",
    vivifyscrum: "VivifyScrum",
    mode: "Mode",
    wire2air: "Wire2Air",
    gtmetrix: "GTmetrix",
    followup: "FollowUp",
    cohere_platform: "Cohere",
    new_york_times: "New York Times",
    delighted: "Delighted",
    levity: "Levity",
    sportsdata: "SportsData",
    jira_service_desk: "Jira Service Desk",
    transloadit: "Transloadit",
    proprofs_knowledge_base: "ProProfs",
    smartsuite: "SmartSuite",
    brandmentions: "BrandMentions",
    whosonlocation: "WhosOnLocation"
  };
  
  return nameMap[slug] || slug.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

// Integration descriptions
const getIntegrationDescription = (slug: string, name: string): { fr: string; en: string } => {
  const descriptions: Record<string, { fr: string; en: string }> = {
    openai: { fr: "API d'intelligence artificielle pour GPT, DALL-E, et Whisper.", en: "AI API for GPT, DALL-E, and Whisper." },
    notion: { fr: "Espace de travail tout-en-un pour notes, docs, bases de données.", en: "All-in-one workspace for notes, docs, databases." },
    anthropic: { fr: "API Claude pour l'IA conversationnelle avancée.", en: "Claude API for advanced conversational AI." },
    google_sheets: { fr: "Tableur collaboratif en ligne de Google.", en: "Google's collaborative online spreadsheet." },
    telegram_bot_api: { fr: "API pour créer des bots Telegram.", en: "API for creating Telegram bots." },
    google_drive: { fr: "Service de stockage cloud de Google.", en: "Google's cloud storage service." },
    google_calendar: { fr: "Calendrier en ligne de Google.", en: "Google's online calendar." },
    supabase: { fr: "Alternative open source à Firebase.", en: "Open source Firebase alternative." },
    mysql: { fr: "Système de gestion de base de données relationnelle.", en: "Relational database management system." },
    postgresql: { fr: "Base de données relationnelle open source avancée.", en: "Advanced open source relational database." },
    aws: { fr: "Services cloud d'Amazon Web Services.", en: "Amazon Web Services cloud services." },
    sendgrid: { fr: "Plateforme d'envoi d'emails transactionnels.", en: "Transactional email delivery platform." },
    slack_v2: { fr: "Plateforme de messagerie d'équipe.", en: "Team messaging platform." },
    microsoft_teams: { fr: "Plateforme de collaboration Microsoft.", en: "Microsoft collaboration platform." },
    hubspot: { fr: "CRM complet pour marketing, ventes et service client.", en: "Complete CRM for marketing, sales and customer service." },
    salesforce_rest_api: { fr: "CRM leader mondial pour les entreprises.", en: "World's leading enterprise CRM." },
    stripe: { fr: "Plateforme de paiement en ligne.", en: "Online payment platform." },
    github: { fr: "Plateforme de développement collaboratif.", en: "Collaborative development platform." },
    airtable_oauth: { fr: "Base de données collaborative avec interface tableur.", en: "Collaborative database with spreadsheet interface." },
    zoom: { fr: "Plateforme de visioconférence.", en: "Video conferencing platform." },
    gmail: { fr: "Service de messagerie électronique de Google.", en: "Google's email service." },
    twilio: { fr: "API pour SMS, voix et messagerie.", en: "API for SMS, voice and messaging." },
    typeform: { fr: "Créateur de formulaires et sondages interactifs.", en: "Interactive forms and surveys creator." },
    dropbox: { fr: "Service de stockage cloud et partage de fichiers.", en: "Cloud storage and file sharing service." },
    trello: { fr: "Outil de gestion de projet Kanban.", en: "Kanban project management tool." },
    discord: { fr: "Plateforme de communication pour communautés.", en: "Communication platform for communities." },
    mailchimp: { fr: "Plateforme de marketing par email.", en: "Email marketing platform." },
    jira: { fr: "Outil de suivi de bugs et gestion de projets.", en: "Bug tracking and project management tool." },
    asana: { fr: "Plateforme de gestion de travail d'équipe.", en: "Team work management platform." },
    clickup: { fr: "Plateforme de productivité tout-en-un.", en: "All-in-one productivity platform." },
    linear: { fr: "Outil de gestion de projet moderne pour équipes tech.", en: "Modern project management for tech teams." },
    monday: { fr: "Plateforme de gestion de travail collaborative.", en: "Collaborative work management platform." },
    pipedrive: { fr: "CRM axé sur les ventes pour PME.", en: "Sales-focused CRM for SMBs." },
    shopify: { fr: "Plateforme e-commerce complète.", en: "Complete e-commerce platform." },
    woocommerce: { fr: "Plugin e-commerce pour WordPress.", en: "E-commerce plugin for WordPress." },
    mongodb: { fr: "Base de données NoSQL orientée documents.", en: "Document-oriented NoSQL database." },
    firebase_admin_sdk: { fr: "Plateforme de développement d'apps de Google.", en: "Google's app development platform." },
    zendesk: { fr: "Plateforme de service client et support.", en: "Customer service and support platform." },
    intercom: { fr: "Plateforme de messagerie client.", en: "Customer messaging platform." },
    figma: { fr: "Outil de design collaboratif.", en: "Collaborative design tool." },
    netlify: { fr: "Plateforme de déploiement web.", en: "Web deployment platform." },
    vercel_token_auth: { fr: "Plateforme de déploiement pour frameworks modernes.", en: "Deployment platform for modern frameworks." },
    gitlab: { fr: "Plateforme DevOps complète.", en: "Complete DevOps platform." },
    bitbucket: { fr: "Hébergement de code avec CI/CD intégré.", en: "Code hosting with built-in CI/CD." },
    datadog: { fr: "Plateforme de monitoring et analytics.", en: "Monitoring and analytics platform." },
    sentry: { fr: "Plateforme de monitoring d'erreurs.", en: "Error monitoring platform." },
    paypal: { fr: "Service de paiement en ligne mondial.", en: "Global online payment service." },
    calendly_v2: { fr: "Outil de planification de rendez-vous.", en: "Appointment scheduling tool." },
    segment: { fr: "Plateforme de données clients.", en: "Customer data platform." },
    mixpanel: { fr: "Analytics produit pour insights utilisateurs.", en: "Product analytics for user insights." },
    algolia: { fr: "Moteur de recherche en temps réel.", en: "Real-time search engine." },
    contentful: { fr: "CMS headless pour contenu digital.", en: "Headless CMS for digital content." },
    webflow: { fr: "Plateforme de création de sites web visuelle.", en: "Visual web creation platform." },
    todoist: { fr: "Application de gestion de tâches.", en: "Task management application." },
    coda: { fr: "Document collaboratif avec formules et automatisations.", en: "Collaborative doc with formulas and automations." },
  };
  
  return descriptions[slug] || {
    fr: `Intégrez ${name} dans vos workflows automatisés.`,
    en: `Integrate ${name} into your automated workflows.`
  };
};

// Actions for popular integrations (detailed)
const getActionsForIntegration = (slug: string, name: string): IntegrationAction[] => {
  const detailedActions: Record<string, IntegrationAction[]> = {
    openai: [
      { id: "chat-completion", name: { fr: "Générer une complétion chat", en: "Generate chat completion" }, description: { fr: "Génère une réponse via GPT", en: "Generate a response via GPT" }, prompt: { fr: "Génère une réponse à la question suivante avec GPT-4 : [question]", en: "Generate a response to the following question with GPT-4: [question]" } },
      { id: "create-image", name: { fr: "Créer une image", en: "Create an image" }, description: { fr: "Génère une image avec DALL-E", en: "Generate an image with DALL-E" }, prompt: { fr: "Génère une image avec DALL-E représentant : [description]", en: "Generate an image with DALL-E depicting: [description]" } },
      { id: "transcribe-audio", name: { fr: "Transcrire un audio", en: "Transcribe audio" }, description: { fr: "Transcrit un fichier audio avec Whisper", en: "Transcribe an audio file with Whisper" }, prompt: { fr: "Transcris le fichier audio [fichier] en texte", en: "Transcribe audio file [file] to text" } },
      { id: "create-embedding", name: { fr: "Créer un embedding", en: "Create embedding" }, description: { fr: "Génère des vecteurs d'embedding", en: "Generate embedding vectors" }, prompt: { fr: "Génère un embedding pour le texte : [texte]", en: "Generate an embedding for the text: [text]" } },
      { id: "moderate-content", name: { fr: "Modérer du contenu", en: "Moderate content" }, description: { fr: "Analyse du contenu pour modération", en: "Analyze content for moderation" }, prompt: { fr: "Analyse ce contenu et détecte les problèmes potentiels : [contenu]", en: "Analyze this content and detect potential issues: [content]" } },
    ],
    notion: [
      { id: "create-page", name: { fr: "Créer une page", en: "Create a page" }, description: { fr: "Crée une nouvelle page Notion", en: "Create a new Notion page" }, prompt: { fr: "Crée une nouvelle page Notion intitulée [titre] dans l'espace [espace]", en: "Create a new Notion page titled [title] in workspace [workspace]" } },
      { id: "update-page", name: { fr: "Mettre à jour une page", en: "Update a page" }, description: { fr: "Met à jour une page existante", en: "Update an existing page" }, prompt: { fr: "Mets à jour la page Notion [titre/ID] avec : [contenu]", en: "Update Notion page [title/ID] with: [content]" } },
      { id: "query-database", name: { fr: "Requête base de données", en: "Query database" }, description: { fr: "Recherche dans une base Notion", en: "Search in a Notion database" }, prompt: { fr: "Recherche dans la base Notion [nom] les entrées où [filtre]", en: "Search in Notion database [name] for entries where [filter]" } },
      { id: "create-database-item", name: { fr: "Créer entrée base", en: "Create database item" }, description: { fr: "Ajoute une entrée dans une base", en: "Add an entry to a database" }, prompt: { fr: "Ajoute une entrée dans la base Notion [nom] avec : [propriétés]", en: "Add an entry to Notion database [name] with: [properties]" } },
      { id: "retrieve-block", name: { fr: "Récupérer contenu page", en: "Retrieve page content" }, description: { fr: "Récupère le contenu d'une page", en: "Retrieve page content" }, prompt: { fr: "Récupère tout le contenu de la page Notion [titre/ID]", en: "Retrieve all content from Notion page [title/ID]" } },
      { id: "append-block", name: { fr: "Ajouter du contenu", en: "Append content" }, description: { fr: "Ajoute du contenu à une page", en: "Append content to a page" }, prompt: { fr: "Ajoute le contenu suivant à la page Notion [titre] : [contenu]", en: "Append the following content to Notion page [title]: [content]" } },
    ],
    slack_v2: [
      { id: "send-message", name: { fr: "Envoyer un message", en: "Send a message" }, description: { fr: "Envoie un message dans un canal", en: "Send a message to a channel" }, prompt: { fr: "Envoie le message [contenu] dans le canal Slack [canal]", en: "Send message [content] to Slack channel [channel]" } },
      { id: "create-channel", name: { fr: "Créer un canal", en: "Create a channel" }, description: { fr: "Crée un nouveau canal", en: "Create a new channel" }, prompt: { fr: "Crée un nouveau canal Slack nommé [nom] avec la description [description]", en: "Create a new Slack channel named [name] with description [description]" } },
      { id: "upload-file", name: { fr: "Upload fichier", en: "Upload file" }, description: { fr: "Upload un fichier sur Slack", en: "Upload a file to Slack" }, prompt: { fr: "Upload le fichier [fichier] dans le canal Slack [canal]", en: "Upload file [file] to Slack channel [channel]" } },
      { id: "list-channels", name: { fr: "Lister les canaux", en: "List channels" }, description: { fr: "Liste tous les canaux", en: "List all channels" }, prompt: { fr: "Liste tous les canaux Slack de mon workspace", en: "List all Slack channels in my workspace" } },
      { id: "list-users", name: { fr: "Lister les utilisateurs", en: "List users" }, description: { fr: "Liste les membres du workspace", en: "List workspace members" }, prompt: { fr: "Liste tous les utilisateurs de mon workspace Slack", en: "List all users in my Slack workspace" } },
      { id: "reply-thread", name: { fr: "Répondre dans un thread", en: "Reply to thread" }, description: { fr: "Répond dans un fil de discussion", en: "Reply in a thread" }, prompt: { fr: "Réponds au message [ID] dans Slack avec : [réponse]", en: "Reply to message [ID] in Slack with: [response]" } },
    ],
    google_sheets: [
      { id: "add-row", name: { fr: "Ajouter une ligne", en: "Add a row" }, description: { fr: "Ajoute une ligne de données", en: "Add a row of data" }, prompt: { fr: "Ajoute une nouvelle ligne dans Google Sheets [feuille] avec : [valeurs]", en: "Add a new row to Google Sheets [sheet] with: [values]" } },
      { id: "update-row", name: { fr: "Mettre à jour une ligne", en: "Update a row" }, description: { fr: "Met à jour une ligne existante", en: "Update an existing row" }, prompt: { fr: "Mets à jour la ligne [numéro] de [feuille] avec : [valeurs]", en: "Update row [number] in [sheet] with: [values]" } },
      { id: "get-values", name: { fr: "Récupérer des valeurs", en: "Get values" }, description: { fr: "Récupère des valeurs d'une plage", en: "Get values from a range" }, prompt: { fr: "Récupère les données de [feuille] dans la plage [A1:Z100]", en: "Get data from [sheet] in range [A1:Z100]" } },
      { id: "find-row", name: { fr: "Trouver une ligne", en: "Find a row" }, description: { fr: "Recherche une ligne par critère", en: "Search for a row by criteria" }, prompt: { fr: "Trouve la ligne dans [feuille] où la colonne [colonne] contient [valeur]", en: "Find the row in [sheet] where column [column] contains [value]" } },
      { id: "create-spreadsheet", name: { fr: "Créer une feuille", en: "Create spreadsheet" }, description: { fr: "Crée une nouvelle feuille de calcul", en: "Create a new spreadsheet" }, prompt: { fr: "Crée une nouvelle feuille Google Sheets nommée [nom]", en: "Create a new Google Sheets spreadsheet named [name]" } },
      { id: "clear-rows", name: { fr: "Effacer des lignes", en: "Clear rows" }, description: { fr: "Efface des lignes de données", en: "Clear rows of data" }, prompt: { fr: "Efface les lignes [début] à [fin] de [feuille]", en: "Clear rows [start] to [end] in [sheet]" } },
    ],
    hubspot: [
      { id: "create-contact", name: { fr: "Créer un contact", en: "Create a contact" }, description: { fr: "Crée un nouveau contact", en: "Create a new contact" }, prompt: { fr: "Crée un contact HubSpot avec email [email], nom [nom] et propriétés [propriétés]", en: "Create a HubSpot contact with email [email], name [name] and properties [properties]" } },
      { id: "update-contact", name: { fr: "Mettre à jour contact", en: "Update contact" }, description: { fr: "Met à jour un contact existant", en: "Update an existing contact" }, prompt: { fr: "Mets à jour le contact HubSpot [email/ID] avec : [propriétés]", en: "Update HubSpot contact [email/ID] with: [properties]" } },
      { id: "create-deal", name: { fr: "Créer une transaction", en: "Create a deal" }, description: { fr: "Crée une nouvelle transaction", en: "Create a new deal" }, prompt: { fr: "Crée une transaction HubSpot [nom] d'une valeur de [montant]€", en: "Create a HubSpot deal [name] worth [amount]€" } },
      { id: "search-crm", name: { fr: "Rechercher dans le CRM", en: "Search CRM" }, description: { fr: "Recherche dans le CRM HubSpot", en: "Search in HubSpot CRM" }, prompt: { fr: "Recherche dans HubSpot les [contacts/deals] correspondant à : [critères]", en: "Search in HubSpot for [contacts/deals] matching: [criteria]" } },
      { id: "create-company", name: { fr: "Créer une entreprise", en: "Create a company" }, description: { fr: "Crée une nouvelle entreprise", en: "Create a new company" }, prompt: { fr: "Crée une entreprise HubSpot nommée [nom] avec : [propriétés]", en: "Create a HubSpot company named [name] with: [properties]" } },
      { id: "create-task", name: { fr: "Créer une tâche", en: "Create a task" }, description: { fr: "Crée une nouvelle tâche", en: "Create a new task" }, prompt: { fr: "Crée une tâche HubSpot [titre] assignée à [utilisateur] pour le [date]", en: "Create a HubSpot task [title] assigned to [user] for [date]" } },
    ],
    github: [
      { id: "create-issue", name: { fr: "Créer une issue", en: "Create an issue" }, description: { fr: "Crée une nouvelle issue", en: "Create a new issue" }, prompt: { fr: "Crée une issue GitHub dans [repo] avec titre [titre] et description [description]", en: "Create a GitHub issue in [repo] with title [title] and description [description]" } },
      { id: "create-pr", name: { fr: "Créer une Pull Request", en: "Create a Pull Request" }, description: { fr: "Crée une nouvelle PR", en: "Create a new PR" }, prompt: { fr: "Crée une PR de [branche source] vers [branche cible] dans [repo]", en: "Create a PR from [source branch] to [target branch] in [repo]" } },
      { id: "list-repos", name: { fr: "Lister les repos", en: "List repos" }, description: { fr: "Liste les repositories", en: "List repositories" }, prompt: { fr: "Liste tous mes repositories GitHub", en: "List all my GitHub repositories" } },
      { id: "get-file", name: { fr: "Récupérer un fichier", en: "Get a file" }, description: { fr: "Récupère le contenu d'un fichier", en: "Get file content" }, prompt: { fr: "Récupère le fichier [chemin] du repo [repo]", en: "Get file [path] from repo [repo]" } },
      { id: "create-file", name: { fr: "Créer un fichier", en: "Create a file" }, description: { fr: "Crée un nouveau fichier", en: "Create a new file" }, prompt: { fr: "Crée le fichier [chemin] dans [repo] avec le contenu : [contenu]", en: "Create file [path] in [repo] with content: [content]" } },
      { id: "search-code", name: { fr: "Rechercher du code", en: "Search code" }, description: { fr: "Recherche dans le code source", en: "Search in source code" }, prompt: { fr: "Recherche [terme] dans le code de [repo]", en: "Search [term] in [repo] code" } },
    ],
    stripe: [
      { id: "create-customer", name: { fr: "Créer un client", en: "Create a customer" }, description: { fr: "Crée un nouveau client Stripe", en: "Create a new Stripe customer" }, prompt: { fr: "Crée un client Stripe avec email [email] et nom [nom]", en: "Create a Stripe customer with email [email] and name [name]" } },
      { id: "create-payment-intent", name: { fr: "Créer un paiement", en: "Create payment intent" }, description: { fr: "Crée une intention de paiement", en: "Create a payment intent" }, prompt: { fr: "Crée un paiement Stripe de [montant]€ pour [client]", en: "Create a Stripe payment of [amount]€ for [customer]" } },
      { id: "list-invoices", name: { fr: "Lister les factures", en: "List invoices" }, description: { fr: "Liste les factures", en: "List invoices" }, prompt: { fr: "Liste les factures Stripe du client [client]", en: "List Stripe invoices for customer [customer]" } },
      { id: "create-subscription", name: { fr: "Créer un abonnement", en: "Create subscription" }, description: { fr: "Crée un nouvel abonnement", en: "Create a new subscription" }, prompt: { fr: "Crée un abonnement Stripe pour [client] au plan [plan]", en: "Create a Stripe subscription for [customer] to plan [plan]" } },
      { id: "refund-payment", name: { fr: "Rembourser", en: "Refund payment" }, description: { fr: "Rembourse un paiement", en: "Refund a payment" }, prompt: { fr: "Rembourse le paiement Stripe [ID] de [montant]€", en: "Refund Stripe payment [ID] of [amount]€" } },
    ],
    gmail: [
      { id: "send-email", name: { fr: "Envoyer un email", en: "Send an email" }, description: { fr: "Envoie un nouvel email", en: "Send a new email" }, prompt: { fr: "Envoie un email à [destinataire] avec sujet [sujet] et contenu [contenu]", en: "Send an email to [recipient] with subject [subject] and content [content]" } },
      { id: "search-emails", name: { fr: "Rechercher des emails", en: "Search emails" }, description: { fr: "Recherche des emails", en: "Search emails" }, prompt: { fr: "Recherche les emails contenant [mot-clé] reçus depuis [date]", en: "Search emails containing [keyword] received since [date]" } },
      { id: "create-draft", name: { fr: "Créer un brouillon", en: "Create a draft" }, description: { fr: "Crée un brouillon d'email", en: "Create an email draft" }, prompt: { fr: "Crée un brouillon d'email pour [destinataire] avec sujet [sujet]", en: "Create an email draft for [recipient] with subject [subject]" } },
      { id: "add-label", name: { fr: "Ajouter un libellé", en: "Add a label" }, description: { fr: "Ajoute un libellé à un email", en: "Add a label to an email" }, prompt: { fr: "Ajoute le libellé [nom] aux emails correspondant à [critère]", en: "Add label [name] to emails matching [criteria]" } },
    ],
    discord: [
      { id: "send-message", name: { fr: "Envoyer un message", en: "Send a message" }, description: { fr: "Envoie un message dans un canal", en: "Send a message to a channel" }, prompt: { fr: "Envoie le message [contenu] dans le canal Discord [canal]", en: "Send message [content] to Discord channel [channel]" } },
      { id: "create-channel", name: { fr: "Créer un canal", en: "Create a channel" }, description: { fr: "Crée un nouveau canal", en: "Create a new channel" }, prompt: { fr: "Crée un canal Discord [nom] de type [texte/vocal]", en: "Create a Discord channel [name] of type [text/voice]" } },
      { id: "add-role", name: { fr: "Attribuer un rôle", en: "Assign a role" }, description: { fr: "Attribue un rôle à un utilisateur", en: "Assign a role to a user" }, prompt: { fr: "Attribue le rôle [rôle] à l'utilisateur Discord [utilisateur]", en: "Assign role [role] to Discord user [user]" } },
      { id: "list-members", name: { fr: "Lister les membres", en: "List members" }, description: { fr: "Liste les membres du serveur", en: "List server members" }, prompt: { fr: "Liste tous les membres du serveur Discord", en: "List all Discord server members" } },
    ],
    trello: [
      { id: "create-card", name: { fr: "Créer une carte", en: "Create a card" }, description: { fr: "Crée une nouvelle carte", en: "Create a new card" }, prompt: { fr: "Crée une carte Trello [nom] dans la liste [liste] du tableau [tableau]", en: "Create Trello card [name] in list [list] on board [board]" } },
      { id: "move-card", name: { fr: "Déplacer une carte", en: "Move a card" }, description: { fr: "Déplace une carte", en: "Move a card" }, prompt: { fr: "Déplace la carte Trello [nom] vers la liste [liste]", en: "Move Trello card [name] to list [list]" } },
      { id: "add-comment", name: { fr: "Ajouter un commentaire", en: "Add a comment" }, description: { fr: "Ajoute un commentaire à une carte", en: "Add a comment to a card" }, prompt: { fr: "Ajoute le commentaire [texte] à la carte Trello [nom]", en: "Add comment [text] to Trello card [name]" } },
      { id: "create-list", name: { fr: "Créer une liste", en: "Create a list" }, description: { fr: "Crée une nouvelle liste", en: "Create a new list" }, prompt: { fr: "Crée une liste Trello [nom] dans le tableau [tableau]", en: "Create Trello list [name] on board [board]" } },
    ],
    airtable_oauth: [
      { id: "list-records", name: { fr: "Lister les enregistrements", en: "List records" }, description: { fr: "Récupère les enregistrements", en: "Get records" }, prompt: { fr: "Récupère tous les enregistrements de la table Airtable [table]", en: "Get all records from Airtable table [table]" } },
      { id: "create-record", name: { fr: "Créer un enregistrement", en: "Create a record" }, description: { fr: "Crée un nouvel enregistrement", en: "Create a new record" }, prompt: { fr: "Crée un enregistrement dans Airtable [table] avec : [champs]", en: "Create a record in Airtable [table] with: [fields]" } },
      { id: "update-record", name: { fr: "Mettre à jour", en: "Update a record" }, description: { fr: "Met à jour un enregistrement", en: "Update a record" }, prompt: { fr: "Mets à jour l'enregistrement [ID] dans Airtable [table] avec : [champs]", en: "Update record [ID] in Airtable [table] with: [fields]" } },
      { id: "delete-record", name: { fr: "Supprimer", en: "Delete a record" }, description: { fr: "Supprime un enregistrement", en: "Delete a record" }, prompt: { fr: "Supprime l'enregistrement [ID] de la table Airtable [table]", en: "Delete record [ID] from Airtable table [table]" } },
    ],
  };
  
  if (detailedActions[slug]) {
    return detailedActions[slug];
  }
  
  // Generate generic actions for other integrations
  const genericActions = [
    { id: "create", name: { fr: "Créer", en: "Create" }, description: { fr: "Crée un nouvel élément", en: "Create a new item" } },
    { id: "read", name: { fr: "Lire", en: "Read" }, description: { fr: "Récupère des données", en: "Retrieve data" } },
    { id: "update", name: { fr: "Mettre à jour", en: "Update" }, description: { fr: "Met à jour un élément", en: "Update an item" } },
    { id: "delete", name: { fr: "Supprimer", en: "Delete" }, description: { fr: "Supprime un élément", en: "Delete an item" } },
    { id: "list", name: { fr: "Lister", en: "List" }, description: { fr: "Liste les éléments", en: "List items" } },
    { id: "search", name: { fr: "Rechercher", en: "Search" }, description: { fr: "Recherche des éléments", en: "Search for items" } },
  ];
  
  return genericActions.map(action => ({
    ...action,
    prompt: generatePrompt(action.name.en, name)
  }));
};

// Generate all integrations
export const integrations: Integration[] = allIntegrationSlugs.map(slug => {
  const name = formatIntegrationName(slug);
  const category = getCategoryForIntegration(slug);
  const description = getIntegrationDescription(slug, name);
  const actions = getActionsForIntegration(slug, name);
  const isPopular = popularSlugs.includes(slug);
  
  return {
    id: slug,
    slug,
    name,
    description,
    category: { fr: category.fr, en: category.en },
    categoryId: category.id,
    logoUrl: `https://cdn.jsdelivr.net/gh/PipedreamHQ/pipedream@master/components/${slug}/${slug}.svg`,
    isPopular,
    actions
  };
});

// Get integrations by category
export const getIntegrationsByCategory = (categoryId: string): Integration[] => {
  if (categoryId === "all") return integrations;
  return integrations.filter(i => i.categoryId === categoryId);
};

// Get popular integrations
export const getPopularIntegrations = (): Integration[] => {
  return integrations.filter(i => i.isPopular);
};

// Search integrations
export const searchIntegrations = (query: string, categoryId: string = "all"): Integration[] => {
  const filtered = categoryId === "all" ? integrations : integrations.filter(i => i.categoryId === categoryId);
  if (!query) return filtered;
  
  const lowerQuery = query.toLowerCase();
  return filtered.filter(i => 
    i.name.toLowerCase().includes(lowerQuery) ||
    i.description.fr.toLowerCase().includes(lowerQuery) ||
    i.description.en.toLowerCase().includes(lowerQuery)
  );
};

// Get integration by slug
export const getIntegrationBySlug = (slug: string): Integration | undefined => {
  return integrations.find(i => i.slug === slug);
};
