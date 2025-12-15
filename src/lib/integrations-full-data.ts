// Full integration data generator for all Pipedream integrations
import { allIntegrationSlugs } from "./all-integration-slugs";
import { formatName, categories, popularSlugs } from "./integration-parser";
import { getCategoryFromSlug } from "./extended-categories";
import { getActionsForIntegration } from "./comprehensive-actions";

export interface IntegrationAction {
  id: string;
  name: { fr: string; en: string };
  description: { fr: string; en: string };
  prompt: { fr: string; en: string };
}

export interface Integration {
  id: string;
  slug: string;
  name: string;
  description: { fr: string; en: string };
  category: { fr: string; en: string };
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

// Get category label from ID
const getCategoryLabel = (categoryId: string): { fr: string; en: string } => {
  const category = categories.find(c => c.id === categoryId);
  return category?.label || { fr: "Autres", en: "Other" };
};

// Extended actions for specific integrations
const getSpecificActions = (slug: string, integrationName: string): IntegrationAction[] => {
  const specificActionsMap: Record<string, IntegrationAction[]> = {
    openai: [
      {
        id: "openai_chat",
        name: { fr: "Générer une complétion", en: "Create Chat Completion" },
        description: { fr: "Génère une réponse conversationnelle avec GPT", en: "Generate a conversational response with GPT" },
        prompt: { 
          fr: "Génère une réponse avec OpenAI GPT pour le prompt suivant : [votre prompt]. Utilise le modèle [gpt-4/gpt-3.5-turbo] avec une température de [0-1]",
          en: "Generate a response with OpenAI GPT for the following prompt: [your prompt]. Use model [gpt-4/gpt-3.5-turbo] with temperature [0-1]"
        }
      },
      {
        id: "openai_image",
        name: { fr: "Générer une image", en: "Create Image" },
        description: { fr: "Génère une image avec DALL-E", en: "Generate an image with DALL-E" },
        prompt: {
          fr: "Génère une image avec DALL-E représentant : [description détaillée]. Taille : [1024x1024/512x512]",
          en: "Generate an image with DALL-E depicting: [detailed description]. Size: [1024x1024/512x512]"
        }
      },
      {
        id: "openai_embedding",
        name: { fr: "Créer des embeddings", en: "Create Embeddings" },
        description: { fr: "Génère des vecteurs d'embedding pour du texte", en: "Generate embedding vectors for text" },
        prompt: {
          fr: "Génère des embeddings pour le texte suivant : [texte]",
          en: "Generate embeddings for the following text: [text]"
        }
      },
      {
        id: "openai_transcribe",
        name: { fr: "Transcrire un audio", en: "Transcribe Audio" },
        description: { fr: "Transcrit un fichier audio avec Whisper", en: "Transcribe an audio file with Whisper" },
        prompt: {
          fr: "Transcris le fichier audio [URL/fichier] en texte avec Whisper",
          en: "Transcribe the audio file [URL/file] to text with Whisper"
        }
      }
    ],
    anthropic: [
      {
        id: "anthropic_message",
        name: { fr: "Créer un message", en: "Create Message" },
        description: { fr: "Génère une réponse avec Claude", en: "Generate a response with Claude" },
        prompt: {
          fr: "Génère une réponse avec Claude pour : [votre prompt]. Modèle : [claude-3-opus/claude-3-sonnet], max tokens : [nombre]",
          en: "Generate a response with Claude for: [your prompt]. Model: [claude-3-opus/claude-3-sonnet], max tokens: [number]"
        }
      }
    ],
    notion: [
      {
        id: "notion_create_page",
        name: { fr: "Créer une page", en: "Create Page" },
        description: { fr: "Crée une nouvelle page dans Notion", en: "Create a new page in Notion" },
        prompt: {
          fr: "Crée une page Notion intitulée [titre] dans [database/parent] avec le contenu : [contenu]",
          en: "Create a Notion page titled [title] in [database/parent] with content: [content]"
        }
      },
      {
        id: "notion_query_database",
        name: { fr: "Requêter une base", en: "Query Database" },
        description: { fr: "Recherche dans une base de données Notion", en: "Search in a Notion database" },
        prompt: {
          fr: "Recherche dans la base Notion [database_id] les entrées où [propriété] = [valeur]",
          en: "Search in Notion database [database_id] for entries where [property] = [value]"
        }
      },
      {
        id: "notion_update_page",
        name: { fr: "Mettre à jour une page", en: "Update Page" },
        description: { fr: "Met à jour les propriétés d'une page", en: "Update page properties" },
        prompt: {
          fr: "Mets à jour la page Notion [page_id] avec : [propriétés à modifier]",
          en: "Update Notion page [page_id] with: [properties to modify]"
        }
      },
      {
        id: "notion_append_block",
        name: { fr: "Ajouter un bloc", en: "Append Block" },
        description: { fr: "Ajoute du contenu à une page existante", en: "Add content to an existing page" },
        prompt: {
          fr: "Ajoute à la page Notion [page_id] le contenu : [blocks/texte]",
          en: "Add to Notion page [page_id] the content: [blocks/text]"
        }
      }
    ],
    slack_v2: [
      {
        id: "slack_send_message",
        name: { fr: "Envoyer un message", en: "Send Message" },
        description: { fr: "Envoie un message dans un canal Slack", en: "Send a message to a Slack channel" },
        prompt: {
          fr: "Envoie un message Slack dans [#canal] : [message]",
          en: "Send a Slack message to [#channel]: [message]"
        }
      },
      {
        id: "slack_send_dm",
        name: { fr: "Envoyer un DM", en: "Send Direct Message" },
        description: { fr: "Envoie un message privé à un utilisateur", en: "Send a direct message to a user" },
        prompt: {
          fr: "Envoie un message privé Slack à [@utilisateur] : [message]",
          en: "Send a Slack DM to [@user]: [message]"
        }
      },
      {
        id: "slack_create_channel",
        name: { fr: "Créer un canal", en: "Create Channel" },
        description: { fr: "Crée un nouveau canal Slack", en: "Create a new Slack channel" },
        prompt: {
          fr: "Crée un canal Slack nommé [nom] avec la description : [description]",
          en: "Create a Slack channel named [name] with description: [description]"
        }
      }
    ],
    google_sheets: [
      {
        id: "gsheets_add_row",
        name: { fr: "Ajouter une ligne", en: "Add Row" },
        description: { fr: "Ajoute une nouvelle ligne à une feuille", en: "Add a new row to a sheet" },
        prompt: {
          fr: "Ajoute une ligne dans Google Sheets [spreadsheet_id] feuille [sheet_name] avec : [col1: val1, col2: val2]",
          en: "Add a row to Google Sheets [spreadsheet_id] sheet [sheet_name] with: [col1: val1, col2: val2]"
        }
      },
      {
        id: "gsheets_get_values",
        name: { fr: "Lire des cellules", en: "Get Values" },
        description: { fr: "Lit les valeurs d'une plage de cellules", en: "Read values from a cell range" },
        prompt: {
          fr: "Lis les valeurs de Google Sheets [spreadsheet_id] plage [A1:Z100]",
          en: "Read values from Google Sheets [spreadsheet_id] range [A1:Z100]"
        }
      },
      {
        id: "gsheets_update_row",
        name: { fr: "Mettre à jour une ligne", en: "Update Row" },
        description: { fr: "Met à jour une ligne existante", en: "Update an existing row" },
        prompt: {
          fr: "Mets à jour la ligne [numéro] de Google Sheets [spreadsheet_id] avec : [nouvelles valeurs]",
          en: "Update row [number] in Google Sheets [spreadsheet_id] with: [new values]"
        }
      }
    ],
    gmail: [
      {
        id: "gmail_send",
        name: { fr: "Envoyer un email", en: "Send Email" },
        description: { fr: "Envoie un email via Gmail", en: "Send an email via Gmail" },
        prompt: {
          fr: "Envoie un email Gmail à [destinataire] avec sujet [sujet] et contenu : [corps du message]",
          en: "Send a Gmail email to [recipient] with subject [subject] and content: [message body]"
        }
      },
      {
        id: "gmail_search",
        name: { fr: "Rechercher des emails", en: "Search Emails" },
        description: { fr: "Recherche des emails dans Gmail", en: "Search for emails in Gmail" },
        prompt: {
          fr: "Recherche les emails Gmail correspondant à : [critères de recherche]",
          en: "Search for Gmail emails matching: [search criteria]"
        }
      }
    ],
    hubspot: [
      {
        id: "hubspot_create_contact",
        name: { fr: "Créer un contact", en: "Create Contact" },
        description: { fr: "Crée un nouveau contact HubSpot", en: "Create a new HubSpot contact" },
        prompt: {
          fr: "Crée un contact HubSpot : email [email], prénom [prénom], nom [nom], entreprise [entreprise]",
          en: "Create a HubSpot contact: email [email], first name [first name], last name [last name], company [company]"
        }
      },
      {
        id: "hubspot_create_deal",
        name: { fr: "Créer une affaire", en: "Create Deal" },
        description: { fr: "Crée une nouvelle affaire/opportunité", en: "Create a new deal/opportunity" },
        prompt: {
          fr: "Crée une affaire HubSpot : nom [nom], montant [montant], étape [pipeline stage], contact [contact_id]",
          en: "Create a HubSpot deal: name [name], amount [amount], stage [pipeline stage], contact [contact_id]"
        }
      },
      {
        id: "hubspot_update_contact",
        name: { fr: "Mettre à jour un contact", en: "Update Contact" },
        description: { fr: "Met à jour les propriétés d'un contact", en: "Update contact properties" },
        prompt: {
          fr: "Mets à jour le contact HubSpot [contact_id] avec : [propriétés]",
          en: "Update HubSpot contact [contact_id] with: [properties]"
        }
      }
    ],
    stripe: [
      {
        id: "stripe_create_customer",
        name: { fr: "Créer un client", en: "Create Customer" },
        description: { fr: "Crée un nouveau client Stripe", en: "Create a new Stripe customer" },
        prompt: {
          fr: "Crée un client Stripe : email [email], nom [nom], métadonnées [metadata]",
          en: "Create a Stripe customer: email [email], name [name], metadata [metadata]"
        }
      },
      {
        id: "stripe_create_payment",
        name: { fr: "Créer un paiement", en: "Create Payment Intent" },
        description: { fr: "Crée une intention de paiement", en: "Create a payment intent" },
        prompt: {
          fr: "Crée un paiement Stripe de [montant] [devise] pour le client [customer_id]",
          en: "Create a Stripe payment of [amount] [currency] for customer [customer_id]"
        }
      },
      {
        id: "stripe_create_subscription",
        name: { fr: "Créer un abonnement", en: "Create Subscription" },
        description: { fr: "Crée un nouvel abonnement", en: "Create a new subscription" },
        prompt: {
          fr: "Crée un abonnement Stripe pour [customer_id] au prix [price_id]",
          en: "Create a Stripe subscription for [customer_id] to price [price_id]"
        }
      }
    ],
    github: [
      {
        id: "github_create_issue",
        name: { fr: "Créer une issue", en: "Create Issue" },
        description: { fr: "Crée une nouvelle issue GitHub", en: "Create a new GitHub issue" },
        prompt: {
          fr: "Crée une issue GitHub dans [owner/repo] : titre [titre], description [description], labels [labels]",
          en: "Create a GitHub issue in [owner/repo]: title [title], description [description], labels [labels]"
        }
      },
      {
        id: "github_create_pr",
        name: { fr: "Créer une PR", en: "Create Pull Request" },
        description: { fr: "Crée une pull request", en: "Create a pull request" },
        prompt: {
          fr: "Crée une PR GitHub dans [owner/repo] de [branch_source] vers [branch_cible] : titre [titre]",
          en: "Create a GitHub PR in [owner/repo] from [source_branch] to [target_branch]: title [title]"
        }
      }
    ],
    discord: [
      {
        id: "discord_send_message",
        name: { fr: "Envoyer un message", en: "Send Message" },
        description: { fr: "Envoie un message dans un canal Discord", en: "Send a message to a Discord channel" },
        prompt: {
          fr: "Envoie un message Discord dans le canal [channel_id] : [message]",
          en: "Send a Discord message to channel [channel_id]: [message]"
        }
      }
    ],
    airtable_oauth: [
      {
        id: "airtable_create_record",
        name: { fr: "Créer un enregistrement", en: "Create Record" },
        description: { fr: "Crée un nouvel enregistrement Airtable", en: "Create a new Airtable record" },
        prompt: {
          fr: "Crée un enregistrement Airtable dans [base_id] table [table_name] avec : [champs et valeurs]",
          en: "Create an Airtable record in [base_id] table [table_name] with: [fields and values]"
        }
      },
      {
        id: "airtable_list_records",
        name: { fr: "Lister les enregistrements", en: "List Records" },
        description: { fr: "Liste les enregistrements d'une table", en: "List records from a table" },
        prompt: {
          fr: "Liste les enregistrements Airtable de [base_id] table [table_name] filtrés par : [formule]",
          en: "List Airtable records from [base_id] table [table_name] filtered by: [formula]"
        }
      }
    ],
    trello: [
      {
        id: "trello_create_card",
        name: { fr: "Créer une carte", en: "Create Card" },
        description: { fr: "Crée une nouvelle carte Trello", en: "Create a new Trello card" },
        prompt: {
          fr: "Crée une carte Trello dans la liste [list_id] : nom [nom], description [description]",
          en: "Create a Trello card in list [list_id]: name [name], description [description]"
        }
      }
    ],
    twilio: [
      {
        id: "twilio_send_sms",
        name: { fr: "Envoyer un SMS", en: "Send SMS" },
        description: { fr: "Envoie un SMS via Twilio", en: "Send an SMS via Twilio" },
        prompt: {
          fr: "Envoie un SMS Twilio à [numéro de téléphone] : [message]",
          en: "Send a Twilio SMS to [phone number]: [message]"
        }
      }
    ],
    sendgrid: [
      {
        id: "sendgrid_send_email",
        name: { fr: "Envoyer un email", en: "Send Email" },
        description: { fr: "Envoie un email via SendGrid", en: "Send an email via SendGrid" },
        prompt: {
          fr: "Envoie un email SendGrid à [destinataire] de [expéditeur] : sujet [sujet], contenu [contenu]",
          en: "Send a SendGrid email to [recipient] from [sender]: subject [subject], content [content]"
        }
      }
    ],
    supabase: [
      {
        id: "supabase_insert",
        name: { fr: "Insérer des données", en: "Insert Row" },
        description: { fr: "Insère une ligne dans une table Supabase", en: "Insert a row into a Supabase table" },
        prompt: {
          fr: "Insère dans Supabase table [table_name] : [colonnes et valeurs]",
          en: "Insert into Supabase table [table_name]: [columns and values]"
        }
      },
      {
        id: "supabase_select",
        name: { fr: "Requêter des données", en: "Select Rows" },
        description: { fr: "Récupère des données d'une table", en: "Retrieve data from a table" },
        prompt: {
          fr: "Requête Supabase sur [table_name] : select [colonnes], filtre [conditions]",
          en: "Query Supabase [table_name]: select [columns], filter [conditions]"
        }
      }
    ],
    shopify: [
      {
        id: "shopify_create_product",
        name: { fr: "Créer un produit", en: "Create Product" },
        description: { fr: "Crée un nouveau produit Shopify", en: "Create a new Shopify product" },
        prompt: {
          fr: "Crée un produit Shopify : titre [titre], description [description], prix [prix], images [urls]",
          en: "Create a Shopify product: title [title], description [description], price [price], images [urls]"
        }
      },
      {
        id: "shopify_update_inventory",
        name: { fr: "Mettre à jour le stock", en: "Update Inventory" },
        description: { fr: "Met à jour le niveau de stock", en: "Update inventory level" },
        prompt: {
          fr: "Mets à jour le stock Shopify pour [product_id] : quantité [quantité]",
          en: "Update Shopify inventory for [product_id]: quantity [quantity]"
        }
      }
    ]
  };

  return specificActionsMap[slug] || [];
};

// Generate a single integration object
const generateIntegration = (slug: string): Integration => {
  const name = formatName(slug);
  const categoryId = getCategoryFromSlug(slug);
  const categoryLabel = getCategoryLabel(categoryId);
  const isPopular = popularSlugs.includes(slug);
  
  // Get specific actions or generate defaults
  let actions = getSpecificActions(slug, name);
  if (actions.length === 0) {
    actions = getActionsForIntegration(slug, name);
  }
  
  return {
    id: slug,
    slug: slug,
    name: name,
    description: {
      fr: `Intégration ${name} - Automatisez vos workflows avec ${name}`,
      en: `${name} Integration - Automate your workflows with ${name}`
    },
    category: categoryLabel,
    categoryId: categoryId,
    logoUrl: `https://pipedream.com/s.v0/${slug.replace(/_/g, '-')}/logo/48`,
    isPopular: isPopular,
    actions: actions
  };
};

// Generate all integrations
export const generateAllIntegrations = (): Integration[] => {
  return allIntegrationSlugs.map(slug => generateIntegration(slug));
};

// Export categories
export const integrationCategories: Category[] = categories;

// Export pre-generated integrations for performance
export const allIntegrations: Integration[] = generateAllIntegrations();

// Get integrations by category
export const getIntegrationsByCategory = (categoryId: string): Integration[] => {
  if (categoryId === "all") return allIntegrations;
  return allIntegrations.filter(i => i.categoryId === categoryId);
};

// Get popular integrations
export const getPopularIntegrations = (): Integration[] => {
  return allIntegrations.filter(i => i.isPopular);
};

// Search integrations
export const searchIntegrations = (query: string): Integration[] => {
  const lowerQuery = query.toLowerCase();
  return allIntegrations.filter(i => 
    i.name.toLowerCase().includes(lowerQuery) ||
    i.slug.toLowerCase().includes(lowerQuery)
  );
};

// Get integration by slug
export const getIntegrationBySlug = (slug: string): Integration | undefined => {
  return allIntegrations.find(i => i.slug === slug);
};

// Get category counts
export const getCategoryCounts = (): Record<string, number> => {
  const counts: Record<string, number> = { all: allIntegrations.length };
  allIntegrations.forEach(i => {
    counts[i.categoryId] = (counts[i.categoryId] || 0) + 1;
  });
  return counts;
};
