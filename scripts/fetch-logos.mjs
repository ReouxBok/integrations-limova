import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import des slugs depuis le fichier TypeScript
// On va lire directement le fichier et extraire les slugs
const slugsFile = path.join(__dirname, "..", "src", "lib", "all-integration-slugs.ts");
const slugsContent = fs.readFileSync(slugsFile, "utf-8");
const slugsMatch = slugsContent.match(/export const allIntegrationSlugs = \[([\s\S]*?)\];/);
const slugsArray = slugsMatch
  ? slugsMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter((s) => s.length > 0)
  : [];

const OUTPUT_DIR = path.join(__dirname, "..", "public", "integration-logos");

// Mappings depuis IntegrationLogo.tsx
const simpleIconsMap = {
  openai: "openai",
  anthropic: "anthropic",
  notion: "notion",
  slack_v2: "slack",
  google_sheets: "googlesheets",
  gmail: "gmail",
  hubspot: "hubspot",
  airtable_oauth: "airtable",
  trello: "trello",
  discord: "discord",
  github: "github",
  stripe: "stripe",
  google_drive: "googledrive",
  google_calendar: "googlecalendar",
  salesforce_rest_api: "salesforce",
  mailchimp: "mailchimp",
  typeform: "typeform",
  asana: "asana",
  jira: "jira",
  shopify: "shopify",
  twilio: "twilio",
  sendgrid: "sendgrid",
  supabase: "supabase",
  postgresql: "postgresql",
  mongodb: "mongodb",
  telegram_bot_api: "telegram",
  zoom: "zoom",
  microsoft_teams: "microsoftteams",
  dropbox: "dropbox",
  clickup: "clickup",
  linear: "linear",
  zendesk: "zendesk",
  intercom: "intercom",
  figma: "figma",
  webflow: "webflow",
  firebase_admin_sdk: "firebase",
  aws: "amazonaws",
  vercel_token_auth: "vercel",
  netlify: "netlify",
  paypal: "paypal",
  whatsapp_business: "whatsapp",
  linkedin: "linkedin",
  twitter: "x",
  youtube_data_api: "youtube",
  twitch: "twitch",
  reddit: "reddit",
  pinterest: "pinterest",
  spotify: "spotify",
  google_analytics: "googleanalytics",
  mixpanel: "mixpanel",
  amplitude: "amplitude",
  freshdesk: "freshdesk",
  woocommerce: "woocommerce",
  bigcommerce: "bigcommerce",
  bitbucket: "bitbucket",
  gitlab: "gitlab",
  circleci: "circleci",
  datadog: "datadog",
  sentry: "sentry",
  heroku: "heroku",
  digitalocean: "digitalocean",
  cloudflare_api_key: "cloudflare",
  mysql: "mysql",
  redis: "redis",
  elasticsearch: "elasticsearch",
  docker: "docker",
  kubernetes: "kubernetes",
  jenkins: "jenkins",
  todoist: "todoist",
  evernote: "evernote",
  box: "box",
  google_docs: "googledocs",
  google_forms: "googleforms",
  google_cloud: "googlecloud",
  azure_openai_service: "microsoftazure",
  activecampaign: "activecampaign",
  convertkit: "convertkit",
  brevo: "brevo",
  customer_io: "customerio",
  chargebee: "chargebee",
  recurly: "recurly",
  square: "square",
  monday: "monday",
  basecamp: "basecamp",
  wrike: "wrike",
  calendly_v2: "calendly",
  canva: "canva",
  adobe_pdf_services: "adobe",
  mailgun: "mailgun",
  postmark: "postmarkapp",
  amazon_ses: "amazonses",
  braintree: "braintree",
  quickbooks: "quickbooks",
  xero_accounting_api: "xero",
  freshbooks: "freshbooks",
  zoho_crm: "zoho",
  pipedrive: "pipedrive",
  copper: "copper",
  close: "close",
  docusign: "docusign",
  pandadoc: "pandadoc",
  calendly: "calendly",
  acuity_scheduling: "acuityscheduling",
  zapier: "zapier",
  make: "make",
  n8n: "n8n",
  ifttt: "ifttt",
  segment: "segment",
  hotjar: "hotjar",
  crazyegg: "crazyegg",
  google_tag_manager: "googletagmanager",
  facebook: "facebook",
  instagram: "instagram",
  tiktok: "tiktok",
  snapchat: "snapchat",
  buffer: "buffer",
  hootsuite: "hootsuite",
  later: "later",
  sprout_social: "sproutsocial",
  miro: "miro",
  loom: "loom",
  coda: "coda",
  airtable: "airtable",
  smartsheet: "smartsheet",
  workday: "workday",
  bamboohr: "bamboohr",
  gusto: "gusto",
  rippling: "rippling",
  greenhouse: "greenhouse",
  lever: "lever",
  workable: "workable",
  jazz_hr: "jazzhr",
  atlassian: "atlassian",
  confluence: "confluence",
  bitbucket_data_center: "bitbucket",
  opsgenie: "opsgenie",
  pagerduty: "pagerduty",
  statuspage: "statuspageio",
  newrelic: "newrelic",
  splunk: "splunk",
  grafana: "grafana",
  prometheus: "prometheus",
  terraform: "terraform",
  ansible: "ansible",
  pulumi: "pulumi",
  vault: "vault",
  consul: "consul",
  nomad: "nomad",
  kong: "kong",
  nginx: "nginx",
  apache: "apache",
  rabbitmq: "rabbitmq",
  kafka: "apachekafka",
  airflow: "apacheairflow",
  spark: "apachespark",
  hadoop: "apachehadoop",
  databricks: "databricks",
  snowflake: "snowflake",
  dbt: "dbt",
  looker: "looker",
  tableau: "tableau",
  powerbi: "powerbi",
  metabase: "metabase",
  superset: "apachesuperset",
  retool: "retool",
  appsmith: "appsmith",
  plasmic: "plasmic",
  framer: "framer",
  sketch: "sketch",
  invision: "invision",
  zeplin: "zeplin",
  abstract: "abstract",
  marvel: "marvel",
  principle: "principle",
  proto_io: "protoio",
  balsamiq: "balsamiq",
  lucid: "lucid",
  mural: "mural",
  stormboard: "stormboard",
  microsoft_azure: "microsoftazure",
  google_cloud_platform: "googlecloud",
  alibaba_cloud: "alibabacloud",
  oracle_cloud: "oracle",
  ibm_cloud: "ibmcloud",
  vultr: "vultr",
  linode: "linode",
  render: "render",
  railway: "railway",
  fly_io: "flydotio",
  deno: "deno",
  bun: "bun",
  nodejs: "nodedotjs",
  python: "python",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  java: "java",
  kotlin: "kotlin",
  swift: "swift",
  typescript: "typescript",
  javascript: "javascript",
  react: "react",
  vue: "vuedotjs",
  angular: "angular",
  svelte: "svelte",
  nextjs: "nextdotjs",
  nuxt: "nuxtdotjs",
  gatsby: "gatsby",
  remix: "remix",
  astro: "astro",
  eleventy: "eleventy",
  hugo: "hugo",
  jekyll: "jekyll",
};

