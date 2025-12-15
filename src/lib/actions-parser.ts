// Parser for Pipedream component actions and sources (triggers)
// This dynamically extracts actions and triggers from the components/ directory structure

import { IntegrationAction } from "./integrations-full-data";

// Map folder names to readable action names
const formatActionName = (folderName: string): { fr: string; en: string } => {
  const cleanName = folderName
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return { fr: cleanName, en: cleanName };
};

// Generate description based on action name
const generateDescription = (actionName: string, integrationName: string): { fr: string; en: string } => {
  const actionLower = actionName.toLowerCase();
  
  if (actionLower.includes('send')) {
    return { fr: `Envoie via ${integrationName}`, en: `Send via ${integrationName}` };
  }
  if (actionLower.includes('create')) {
    return { fr: `Crée dans ${integrationName}`, en: `Create in ${integrationName}` };
  }
  if (actionLower.includes('update')) {
    return { fr: `Met à jour dans ${integrationName}`, en: `Update in ${integrationName}` };
  }
  if (actionLower.includes('delete') || actionLower.includes('remove')) {
    return { fr: `Supprime de ${integrationName}`, en: `Delete from ${integrationName}` };
  }
  if (actionLower.includes('get') || actionLower.includes('find') || actionLower.includes('list')) {
    return { fr: `Récupère depuis ${integrationName}`, en: `Retrieve from ${integrationName}` };
  }
  if (actionLower.includes('add')) {
    return { fr: `Ajoute à ${integrationName}`, en: `Add to ${integrationName}` };
  }
  if (actionLower.includes('archive')) {
    return { fr: `Archive dans ${integrationName}`, en: `Archive in ${integrationName}` };
  }
  if (actionLower.includes('download')) {
    return { fr: `Télécharge depuis ${integrationName}`, en: `Download from ${integrationName}` };
  }
  if (actionLower.includes('upload')) {
    return { fr: `Upload vers ${integrationName}`, en: `Upload to ${integrationName}` };
  }
  
  return { fr: `${actionName} via ${integrationName}`, en: `${actionName} via ${integrationName}` };
};

