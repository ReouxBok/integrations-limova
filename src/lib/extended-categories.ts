// Comprehensive category mapping for 3000+ integrations
// Reduces "Other" category significantly

export const extendedCategoryMap: Record<string, string> = {
  // ==================== AI & ML ====================
  openai: "ai", anthropic: "ai", azure_openai_service: "ai", google_dialogflow: "ai",
  cohere_platform: "ai", replicate: "ai", exa: "ai", wit_ai: "ai", cerebras: "ai",
  deepl: "ai", assemblyai: "ai", huggingface: "ai", stability_ai: "ai", palm: "ai",
  langchain: "ai", pinecone: "ai", weaviate: "ai", qdrant: "ai", chroma: "ai",
  openrouter: "ai", together_ai: "ai", perplexity: "ai", mistral: "ai", groq: "ai",
  ai21_labs: "ai", textrazor: "ai", aws_comprehend: "ai", google_cloud_natural_language: "ai",
  ibm_watson: "ai", clarifai: "ai", google_vertex_ai: "ai", aws_bedrock: "ai",
  eleven_labs: "ai", murf_ai: "ai", deepgram: "ai", speechmatics: "ai", rev_ai: "ai",
  whisper: "ai", descript: "ai", runway_ml: "ai", midjourney: "ai", leonardo_ai: "ai",
  
  // ==================== Productivity ====================
  notion: "productivity", google_sheets: "productivity", google_docs: "productivity",
  google_calendar: "productivity", google_drive: "productivity", airtable_oauth: "productivity",
  coda: "productivity", todoist: "productivity", dropbox: "productivity", box: "productivity",
  evernote: "productivity", onenote: "productivity", google_tasks: "productivity",
  microsoft_excel: "productivity", microsoft_word: "productivity", microsoft_outlook: "productivity",
  onedrive: "productivity", icloud: "productivity", notion_beta: "productivity",
  roam_research: "productivity", obsidian: "productivity", craft: "productivity",
  bear: "productivity", ulysses: "productivity", ia_writer: "productivity",
  scrivener: "productivity", grammarly: "productivity", languagetool: "productivity",
  hemingway: "productivity", zoho_writer: "productivity", quip: "productivity",
  paper: "productivity", confluence: "productivity", sharepoint: "productivity",
  
  // ==================== Communication ====================
  slack_v2: "communication", slack: "communication", slack_bot: "communication", 
  microsoft_teams: "communication", discord: "communication", discord_bot: "communication", 
  telegram_bot_api: "communication", telegram: "communication",
  gmail: "communication", gmail_custom_oauth: "communication",
  twilio: "communication", sendgrid: "communication", mailgun: "communication", 
  zoom: "communication", zoom_admin: "communication",
  whatsapp_business: "communication", whatsapp: "communication",
  intercom: "communication", postmark: "communication", amazon_ses: "communication",
  mailjet: "communication", sparkpost: "communication", sendinblue: "communication",
  nexmo: "communication", vonage: "communication", plivo: "communication",
  bandwidth: "communication", telnyx: "communication", messagebird: "communication",
  ringcentral: "communication", dialpad: "communication", aircall: "communication",
  twilio_sendgrid: "communication", mailtrap: "communication", mailersend: "communication",
  mailchimp_transactional: "communication", mandrill: "communication",
  pusher: "communication", socket_io: "communication", ably: "communication",
  pubnub: "communication", firebase_cloud_messaging: "communication",
  onesignal: "communication", pushover: "communication", pushbullet: "communication",
  webex: "communication", goto_meeting: "communication", bluejeans: "communication",
  whereby: "communication", daily_co: "communication", loom: "communication",
  calendly: "communication", acuity_scheduling: "communication", cal_com: "communication",
  
  // ==================== CRM & Sales ====================
  hubspot: "crm", salesforce_rest_api: "crm", salesforce: "crm",
  pipedrive: "crm", zoho_crm: "crm", activecampaign: "crm", 
  mailchimp: "crm", klaviyo: "crm", convertkit: "crm",
  brevo: "crm", customer_io: "crm", frontapp: "crm", front: "crm",
  close: "crm", copper: "crm", freshsales: "crm", insightly: "crm",
  agile_crm: "crm", nutshell: "crm", capsule: "crm", streak: "crm",
  affinity: "crm", folk: "crm", attio: "crm", clay: "crm",
  apollo_io: "crm", zoominfo: "crm", clearbit: "crm", lusha: "crm",
  hunter: "crm", snov_io: "crm", lemlist: "crm", reply_io: "crm",
  outreach: "crm", salesloft: "crm", gong: "crm", chorus: "crm",
  drift: "crm", qualified: "crm", chili_piper: "crm",
  
  // ==================== Database & Storage ====================
  supabase: "database", mysql: "database", postgresql: "database", mongodb: "database",
  firebase_admin_sdk: "database", firebase: "database",
  faunadb: "database", fauna: "database", snowflake: "database",
  redis: "database", elasticsearch: "database", cockroachdb: "database",
  planetscale: "database", neon: "database", turso: "database",
  dynamodb: "database", aws_dynamodb: "database", aws_rds: "database",
  azure_cosmos_db: "database", azure_sql: "database",
  google_cloud_sql: "database", google_cloud_firestore: "database",
  couchdb: "database", couchbase: "database", cassandra: "database",
  neo4j: "database", arangodb: "database", dgraph: "database",
  influxdb: "database", timescaledb: "database", clickhouse: "database",
  hasura: "database", prisma: "database", sqlite: "database",
  
  // ==================== Project Management ====================
  trello: "project", asana: "project", monday: "project", clickup: "project",
  jira: "project", jira_software: "project", linear: "project", linear_app: "project", 
  basecamp: "project", wrike: "project", teamwork: "project", pipefy: "project", 
  shortcut: "project", height: "project", notion_pm: "project",
  smartsheet: "project", airtable: "project", coda_pm: "project",
  microsoft_planner: "project", microsoft_project: "project",
  todoist_business: "project", any_do: "project", ticktick: "project",
  meistertask: "project", flow: "project", quire: "project",
  producthunt: "project", roadmunk: "project", productboard: "project",
  aha: "project", airfocus: "project", craft_io: "project",
  
  // ==================== Development & DevOps ====================
  github: "development", gitlab: "development", bitbucket: "development",
  netlify: "development", vercel: "development", vercel_token_auth: "development", 
  heroku: "development", railway: "development", render: "development", fly_io: "development",
  circleci: "development", github_actions: "development", jenkins: "development",
  travis_ci: "development", buildkite: "development", teamcity: "development",
  datadog: "development", new_relic: "development", sentry: "development",
  logdna: "development", papertrail: "development", loggly: "development",
  grafana: "development", prometheus: "development", splunk: "development",
  pagerduty: "development", opsgenie: "development", victorops: "development",
  statuspage: "development", atlassian_statuspage: "development",
  docker: "development", docker_hub: "development", kubernetes: "development",
  terraform: "development", pulumi: "development", ansible: "development",
  aws_lambda: "development", google_cloud_functions: "development", azure_functions: "development",
  cloudflare_workers: "development", deno_deploy: "development", supabase_functions: "development",
  postman: "development", insomnia: "development", swagger: "development",
  snyk: "development", sonarqube: "development", codecov: "development",
  figma: "development", sketch: "development", adobe_xd: "development",
  zeplin: "development", invision: "development", marvel: "development",
  abstract: "development", avocode: "development",
  
  // ==================== Payment & Billing ====================
  stripe: "payment", paypal: "payment", chargebee: "payment", recurly: "payment",
  square: "payment", braintree: "payment", paddle: "payment", lemonsqueezy: "payment",
  gocardless: "payment", mollie: "payment", adyen: "payment", worldpay: "payment",
  authorize_net: "payment", two_checkout: "payment", fastspring: "payment",
  razorpay: "payment", paytm: "payment", phonepe: "payment",
  wise: "payment", transferwise: "payment", payoneer: "payment",
  venmo: "payment", cashapp: "payment", zelle: "payment",
  klarna: "payment", afterpay: "payment", affirm: "payment", sezzle: "payment",
  crypto_com: "payment", coinbase_commerce: "payment", bitpay: "payment",
  
  // ==================== E-commerce ====================
  shopify: "ecommerce", shopify_developer_app: "ecommerce", shopify_partner: "ecommerce",
  woocommerce: "ecommerce", bigcommerce: "ecommerce", magento: "ecommerce",
  prestashop: "ecommerce", opencart: "ecommerce", squarespace_commerce: "ecommerce",
  wix_stores: "ecommerce", ecwid: "ecommerce", volusion: "ecommerce",
  saleor: "ecommerce", medusa: "ecommerce", commercejs: "ecommerce",
  amazon_seller: "ecommerce", amazon_sp_api: "ecommerce", ebay: "ecommerce",
  etsy: "ecommerce", depop: "ecommerce", poshmark: "ecommerce",
  printful: "ecommerce", printify: "ecommerce", gooten: "ecommerce",
  shipstation: "ecommerce", shippo: "ecommerce", easypost: "ecommerce",
  aftership: "ecommerce", ordoro: "ecommerce", skubana: "ecommerce",
  recharge: "ecommerce", bold_subscriptions: "ecommerce", ordergroove: "ecommerce",
  
  // ==================== Social Media ====================
  twitter: "social", x: "social", linkedin: "social", linkedin_ads: "social",
  facebook: "social", facebook_pages: "social", facebook_ads: "social",
  instagram: "social", instagram_business: "social", instagram_basic_display: "social",
  youtube_data_api: "social", youtube: "social", youtube_analytics: "social",
  tiktok: "social", tiktok_ads: "social", snapchat: "social",
  pinterest: "social", pinterest_ads: "social",
  reddit: "social", quora: "social", medium: "social", substack: "social",
  tumblr: "social", mastodon: "social", threads: "social", bluesky: "social",
  twitch: "social", twitch_api: "social", kick: "social",
  spotify: "social", soundcloud: "social", apple_music: "social",
  buffer: "social", hootsuite: "social", sprout_social: "social",
  later: "social", planoly: "social", tailwind: "social",
  
  // ==================== Forms & Surveys ====================
  typeform: "forms", jotform: "forms", google_forms: "forms", formstack: "forms",
  surveymonkey: "forms", qualtrics: "forms", alchemer: "forms",
  tally: "forms", paperform: "forms", cognito_forms: "forms",
  wufoo: "forms", formsite: "forms", formassembly: "forms",
  gravity_forms: "forms", wpforms: "forms", ninja_forms: "forms",
  heyflow: "forms", involve_me: "forms", leadpages: "forms",
  unbounce: "forms", instapage: "forms", landingi: "forms",
  formbricks: "forms", reform: "forms",
  
  // ==================== Analytics & BI ====================
  google_analytics: "analytics", google_analytics_4: "analytics",
  mixpanel: "analytics", amplitude: "analytics", segment: "analytics",
  heap: "analytics", pendo: "analytics", fullstory: "analytics",
  hotjar: "analytics", microsoft_clarity: "analytics", crazy_egg: "analytics",
  plausible: "analytics", fathom: "analytics", simple_analytics: "analytics",
  matomo: "analytics", umami: "analytics", countly: "analytics",
  posthog: "analytics", logrocket: "analytics", smartlook: "analytics",
  google_tag_manager: "analytics", gtm: "analytics",
  google_data_studio: "analytics", looker: "analytics", tableau: "analytics",
  power_bi: "analytics", metabase: "analytics", redash: "analytics",
  mode: "analytics", sisense: "analytics", domo: "analytics",
  
  // ==================== Cloud & Infrastructure ====================
  aws: "cloud", amazon_web_services: "cloud",
  google_cloud: "cloud", google_cloud_platform: "cloud", gcp: "cloud",
  microsoft_azure: "cloud", azure: "cloud",
  cloudflare: "cloud", cloudflare_api_key: "cloud",
  digital_ocean: "cloud", digitalocean: "cloud",
  linode: "cloud", vultr: "cloud", hetzner: "cloud",
  oracle_cloud: "cloud", ibm_cloud: "cloud", alibaba_cloud: "cloud",
  backblaze: "cloud", wasabi: "cloud", bunny_cdn: "cloud",
  fastly: "cloud", akamai: "cloud", cloudfront: "cloud",
  s3: "cloud", aws_s3: "cloud", google_cloud_storage: "cloud",
  azure_blob_storage: "cloud", minio: "cloud",
  
  // ==================== Customer Support ====================
  zendesk: "support", zendesk_chat: "support", zendesk_talk: "support",
  freshdesk: "support", freshservice: "support", freshchat: "support",
  intercom_support: "support", help_scout: "support", helpscout: "support",
  gorgias: "support", gorgias_oauth: "support", re_amaze: "support",
  kayako: "support", groove: "support", desk_com: "support",
  crisp: "support", tidio: "support", tawk_to: "support", livechat: "support",
  olark: "support", drift_support: "support", chatwoot: "support",
  kustomer: "support", gladly: "support", dixa: "support",
  
  // ==================== Automation & Integration ====================
  zapier: "automation", make: "automation", integromat: "automation",
  n8n: "automation", activepieces: "automation", tray_io: "automation",
  workato: "automation", celigo: "automation", boomi: "automation",
  mulesoft: "automation", snaplogic: "automation", jitterbit: "automation",
  ifttt: "automation", microsoft_power_automate: "automation",
  parabola: "automation", bardeen: "automation", browse_ai: "automation",
  
  // ==================== HR & Recruiting ====================
  bamboohr: "hr", workday: "hr", gusto: "hr", rippling: "hr",
  greenhouse: "hr", lever: "hr", ashby: "hr", gem: "hr",
  workable: "hr", breezy_hr: "hr", recruitee: "hr", teamtailor: "hr",
  deel: "hr", remote: "hr", oyster: "hr", papaya_global: "hr",
  lattice: "hr", culture_amp: "hr", fifteen_five: "hr", officevibe: "hr",
  namely: "hr", zenefits: "hr", personio: "hr", hibob: "hr",
  adp: "hr", paychex: "hr", paylocity: "hr", ceridian: "hr",
  
  // ==================== Finance & Accounting ====================
  quickbooks: "finance", quickbooks_online: "finance",
  xero: "finance", xero_accounting_api: "finance",
  freshbooks: "finance", wave: "finance", zoho_books: "finance",
  sage: "finance", sage_intacct: "finance", netsuite: "finance",
  bench: "finance", pilot: "finance", kruze: "finance",
  expensify: "finance", concur: "finance", divvy: "finance", brex: "finance",
  ramp: "finance", airbase: "finance", bill_com: "finance",
  plaid: "finance", yodlee: "finance", finicity: "finance",
  
  // ==================== Marketing & Advertising ====================
  google_ads: "marketing", facebook_ads_marketing: "marketing",
  linkedin_marketing: "marketing", twitter_ads: "marketing",
  tiktok_marketing: "marketing", pinterest_marketing: "marketing",
  snapchat_marketing: "marketing", reddit_ads: "marketing",
  mailerlite: "marketing", mautic: "marketing", constant_contact: "marketing",
  drip: "marketing", getresponse: "marketing", aweber: "marketing",
  moosend: "marketing", omnisend: "marketing", klaviyo_marketing: "marketing",
  hubspot_marketing: "marketing", marketo: "marketing", pardot: "marketing",
  eloqua: "marketing", sailthru: "marketing", iterable: "marketing",
  braze: "marketing", customer_io_marketing: "marketing", onesignal_marketing: "marketing",
  google_search_console: "marketing", ahrefs: "marketing", semrush: "marketing",
  moz: "marketing", screaming_frog: "marketing", surfer_seo: "marketing",
  
  // ==================== Design & Creative ====================
  canva: "design", adobe_creative_cloud: "design", figma_design: "design",
  sketch_design: "design", adobe_illustrator: "design", adobe_photoshop: "design",
  affinity_designer: "design", procreate: "design", pixelmator: "design",
  unsplash: "design", pexels: "design", shutterstock: "design", getty_images: "design",
  envato: "design", creative_market: "design", dribbble: "design", behance: "design",
  
  // ==================== Education & Learning ====================
  teachable: "education", thinkific: "education", kajabi: "education",
  podia: "education", gumroad_courses: "education", circle: "education",
  mighty_networks: "education", skool: "education", discord_education: "education",
  udemy: "education", coursera: "education", skillshare: "education",
  linkedin_learning: "education", pluralsight: "education", codecademy: "education",
  duolingo: "education", babbel: "education", rosetta_stone: "education",
  
  // ==================== Legal & Compliance ====================
  docusign: "legal", pandadoc: "legal", hellosign: "legal", signnow: "legal",
  adobe_sign: "legal", docuseal: "legal", signwell: "legal",
  contractbook: "legal", ironclad: "legal", docucollab: "legal",
  
  // ==================== Real Estate ====================
  zillow: "realestate", redfin: "realestate", realtor_com: "realestate",
  mls: "realestate", follow_up_boss: "realestate", lion_desk: "realestate",
  
  // ==================== Healthcare ====================
  epic: "healthcare", cerner: "healthcare", athenahealth: "healthcare",
  practice_fusion: "healthcare", kareo: "healthcare", drchrono: "healthcare",
  
  // ==================== IoT & Hardware ====================
  particle: "iot", arduino: "iot", raspberry_pi: "iot",
  philips_hue: "iot", nest: "iot", ring: "iot",
  smartthings: "iot", home_assistant: "iot", homekit: "iot",
};