const clearbitMap = {
  openai: "openai.com",
  anthropic: "anthropic.com",
  notion: "notion.so",
  slack_v2: "slack.com",
  google_sheets: "google.com",
  gmail: "gmail.com",
  hubspot: "hubspot.com",
  airtable_oauth: "airtable.com",
  trello: "trello.com",
  discord: "discord.com",
  github: "github.com",
  stripe: "stripe.com",
  google_drive: "google.com",
  salesforce_rest_api: "salesforce.com",
  mailchimp: "mailchimp.com",
  typeform: "typeform.com",
  asana: "asana.com",
  jira: "atlassian.com",
  shopify: "shopify.com",
  twilio: "twilio.com",
  sendgrid: "sendgrid.com",
  supabase: "supabase.com",
  zoom: "zoom.us",
  microsoft_teams: "microsoft.com",
  dropbox: "dropbox.com",
  clickup: "clickup.com",
  linear: "linear.app",
  zendesk: "zendesk.com",
  intercom: "intercom.com",
  figma: "figma.com",
  webflow: "webflow.com",
  netlify: "netlify.com",
  vercel_token_auth: "vercel.com",
  paypal: "paypal.com",
  linkedin: "linkedin.com",
  youtube_data_api: "youtube.com",
  twitch: "twitch.tv",
  reddit: "reddit.com",
  pinterest: "pinterest.com",
  spotify: "spotify.com",
  mixpanel: "mixpanel.com",
  amplitude: "amplitude.com",
  freshdesk: "freshdesk.com",
  woocommerce: "woocommerce.com",
  gitlab: "gitlab.com",
  bitbucket: "bitbucket.org",
  circleci: "circleci.com",
  datadog: "datadoghq.com",
  sentry: "sentry.io",
  heroku: "heroku.com",
  cloudflare_api_key: "cloudflare.com",
  todoist: "todoist.com",
  evernote: "evernote.com",
  box: "box.com",
  activecampaign: "activecampaign.com",
  convertkit: "convertkit.com",
  monday: "monday.com",
  basecamp: "basecamp.com",
  wrike: "wrike.com",
  canva: "canva.com",
  mailgun: "mailgun.com",
  braintree: "braintreegateway.com",
  quickbooks: "quickbooks.intuit.com",
  xero_accounting_api: "xero.com",
  freshbooks: "freshbooks.com",
  zoho_crm: "zoho.com",
  pipedrive: "pipedrive.com",
  docusign: "docusign.com",
  calendly_v2: "calendly.com",
  zapier: "zapier.com",
  segment: "segment.com",
  hotjar: "hotjar.com",
  facebook: "facebook.com",
  instagram: "instagram.com",
  buffer: "buffer.com",
  miro: "miro.com",
  loom: "loom.com",
  coda: "coda.io",
  smartsheet: "smartsheet.com",
  bamboohr: "bamboohr.com",
  greenhouse: "greenhouse.io",
  lever: "lever.co",
  confluence: "atlassian.com",
  pagerduty: "pagerduty.com",
  newrelic: "newrelic.com",
  grafana: "grafana.com",
  databricks: "databricks.com",
  snowflake: "snowflake.com",
  looker: "looker.com",
  tableau: "tableau.com",
  metabase: "metabase.com",
  retool: "retool.com",
  sketch: "sketch.com",
  invision: "invisionapp.com",
  mural: "mural.co",
  render: "render.com",
  railway: "railway.app",
};

