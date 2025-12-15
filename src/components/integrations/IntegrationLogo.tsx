import { useState } from "react";
import { cn } from "@/lib/utils";

// Color palette for logo backgrounds based on first letter
const colorPalette: Record<string, string> = {
  a: "bg-red-500", b: "bg-orange-500", c: "bg-amber-500", d: "bg-yellow-500",
  e: "bg-lime-500", f: "bg-green-500", g: "bg-emerald-500", h: "bg-teal-500",
  i: "bg-cyan-500", j: "bg-sky-500", k: "bg-blue-500", l: "bg-indigo-500",
  m: "bg-violet-500", n: "bg-purple-500", o: "bg-fuchsia-500", p: "bg-pink-500",
  q: "bg-rose-500", r: "bg-red-600", s: "bg-orange-600", t: "bg-amber-600",
  u: "bg-green-600", v: "bg-teal-600", w: "bg-blue-600", x: "bg-indigo-600",
  y: "bg-purple-600", z: "bg-pink-600",
};

// Known brand colors for popular integrations
const brandColors: Record<string, { bg: string; text: string }> = {
  openai: { bg: "bg-[#10A37F]", text: "text-white" },
  anthropic: { bg: "bg-[#D4A27F]", text: "text-black" },
  notion: { bg: "bg-black", text: "text-white" },
  slack_v2: { bg: "bg-[#4A154B]", text: "text-white" },
  google_sheets: { bg: "bg-[#0F9D58]", text: "text-white" },
  gmail: { bg: "bg-[#EA4335]", text: "text-white" },
  hubspot: { bg: "bg-[#FF7A59]", text: "text-white" },
  airtable_oauth: { bg: "bg-[#18BFFF]", text: "text-white" },
  trello: { bg: "bg-[#0079BF]", text: "text-white" },
  discord: { bg: "bg-[#5865F2]", text: "text-white" },
  github: { bg: "bg-[#181717]", text: "text-white" },
  stripe: { bg: "bg-[#635BFF]", text: "text-white" },
  google_drive: { bg: "bg-[#4285F4]", text: "text-white" },
  google_calendar: { bg: "bg-[#4285F4]", text: "text-white" },
  salesforce_rest_api: { bg: "bg-[#00A1E0]", text: "text-white" },
  mailchimp: { bg: "bg-[#FFE01B]", text: "text-black" },
  typeform: { bg: "bg-[#262627]", text: "text-white" },
  asana: { bg: "bg-[#F06A6A]", text: "text-white" },
  jira: { bg: "bg-[#0052CC]", text: "text-white" },
  shopify: { bg: "bg-[#96BF48]", text: "text-white" },
  twilio: { bg: "bg-[#F22F46]", text: "text-white" },
  sendgrid: { bg: "bg-[#1A82E2]", text: "text-white" },
  supabase: { bg: "bg-[#3ECF8E]", text: "text-white" },
  postgresql: { bg: "bg-[#336791]", text: "text-white" },
  mongodb: { bg: "bg-[#47A248]", text: "text-white" },
  telegram_bot_api: { bg: "bg-[#26A5E4]", text: "text-white" },
  zoom: { bg: "bg-[#2D8CFF]", text: "text-white" },
  microsoft_teams: { bg: "bg-[#6264A7]", text: "text-white" },
  dropbox: { bg: "bg-[#0061FF]", text: "text-white" },
  clickup: { bg: "bg-[#7B68EE]", text: "text-white" },
  linear: { bg: "bg-[#5E6AD2]", text: "text-white" },
  zendesk: { bg: "bg-[#03363D]", text: "text-white" },
  intercom: { bg: "bg-[#1F8DED]", text: "text-white" },
  klaviyo: { bg: "bg-[#12B980]", text: "text-white" },
  figma: { bg: "bg-[#F24E1E]", text: "text-white" },
  webflow: { bg: "bg-[#4353FF]", text: "text-white" },
  firebase_admin_sdk: { bg: "bg-[#FFCA28]", text: "text-black" },
  aws: { bg: "bg-[#FF9900]", text: "text-black" },
  vercel_token_auth: { bg: "bg-black", text: "text-white" },
  netlify: { bg: "bg-[#00C7B7]", text: "text-white" },
  paypal: { bg: "bg-[#003087]", text: "text-white" },
  whatsapp_business: { bg: "bg-[#25D366]", text: "text-white" },
  linkedin: { bg: "bg-[#0A66C2]", text: "text-white" },
  twitter: { bg: "bg-black", text: "text-white" },
  youtube_data_api: { bg: "bg-[#FF0000]", text: "text-white" },
  twitch: { bg: "bg-[#9146FF]", text: "text-white" },
  reddit: { bg: "bg-[#FF4500]", text: "text-white" },
  pinterest: { bg: "bg-[#E60023]", text: "text-white" },
  spotify: { bg: "bg-[#1DB954]", text: "text-white" },
  google_analytics: { bg: "bg-[#E37400]", text: "text-white" },
  mixpanel: { bg: "bg-[#7856FF]", text: "text-white" },
  segment: { bg: "bg-[#52BD94]", text: "text-white" },
  amplitude: { bg: "bg-[#1E61DC]", text: "text-white" },
  freshdesk: { bg: "bg-[#25C16F]", text: "text-white" },
  woocommerce: { bg: "bg-[#96588A]", text: "text-white" },
  bigcommerce: { bg: "bg-[#121118]", text: "text-white" },
};