export const getCategoryFromSlug = (slug: string): string => {
  // Direct match
  if (extendedCategoryMap[slug]) return extendedCategoryMap[slug];
  
  // Pattern-based categorization
  const patterns: [RegExp, string][] = [
    // AI
    [/^(ai_|gpt|llm|claude|gemini|palm|bard|copilot|chat_?bot)/i, "ai"],
    [/(openai|anthropic|cohere|hugging|replicate|stable_?diffusion)/i, "ai"],
    
    // Communication
    [/(mail|email|smtp|imap|inbox)/i, "communication"],
    [/(sms|text|messaging|chat|voice|call|phone)/i, "communication"],
    [/(slack|teams|discord|telegram|whatsapp)/i, "communication"],
    
    // Database
    [/(sql|db|database|mongo|postgres|mysql|redis|elastic)/i, "database"],
    [/(firebase|supabase|fauna|dynamo|cosmos)/i, "database"],
    
    // Cloud
    [/(aws|amazon|azure|google_cloud|gcp|digitalocean|linode)/i, "cloud"],
    [/(cloud|s3|storage|cdn|hosting)/i, "cloud"],
    
    // Development
    [/(github|gitlab|bitbucket|git|repo|code)/i, "development"],
    [/(deploy|ci|cd|build|test|lint|docker|kubernetes)/i, "development"],
    [/(sentry|datadog|newrelic|log|monitor|apm)/i, "development"],
    
    // E-commerce
    [/(shop|store|commerce|cart|checkout|order|product)/i, "ecommerce"],
    [/(shopify|woo|magento|bigcommerce|stripe_connect)/i, "ecommerce"],
    
    // Marketing
    [/(marketing|ads|advertising|campaign|seo|analytics)/i, "marketing"],
    [/(mailchimp|mailerlite|sendgrid|campaign|newsletter)/i, "marketing"],
    
    // CRM
    [/(crm|sales|lead|contact|deal|pipeline|customer)/i, "crm"],
    [/(hubspot|salesforce|pipedrive|zoho)/i, "crm"],
    
    // Project
    [/(project|task|todo|board|kanban|sprint|agile)/i, "project"],
    [/(trello|asana|jira|monday|clickup|notion)/i, "project"],
    
    // Payment
    [/(pay|payment|billing|invoice|subscription|charge)/i, "payment"],
    [/(stripe|paypal|square|braintree)/i, "payment"],
    
    // Forms
    [/(form|survey|quiz|poll|feedback)/i, "forms"],
    [/(typeform|jotform|google_forms)/i, "forms"],
    
    // Social
    [/(social|twitter|facebook|instagram|linkedin|tiktok|youtube)/i, "social"],
    [/(reddit|pinterest|twitch|spotify)/i, "social"],
    
    // HR
    [/(hr|recruit|hiring|employee|payroll|talent)/i, "hr"],
    [/(bamboo|workday|gusto|greenhouse|lever)/i, "hr"],
    
    // Finance
    [/(finance|accounting|book|expense|invoice|tax)/i, "finance"],
    [/(quickbooks|xero|freshbooks|wave)/i, "finance"],
    
    // Support
    [/(support|ticket|help|desk|customer_service)/i, "support"],
    [/(zendesk|freshdesk|intercom|crisp)/i, "support"],
    
    // Automation
    [/(automation|workflow|integrate|sync|trigger|webhook)/i, "automation"],
    [/(zapier|make|n8n|ifttt)/i, "automation"],
    
    // Analytics
    [/(analytics|tracking|metric|insight|report|dashboard)/i, "analytics"],
    [/(google_analytics|mixpanel|amplitude|segment)/i, "analytics"],
  ];
  
  for (const [pattern, category] of patterns) {
    if (pattern.test(slug)) return category;
  }
  
  return "other";
};