function getCandidateUrls(slug) {
  const urls = [];

  // 1) Simple Icons
  const simpleIconSlug = simpleIconsMap[slug];
  if (simpleIconSlug) {
    urls.push({
      url: `https://cdn.simpleicons.org/${simpleIconSlug}`,
      source: "simpleicons",
    });
  }

  // 2) jsDelivr Pipedream (repo original)
  urls.push({
    url: `https://cdn.jsdelivr.net/gh/PipedreamHQ/pipedream@master/components/${slug}/${slug}.svg`,
    source: "jsdelivr",
  });

  // 3) Pipedream s.v0
  urls.push({
    url: `https://pipedream.com/s.v0/${slug.replace(/_/g, "-")}/logo/48`,
    source: "pipedream",
  });

  // 4) Clearbit
  const clearbitDomain = clearbitMap[slug];
  if (clearbitDomain) {
    urls.push({
      url: `https://logo.clearbit.com/${clearbitDomain}`,
      source: "clearbit",
    });
  }

  return urls;
}

function fileExists(slug) {
  const png = path.join(OUTPUT_DIR, `${slug}.png`);
  const svg = path.join(OUTPUT_DIR, `${slug}.svg`);
  return fs.existsSync(png) || fs.existsSync(svg);
}

function download(url, dest) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    const file = fs.createWriteStream(dest);
    const request = client.get(url, (res) => {
      const contentType = res.headers["content-type"] || "";
      
      // Vérifier que c'est bien une image
      if (res.statusCode !== 200 || !contentType.startsWith("image")) {
        res.resume();
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch (e) {
          // Ignore si le fichier n'existe pas
        }
        return resolve({ success: false, reason: `Invalid status/content-type: ${res.statusCode} ${contentType}` });
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve({ success: true, contentType });
      });
    });

    request.on("error", (err) => {
      file.close();
      try {
        fs.unlinkSync(dest);
      } catch (e) {
        // Ignore si le fichier n'existe pas
      }
      resolve({ success: false, reason: err.message });
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      try {
        fs.unlinkSync(dest);
      } catch (e) {
        // Ignore si le fichier n'existe pas
      }
      resolve({ success: false, reason: "Timeout" });
    });
  });
}