// Logo URLs from multiple reliable CDNs with fallback chain
const getLogoUrls = (slug: string): string[] => {
  const urls: string[] = [];
  
  // Simple Icons CDN for known brands
  const simpleIconsMap: Record<string, string> = {
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
  
  const simpleIconSlug = simpleIconsMap[slug];
  if (simpleIconSlug) {
    urls.push(`https://cdn.simpleicons.org/${simpleIconSlug}`);
  }
  
  // Clearbit Logo API (works for many company domains)
  const clearbitMap: Record<string, string> = {
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
  
  const clearbitDomain = clearbitMap[slug];
  if (clearbitDomain) {
    urls.push(`https://logo.clearbit.com/${clearbitDomain}`);
  }
  
  // Pipedream's own logo CDN (fallback)
  urls.push(`https://pipedream.com/s.v0/${slug.replace(/_/g, '-')}/logo/48`);
  
  return urls;
};

interface IntegrationLogoProps {
  slug: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: { container: "w-8 h-8", icon: "w-5 h-5", text: "text-xs" },
  md: { container: "w-10 h-10", icon: "w-6 h-6", text: "text-sm" },
  lg: { container: "w-16 h-16", icon: "w-10 h-10", text: "text-xl" },
};

export const IntegrationLogo = ({ slug, name, size = "md", className }: IntegrationLogoProps) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const logoUrls = getLogoUrls(slug);
  const sizes = sizeClasses[size];
  
  // Get brand color or fallback to letter-based color
  const firstLetter = name.charAt(0).toLowerCase();
  const brandStyle = brandColors[slug];
  const bgColor = brandStyle?.bg || colorPalette[firstLetter] || "bg-primary";
  const textColor = brandStyle?.text || "text-white";

  const handleError = () => {
    // Try next URL in the fallback chain
    if (currentUrlIndex < logoUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      // All URLs failed, show fallback
      setCurrentUrlIndex(-1);
    }
  };

  // Show letter fallback if all URLs failed
  if (currentUrlIndex === -1 || logoUrls.length === 0) {
    return (
      <div className={cn(
        sizes.container,
        "rounded-lg flex items-center justify-center shrink-0 font-bold",
        bgColor,
        textColor,
        className
      )}>
        <span className={sizes.text}>{name.charAt(0).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      sizes.container,
      "rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0",
      className
    )}>
      <img
        src={logoUrls[currentUrlIndex]}
        alt={name}
        className={cn(sizes.icon, "object-contain")}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default IntegrationLogo;