// Generate prompt based on action name
const generatePrompt = (actionName: string, integrationName: string): { fr: string; en: string } => {
  const actionLower = actionName.toLowerCase();
  
  if (actionLower.includes('send') && actionLower.includes('email')) {
    return {
      fr: `Envoie un email via ${integrationName} à [destinataire] avec sujet [sujet] et contenu : [message]`,
      en: `Send an email via ${integrationName} to [recipient] with subject [subject] and content: [message]`
    };
  }
  if (actionLower.includes('send') && actionLower.includes('message')) {
    return {
      fr: `Envoie un message ${integrationName} à [destinataire/canal] : [message]`,
      en: `Send a ${integrationName} message to [recipient/channel]: [message]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('channel')) {
    return {
      fr: `Crée un canal ${integrationName} nommé [nom] avec description : [description]`,
      en: `Create a ${integrationName} channel named [name] with description: [description]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('page')) {
    return {
      fr: `Crée une page ${integrationName} intitulée [titre] avec contenu : [contenu]`,
      en: `Create a ${integrationName} page titled [title] with content: [content]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('task')) {
    return {
      fr: `Crée une tâche ${integrationName} : [titre], assignée à [utilisateur], échéance [date]`,
      en: `Create a ${integrationName} task: [title], assigned to [user], due [date]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('contact')) {
    return {
      fr: `Crée un contact ${integrationName} : email [email], nom [nom], propriétés [propriétés]`,
      en: `Create a ${integrationName} contact: email [email], name [name], properties [properties]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('draft')) {
    return {
      fr: `Crée un brouillon ${integrationName} pour [destinataire] avec sujet [sujet] et contenu : [corps]`,
      en: `Create a ${integrationName} draft for [recipient] with subject [subject] and content: [body]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('label')) {
    return {
      fr: `Crée un label ${integrationName} nommé [nom du label]`,
      en: `Create a ${integrationName} label named [label name]`
    };
  }
  if (actionLower.includes('create') && actionLower.includes('reminder')) {
    return {
      fr: `Crée un rappel ${integrationName} : [texte] à [date/heure]`,
      en: `Create a ${integrationName} reminder: [text] at [date/time]`
    };
  }
  if (actionLower.includes('add') && actionLower.includes('row')) {
    return {
      fr: `Ajoute une ligne dans ${integrationName} [feuille/table] avec : [colonnes et valeurs]`,
      en: `Add a row to ${integrationName} [sheet/table] with: [columns and values]`
    };
  }
  if (actionLower.includes('add') && actionLower.includes('label')) {
    return {
      fr: `Ajoute le label [nom du label] à [élément] dans ${integrationName}`,
      en: `Add label [label name] to [item] in ${integrationName}`
    };
  }
  if (actionLower.includes('add') && actionLower.includes('reaction')) {
    return {
      fr: `Ajoute une réaction [emoji] au message [message_id] dans ${integrationName}`,
      en: `Add reaction [emoji] to message [message_id] in ${integrationName}`
    };
  }
  if (actionLower.includes('find') || actionLower.includes('search')) {
    return {
      fr: `Recherche dans ${integrationName} : [terme de recherche], filtres : [filtres]`,
      en: `Search in ${integrationName}: [search term], filters: [filters]`
    };
  }
  if (actionLower.includes('get') && actionLower.includes('user')) {
    return {
      fr: `Récupère les informations de l'utilisateur [user_id] depuis ${integrationName}`,
      en: `Get user [user_id] information from ${integrationName}`
    };
  }
  if (actionLower.includes('get') && actionLower.includes('file')) {
    return {
      fr: `Récupère le fichier [file_id] depuis ${integrationName}`,
      en: `Get file [file_id] from ${integrationName}`
    };
  }
  if (actionLower.includes('list') && actionLower.includes('channel')) {
    return {
      fr: `Liste tous les canaux ${integrationName}`,
      en: `List all ${integrationName} channels`
    };
  }
  if (actionLower.includes('list') && actionLower.includes('user')) {
    return {
      fr: `Liste tous les utilisateurs ${integrationName}`,
      en: `List all ${integrationName} users`
    };
  }
  if (actionLower.includes('list') && actionLower.includes('file')) {
    return {
      fr: `Liste les fichiers dans ${integrationName}`,
      en: `List files in ${integrationName}`
    };
  }
  if (actionLower.includes('list') && actionLower.includes('label')) {
    return {
      fr: `Liste tous les labels ${integrationName}`,
      en: `List all ${integrationName} labels`
    };
  }
  if (actionLower.includes('list') && actionLower.includes('member')) {
    return {
      fr: `Liste les membres de [groupe/canal] dans ${integrationName}`,
      en: `List members of [group/channel] in ${integrationName}`
    };
  }
  if (actionLower.includes('update') && actionLower.includes('message')) {
    return {
      fr: `Modifie le message [message_id] dans ${integrationName} avec : [nouveau contenu]`,
      en: `Update message [message_id] in ${integrationName} with: [new content]`
    };
  }
  if (actionLower.includes('update') && actionLower.includes('profile')) {
    return {
      fr: `Met à jour le profil ${integrationName} avec : [nouvelles informations]`,
      en: `Update ${integrationName} profile with: [new information]`
    };
  }
  if (actionLower.includes('delete') && actionLower.includes('message')) {
    return {
      fr: `Supprime le message [message_id] de ${integrationName}`,
      en: `Delete message [message_id] from ${integrationName}`
    };
  }
  if (actionLower.includes('delete') && actionLower.includes('file')) {
    return {
      fr: `Supprime le fichier [file_id] de ${integrationName}`,
      en: `Delete file [file_id] from ${integrationName}`
    };
  }
  if (actionLower.includes('delete') && actionLower.includes('email')) {
    return {
      fr: `Supprime l'email [email_id] de ${integrationName}`,
      en: `Delete email [email_id] from ${integrationName}`
    };
  }
  if (actionLower.includes('archive') && actionLower.includes('channel')) {
    return {
      fr: `Archive le canal [channel_id] dans ${integrationName}`,
      en: `Archive channel [channel_id] in ${integrationName}`
    };
  }
  if (actionLower.includes('archive') && actionLower.includes('email')) {
    return {
      fr: `Archive l'email [email_id] dans ${integrationName}`,
      en: `Archive email [email_id] in ${integrationName}`
    };
  }
  if (actionLower.includes('download') && actionLower.includes('attachment')) {
    return {
      fr: `Télécharge la pièce jointe [attachment_id] depuis ${integrationName}`,
      en: `Download attachment [attachment_id] from ${integrationName}`
    };
  }
  if (actionLower.includes('upload') && actionLower.includes('file')) {
    return {
      fr: `Upload le fichier [fichier] vers ${integrationName} dans [destination]`,
      en: `Upload file [file] to ${integrationName} in [destination]`
    };
  }
  if (actionLower.includes('invite') && actionLower.includes('user')) {
    return {
      fr: `Invite l'utilisateur [user_id] dans [canal/groupe] ${integrationName}`,
      en: `Invite user [user_id] to [channel/group] in ${integrationName}`
    };
  }
  if (actionLower.includes('kick') && actionLower.includes('user')) {
    return {
      fr: `Retire l'utilisateur [user_id] de [canal/groupe] ${integrationName}`,
      en: `Remove user [user_id] from [channel/group] in ${integrationName}`
    };
  }
  if (actionLower.includes('reply')) {
    return {
      fr: `Répond au message [message_id] dans ${integrationName} : [réponse]`,
      en: `Reply to message [message_id] in ${integrationName}: [reply]`
    };
  }
  if (actionLower.includes('set') && actionLower.includes('status')) {
    return {
      fr: `Définit le statut ${integrationName} : emoji [emoji], texte [texte]`,
      en: `Set ${integrationName} status: emoji [emoji], text [text]`
    };
  }
  if (actionLower.includes('set') && actionLower.includes('topic')) {
    return {
      fr: `Définit le sujet de [canal] ${integrationName} : [nouveau sujet]`,
      en: `Set ${integrationName} [channel] topic: [new topic]`
    };
  }
  if (actionLower.includes('remove') && actionLower.includes('label')) {
    return {
      fr: `Retire le label [nom du label] de [élément] dans ${integrationName}`,
      en: `Remove label [label name] from [item] in ${integrationName}`
    };
  }
  if (actionLower.includes('approve')) {
    return {
      fr: `Approuve [élément] dans ${integrationName}`,
      en: `Approve [item] in ${integrationName}`
    };
  }
  
  // Default prompt
  return {
    fr: `Exécute "${actionName}" via ${integrationName} avec les paramètres : [paramètres]`,
    en: `Execute "${actionName}" via ${integrationName} with parameters: [parameters]`
  };
};

// Generate trigger description
const generateTriggerDescription = (triggerName: string, integrationName: string): { fr: string; en: string } => {
  const triggerLower = triggerName.toLowerCase();
  
  if (triggerLower.includes('new') && triggerLower.includes('email')) {
    return { fr: `Déclenche quand un nouvel email est reçu dans ${integrationName}`, en: `Triggers when a new email is received in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('message')) {
    return { fr: `Déclenche quand un nouveau message arrive dans ${integrationName}`, en: `Triggers when a new message arrives in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('channel')) {
    return { fr: `Déclenche quand un nouveau canal est créé dans ${integrationName}`, en: `Triggers when a new channel is created in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('user')) {
    return { fr: `Déclenche quand un nouvel utilisateur est ajouté dans ${integrationName}`, en: `Triggers when a new user is added in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('reaction')) {
    return { fr: `Déclenche quand une réaction est ajoutée dans ${integrationName}`, en: `Triggers when a reaction is added in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('attachment')) {
    return { fr: `Déclenche quand une pièce jointe est reçue dans ${integrationName}`, en: `Triggers when an attachment is received in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('mention')) {
    return { fr: `Déclenche quand vous êtes mentionné dans ${integrationName}`, en: `Triggers when you are mentioned in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('keyword')) {
    return { fr: `Déclenche quand un mot-clé est détecté dans ${integrationName}`, en: `Triggers when a keyword is detected in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('labeled')) {
    return { fr: `Déclenche quand un label est ajouté dans ${integrationName}`, en: `Triggers when a label is added in ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('sent')) {
    return { fr: `Déclenche quand un message/email est envoyé depuis ${integrationName}`, en: `Triggers when a message/email is sent from ${integrationName}` };
  }
  if (triggerLower.includes('new') && triggerLower.includes('saved')) {
    return { fr: `Déclenche quand un élément est sauvegardé dans ${integrationName}`, en: `Triggers when an item is saved in ${integrationName}` };
  }
  if (triggerLower.includes('interaction')) {
    return { fr: `Déclenche lors d'une interaction dans ${integrationName}`, en: `Triggers on interaction in ${integrationName}` };
  }
  if (triggerLower.includes('matching') && triggerLower.includes('search')) {
    return { fr: `Déclenche quand un élément correspond à une recherche dans ${integrationName}`, en: `Triggers when an item matches a search in ${integrationName}` };
  }
  
  return { fr: `Déclenche sur ${triggerName} dans ${integrationName}`, en: `Triggers on ${triggerName} in ${integrationName}` };
};

// Generate trigger prompt
const generateTriggerPrompt = (triggerName: string, integrationName: string): { fr: string; en: string } => {
  const triggerLower = triggerName.toLowerCase();
  
  if (triggerLower.includes('new') && triggerLower.includes('email')) {
    return {
      fr: `Quand un nouvel email arrive dans ${integrationName} avec labels [labels], exclure [labels à exclure]`,
      en: `When a new email arrives in ${integrationName} with labels [labels], exclude [labels to exclude]`
    };
  }
  if (triggerLower.includes('new') && triggerLower.includes('message')) {
    return {
      fr: `Quand un nouveau message arrive dans ${integrationName} canal [canal]`,
      en: `When a new message arrives in ${integrationName} channel [channel]`
    };
  }
  if (triggerLower.includes('keyword') && triggerLower.includes('mention')) {
    return {
      fr: `Quand le mot-clé [mot-clé] est mentionné dans ${integrationName}`,
      en: `When keyword [keyword] is mentioned in ${integrationName}`
    };
  }
  if (triggerLower.includes('matching') && triggerLower.includes('search')) {
    return {
      fr: `Quand un élément correspond à la recherche [critères] dans ${integrationName}`,
      en: `When an item matches search [criteria] in ${integrationName}`
    };
  }
  
  return {
    fr: `Quand ${triggerName} se produit dans ${integrationName}`,
    en: `When ${triggerName} occurs in ${integrationName}`
  };
};

// Static mapping of actions and sources for all integrations
// This data is derived from the components/ directory structure
export const integrationActionsMap: Record<string, { actions: string[]; sources: string[] }> = {
  gmail: {
    actions: [
      "add-label-to-email",
      "approve-workflow", 
      "archive-email",
      "create-draft",
      "create-label",
      "delete-email",
      "download-attachment",
      "find-email",
      "get-send-as-alias",
      "list-labels",
      "list-send-as-aliases",
      "list-thread-messages",
      "remove-label-from-email",
      "send-email",
      "update-org-signature",
      "update-primary-signature"
    ],
    sources: [
      "new-attachment-received",
      "new-email-matching-search",
      "new-email-received",
      "new-labeled-email",
      "new-sent-email"
    ]
  },
  slack_v2: {
    actions: [
      "add-emoji-reaction",
      "approve-workflow",
      "archive-channel",
      "create-channel",
      "create-reminder",
      "delete-file",
      "delete-message",
      "find-message",
      "find-user-by-email",
      "get-current-user",
      "get-file",
      "invite-user-to-channel",
      "kick-user",
      "list-channels",
      "list-files",
      "list-group-members",
      "list-members-in-channel",
      "list-replies",
      "list-users",
      "reply-to-a-message",
      "send-block-kit-message",
      "send-large-message",
      "send-message-advanced",
      "send-message-to-channel",
      "send-message-to-user-or-group",
      "send-message",
      "set-channel-description",
      "set-channel-topic",
      "set-status",
      "update-group-members",
      "update-message",
      "update-profile",
      "upload-file"
    ],
    sources: [
      "new-channel-created",
      "new-interaction-event-received",
      "new-keyword-mention",
      "new-message-in-channels",
      "new-private-channel-created",
      "new-reaction-added",
      "new-saved-message",
      "new-user-added",
      "new-user-mention"
    ]
  },
  notion: {
    actions: [
      "append-block",
      "archive-page",
      "create-comment",
      "create-page",
      "create-page-from-database",
      "duplicate-page",
      "get-block",
      "get-database",
      "get-page",
      "get-page-property-item",
      "query-database",
      "retrieve-comments",
      "search",
      "update-block",
      "update-page",
      "update-page-property"
    ],
    sources: [
      "new-database",
      "new-page",
      "page-or-subpage-updated",
      "updated-page"
    ]
  },
  google_sheets: {
    actions: [
      "add-single-row",
      "add-multiple-rows",
      "clear-cell",
      "clear-rows",
      "copy-sheet",
      "create-spreadsheet",
      "create-worksheet",
      "delete-rows",
      "delete-worksheet",
      "find-row",
      "get-cell",
      "get-spreadsheet",
      "get-values",
      "get-values-in-range",
      "list-worksheets",
      "update-cell",
      "update-row",
      "update-rows"
    ],
    sources: [
      "new-row-added",
      "new-spreadsheet",
      "new-updates",
      "new-worksheet"
    ]
  },
  hubspot: {
    actions: [
      "add-contact-to-list",
      "batch-create-or-update",
      "create-associations",
      "create-company",
      "create-contact",
      "create-custom-object",
      "create-deal",
      "create-engagement",
      "create-form-submission",
      "create-line-item",
      "create-or-update",
      "create-product",
      "create-task",
      "create-ticket",
      "delete-contact",
      "get-company",
      "get-contact",
      "get-deal",
      "get-owner",
      "get-product",
      "get-task",
      "get-ticket",
      "search-crm",
      "update-company",
      "update-contact",
      "update-deal",
      "update-product",
      "update-task",
      "update-ticket"
    ],
    sources: [
      "new-blog-article",
      "new-calendar-task",
      "new-company",
      "new-contact",
      "new-contact-in-list",
      "new-deal",
      "new-deal-updated",
      "new-email-event",
      "new-email-subscriptions-timeline",
      "new-engagement",
      "new-event",
      "new-form-submission",
      "new-line-item",
      "new-owner",
      "new-or-updated-company",
      "new-or-updated-contact",
      "new-or-updated-crm-object",
      "new-product",
      "new-task",
      "new-ticket"
    ]
  },
  openai: {
    actions: [
      "chat",
      "create-assistant",
      "create-batch",
      "create-embeddings",
      "create-fine-tuning-job",
      "create-image",
      "create-image-edit",
      "create-image-variation",
      "create-moderation",
      "create-run",
      "create-speech",
      "create-transcription",
      "create-translation",
      "delete-assistant",
      "delete-file",
      "delete-fine-tuned-model",
      "list-assistants",
      "list-fine-tuning-events",
      "list-messages",
      "list-model",
      "list-run-steps",
      "modify-assistant",
      "retrieve-assistant",
      "retrieve-batch",
      "retrieve-file",
      "retrieve-fine-tuning-job",
      "retrieve-message",
      "retrieve-run",
      "retrieve-run-step",
      "send-prompt",
      "submit-tool-outputs",
      "summarize",
      "upload-file"
    ],
    sources: []
  },
  stripe: {
    actions: [
      "cancel-payment-intent",
      "cancel-or-reverse-payout",
      "cancel-subscription",
      "capture-payment-intent",
      "confirm-payment-intent",
      "create-checkout-session",
      "create-coupon",
      "create-customer",
      "create-invoice",
      "create-invoice-item",
      "create-payment-intent",
      "create-payment-link",
      "create-payout",
      "create-price",
      "create-product",
      "create-refund",
      "create-subscription",
      "create-usage-record",
      "delete-customer",
      "delete-product",
      "finalize-invoice",
      "list-balance-history",
      "list-charges",
      "list-customers",
      "list-invoices",
      "list-payment-intents",
      "list-prices",
      "list-refunds",
      "list-subscriptions",
      "retrieve-balance",
      "retrieve-charge",
      "retrieve-checkout-session",
      "retrieve-customer",
      "retrieve-invoice",
      "retrieve-payment-intent",
      "retrieve-product",
      "retrieve-subscription",
      "send-invoice",
      "update-customer",
      "update-invoice",
      "update-payment-intent",
      "update-product",
      "update-subscription",
      "void-invoice",
      "write-off-invoice"
    ],
    sources: [
      "custom-webhook-events",
      "new-charge",
      "new-customer",
      "new-dispute",
      "new-event",
      "new-invoice",
      "new-payment-intent",
      "new-payout",
      "new-refund",
      "new-subscription"
    ]
  },
  github: {
    actions: [
      "create-branch",
      "create-gist",
      "create-issue",
      "create-issue-comment",
      "create-or-update-file-contents",
      "create-pull-request",
      "create-release",
      "create-repository",
      "delete-gist",
      "get-commit",
      "get-file",
      "get-issue",
      "get-pull-request",
      "get-release",
      "get-repo",
      "get-repository-content",
      "get-user",
      "list-commits",
      "list-gists",
      "list-issues",
      "list-pull-requests",
      "list-releases",
      "list-repo-activities",
      "list-repository-branches",
      "merge-pull-request",
      "search-code",
      "search-issues",
      "search-repositories",
      "update-gist",
      "update-issue"
    ],
    sources: [
      "new-branch",
      "new-card-in-column",
      "new-collaborator",
      "new-commit",
      "new-commit-comment",
      "new-create-event",
      "new-fork",
      "new-gist",
      "new-issue",
      "new-label",
      "new-mention",
      "new-milestone",
      "new-notification",
      "new-or-updated-issue",
      "new-or-updated-milestone",
      "new-or-updated-pull-request",
      "new-organization",
      "new-project-card",
      "new-pull-request",
      "new-push",
      "new-release",
      "new-repo",
      "new-repository",
      "new-review-request",
      "new-security-alert",
      "new-star",
      "new-stargazer",
      "new-team",
      "new-watcher",
      "new-webhook-event"
    ]
  },
  discord: {
    actions: [
      "add-role",
      "create-channel",
      "create-channel-invite",
      "create-dm",
      "create-guild-channel",
      "create-guild-emoji",
      "create-guild-from-template",
      "create-reaction",
      "create-webhook",
      "delete-channel",
      "delete-message",
      "find-channel",
      "find-guild",
      "get-guild",
      "get-guild-member",
      "get-message",
      "get-user",
      "list-channel-messages",
      "list-guild-channels",
      "list-guild-emojis",
      "list-guild-members",
      "modify-guild",
      "modify-guild-member",
      "post-reaction-with-url",
      "remove-role",
      "search-guild-members",
      "send-message",
      "send-message-advanced",
      "send-message-with-file",
      "update-webhook-message"
    ],
    sources: [
      "message-deleted",
      "new-command-received",
      "new-forum-thread-message",
      "new-guild-member",
      "new-message",
      "new-message-in-channel",
      "new-thread-message",
      "reaction-added"
    ]
  },
  airtable_oauth: {
    actions: [
      "create-comment",
      "create-field",
      "create-multiple-records",
      "create-record",
      "create-table",
      "delete-record",
      "get-base-schema",
      "get-record",
      "get-record-or-create",
      "list-comments",
      "list-records",
      "list-records-in-view",
      "search-records",
      "update-comment",
      "update-field",
      "update-record",
      "update-table"
    ],
    sources: [
      "new-field",
      "new-modified-or-deleted-records",
      "new-or-modified-field",
      "new-or-modified-records",
      "new-or-modified-records-in-view",
      "new-records",
      "new-records-in-view"
    ]
  },
  trello: {
    actions: [
      "add-attachment-to-card",
      "add-checklist-to-card",
      "add-comment-to-card",
      "add-existing-label-to-card",
      "add-label-to-card",
      "add-member-to-card",
      "archive-card",
      "close-board",
      "complete-checklist-item",
      "create-board",
      "create-card",
      "create-checklist",
      "create-checklist-item",
      "create-label",
      "create-list",
      "delete-checklist",
      "find-labels",
      "find-list",
      "get-card",
      "get-list",
      "move-card-to-list",
      "remove-label-from-card",
      "rename-list",
      "search-boards",
      "search-cards",
      "search-checklists",
      "search-members",
      "update-card"
    ],
    sources: [
      "card-archived",
      "card-due-date-reminder",
      "card-moved",
      "card-updates",
      "custom-webhook-events",
      "new-activity",
      "new-attachment",
      "new-board",
      "new-card",
      "new-checklist",
      "new-comment-added-to-card",
      "new-label",
      "new-label-added-to-card",
      "new-list",
      "new-member-on-card",
      "new-notification"
    ]
  },
  shopify: {
    actions: [
      "add-product-to-custom-collection",
      "add-tags-to-product",
      "cancel-order",
      "close-order",
      "count-products",
      "create-article",
      "create-blog",
      "create-collect",
      "create-custom-collection",
      "create-customer",
      "create-draft-order",
      "create-metafield",
      "create-metaobject",
      "create-order",
      "create-page",
      "create-product",
      "create-product-image",
      "create-product-variant",
      "delete-article",
      "delete-blog",
      "delete-custom-collection",
      "delete-draft-order",
      "delete-metafield",
      "delete-page",
      "delete-product",
      "delete-product-image",
      "delete-product-variant",
      "get-articles",
      "get-blogs",
      "get-custom-collections",
      "get-customer",
      "get-metafields",
      "get-orders",
      "get-pages",
      "get-product",
      "get-product-variants",
      "get-products",
      "search-customers",
      "search-for-orders",
      "search-for-products",
      "send-draft-order-invoice",
      "update-article",
      "update-customer",
      "update-customer-metafield",
      "update-inventory-level",
      "update-metafield",
      "update-order",
      "update-page",
      "update-product",
      "update-product-variant",
      "update-product-variant-metafield"
    ],
    sources: [
      "abandoned-cart",
      "new-article",
      "new-blog",
      "new-cancelled-order",
      "new-customer",
      "new-draft-order",
      "new-event",
      "new-order",
      "new-page",
      "new-paid-order",
      "new-product",
      "new-updated-customer",
      "updated-order"
    ]
  }
};

// Convert raw action/source names to IntegrationAction format
export const getActionsFromMap = (slug: string, integrationName: string): IntegrationAction[] => {
  const data = integrationActionsMap[slug];
  if (!data) return [];
  
  const actions: IntegrationAction[] = [];
  
  // Convert actions
  data.actions.forEach((actionFolder) => {
    const actionName = formatActionName(actionFolder);
    actions.push({
      id: `${slug}_${actionFolder.replace(/-/g, '_')}`,
      name: actionName,
      description: generateDescription(actionName.en, integrationName),
      prompt: generatePrompt(actionName.en, integrationName)
    });
  });
  
  // Convert sources (triggers) - mark them as triggers
  data.sources.forEach((sourceFolder) => {
    const triggerName = formatActionName(sourceFolder);
    actions.push({
      id: `${slug}_trigger_${sourceFolder.replace(/-/g, '_')}`,
      name: { fr: `🔔 ${triggerName.fr}`, en: `🔔 ${triggerName.en}` },
      description: generateTriggerDescription(triggerName.en, integrationName),
      prompt: generateTriggerPrompt(triggerName.en, integrationName)
    });
  });
  
  return actions;
};