async function fetchLogoForSlug(slug, delay = 100) {
  if (fileExists(slug)) {
    return { success: true, skipped: true };
  }

  const candidates = getCandidateUrls(slug);
  
  for (const candidate of candidates) {
    // Déterminer l'extension depuis l'URL ou le content-type
    let ext = "png";
    if (candidate.url.includes(".svg")) {
      ext = "svg";
    }

    const dest = path.join(OUTPUT_DIR, `${slug}.${ext}`);
    
    const result = await download(candidate.url, dest);
    
    if (result.success) {
      // Si le content-type indique SVG mais qu'on a sauvegardé en PNG, renommer
      if (result.contentType?.includes("svg") && ext === "png") {
        const svgDest = path.join(OUTPUT_DIR, `${slug}.svg`);
        fs.renameSync(dest, svgDest);
      }
      
      // Petit délai pour éviter de surcharger les serveurs
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      return { success: true, source: candidate.source, url: candidate.url };
    }
  }

  return { success: false };
}

async function main() {
  console.log("🚀 Démarrage de la récupération des logos...\n");
  
  // Créer le dossier de sortie
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const total = slugsArray.length;
  let success = 0;
  let skipped = 0;
  let failed = 0;
  const missing = [];

  console.log(`📦 ${total} intégrations à traiter\n`);

  for (let i = 0; i < slugsArray.length; i++) {
    const slug = slugsArray[i];
    const progress = `[${i + 1}/${total}]`;

    try {
      const result = await fetchLogoForSlug(slug, 50); // Délai de 50ms entre chaque requête

      if (result.skipped) {
        skipped++;
        console.log(`${progress} ⏭️  ${slug} (déjà présent)`);
      } else if (result.success) {
        success++;
        console.log(`${progress} ✅ ${slug} (${result.source})`);
      } else {
        failed++;
        missing.push(slug);
        console.log(`${progress} ❌ ${slug} (aucun logo trouvé)`);
      }
    } catch (error) {
      failed++;
      missing.push(slug);
      console.log(`${progress} ❌ ${slug} (erreur: ${error.message})`);
    }

    // Afficher un résumé tous les 100 logos
    if ((i + 1) % 100 === 0) {
      console.log(`\n📊 Progression: ${success} ✅ | ${skipped} ⏭️  | ${failed} ❌\n`);
    }
  }

  // Sauvegarder la liste des logos manquants
  if (missing.length > 0) {
    const missingFile = path.join(OUTPUT_DIR, "..", "missing-logos.txt");
    fs.writeFileSync(missingFile, missing.join("\n"), "utf-8");
    console.log(`\n📝 ${missing.length} logos manquants sauvegardés dans missing-logos.txt`);
  }

  console.log(`\n✨ Terminé !`);
  console.log(`   ✅ ${success} logos téléchargés`);
  console.log(`   ⏭️  ${skipped} logos déjà présents`);
  console.log(`   ❌ ${failed} logos manquants`);
  console.log(`\n📁 Logos sauvegardés dans: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error("❌ Erreur fatale:", error);
  process.exit(1);
});

