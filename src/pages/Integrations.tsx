import { useState, useCallback, useEffect } from "react";
import { Search, Loader2, Sparkles, ExternalLink, Copy, Check, ArrowLeft, Blocks } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { pipedreamApi, PipedreamApp, PipedreamAppDetails, PipedreamAction } from "@/lib/api/pipedream";
import IntegrationLogo from "@/components/integrations/IntegrationLogo";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Integrations = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PipedreamApp[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedApp, setSelectedApp] = useState<PipedreamAppDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular apps for initial display
  const popularApps: PipedreamApp[] = [
    { slug: "gmail", name: "Gmail" },
    { slug: "slack", name: "Slack" },
    { slug: "notion", name: "Notion" },
    { slug: "google_sheets", name: "Google Sheets" },
    { slug: "openai", name: "OpenAI" },
    { slug: "hubspot", name: "HubSpot" },
    { slug: "stripe", name: "Stripe" },
    { slug: "github", name: "GitHub" },
    { slug: "discord", name: "Discord" },
    { slug: "airtable", name: "Airtable" },
    { slug: "trello", name: "Trello" },
    { slug: "salesforce_rest_api", name: "Salesforce" },
  ];

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSuggestions(true);
      
      try {
        const response = await pipedreamApi.searchApps(searchQuery);
        if (response.success && response.data) {
          setSearchResults(response.data);
        } else {
          // Fallback to filtering popular apps
          const filtered = popularApps.filter(app => 
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.slug.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback
        const filtered = popularApps.filter(app => 
          app.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectApp = useCallback(async (app: PipedreamApp) => {
    setShowSuggestions(false);
    setSearchQuery(app.name);
    setIsLoadingDetails(true);

    try {
      const response = await pipedreamApi.getAppDetails(app.slug);
      if (response.success && response.data) {
        setSelectedApp(response.data);
      } else {
        toast({
          title: t("Erreur", "Error"),
          description: response.error || t("Impossible de charger les détails", "Failed to load details"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Load details error:', error);
      toast({
        title: t("Erreur", "Error"),
        description: t("Impossible de charger les détails de l'application", "Failed to load app details"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  }, [t, toast]);

  const handleBack = () => {
    setSelectedApp(null);
    setSearchQuery("");
  };

  return (
    <MainLayout title={t("Intégrations", "Integrations")}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t("Le catalogue d'intégrations IA", "The AI Integration Catalog")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Plus de 3000 intégrations disponibles. Recherchez une app et découvrez ses actions en temps réel.",
              "Over 3000 integrations available. Search for an app and discover its actions in real-time."
            )}
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t("Rechercher une app (Gmail, Slack, Notion...)", "Search for an app (Gmail, Slack, Notion...)")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedApp) setSelectedApp(null);
                }}
                onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
                className="pl-12 h-14 text-lg rounded-2xl border-border/50 bg-background shadow-lg"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchResults.length > 0 && !selectedApp && (
              <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-auto shadow-xl border-border/50">
                <CardContent className="p-2">
                  {searchResults.map((app) => (
                    <button
                      key={app.slug}
                      onClick={() => handleSelectApp(app)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <IntegrationLogo slug={app.slug} name={app.name} size="sm" />
                      <span className="font-medium text-foreground">{app.name}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoadingDetails && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              {t("Chargement des actions disponibles...", "Loading available actions...")}
            </p>
          </div>
        )}

        {/* Selected App Details */}
        {selectedApp && !isLoadingDetails && (
          <div className="space-y-6">
            {/* Back Button */}
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Nouvelle recherche", "New search")}
            </Button>

            {/* App Header */}
            <div className="flex items-start gap-6 p-6 bg-card rounded-2xl border border-border/50">
              <IntegrationLogo 
                slug={selectedApp.slug} 
                name={selectedApp.name} 
                size="lg"
                className="rounded-2xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold text-foreground">{selectedApp.name}</h2>
                  <Badge variant="secondary">{selectedApp.category}</Badge>
                  <Badge variant="outline">
                    {selectedApp.actions.length} {t("actions", "actions")}
                  </Badge>
                </div>
                {selectedApp.description && (
                  <p className="text-muted-foreground mt-2 max-w-3xl">
                    {selectedApp.description}
                  </p>
                )}
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <a href={selectedApp.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {t("Voir sur Pipedream", "View on Pipedream")}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                {t("Actions disponibles", "Available Actions")}
              </h3>
              
              {selectedApp.actions.length > 0 ? (
                <div className="grid gap-4">
                  {selectedApp.actions.map((action, index) => (
                    <ActionCard 
                      key={index} 
                      action={action} 
                      appName={selectedApp.name}
                      language={language} 
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Blocks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t("Aucune action trouvée pour cette app", "No actions found for this app")}
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Popular Apps Grid (when nothing selected) */}
        {!selectedApp && !isLoadingDetails && searchQuery.length < 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-semibold text-foreground">
                {t("Apps populaires", "Popular Apps")}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularApps.map((app) => (
                <button
                  key={app.slug}
                  onClick={() => handleSelectApp(app)}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                      <IntegrationLogo 
                        slug={app.slug} 
                        name={app.name} 
                        size="lg"
                        className="rounded-xl"
                      />
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {app.name}
                      </span>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface ActionCardProps {
  action: PipedreamAction;
  appName: string;
  language: "fr" | "en";
}

const ActionCard = ({ action, appName, language }: ActionCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a prompt for this action
  const generatePrompt = () => {
    const actionLower = action.name.toLowerCase();
    
    if (language === "fr") {
      if (actionLower.includes("send") || actionLower.includes("envoi")) {
        return `Envoie via ${appName} : ${action.name}. Utilise les paramètres suivants : [paramètres]`;
      }
      if (actionLower.includes("create") || actionLower.includes("créer")) {
        return `Crée dans ${appName} : ${action.name}. Détails : [détails]`;
      }
      if (actionLower.includes("update") || actionLower.includes("mettre à jour")) {
        return `Met à jour dans ${appName} : ${action.name}. Modifications : [modifications]`;
      }
      if (actionLower.includes("delete") || actionLower.includes("supprimer")) {
        return `Supprime de ${appName} : ${action.name}. Identifiant : [id]`;
      }
      if (actionLower.includes("get") || actionLower.includes("find") || actionLower.includes("list") || actionLower.includes("retrieve")) {
        return `Récupère depuis ${appName} : ${action.name}. Filtres : [filtres]`;
      }
      return `Exécute "${action.name}" via ${appName} avec les paramètres : [paramètres]`;
    } else {
      if (actionLower.includes("send")) {
        return `Send via ${appName}: ${action.name}. Use the following parameters: [parameters]`;
      }
      if (actionLower.includes("create")) {
        return `Create in ${appName}: ${action.name}. Details: [details]`;
      }
      if (actionLower.includes("update")) {
        return `Update in ${appName}: ${action.name}. Changes: [changes]`;
      }
      if (actionLower.includes("delete")) {
        return `Delete from ${appName}: ${action.name}. Identifier: [id]`;
      }
      if (actionLower.includes("get") || actionLower.includes("find") || actionLower.includes("list") || actionLower.includes("retrieve")) {
        return `Retrieve from ${appName}: ${action.name}. Filters: [filters]`;
      }
      return `Execute "${action.name}" via ${appName} with parameters: [parameters]`;
    }
  };

  const prompt = generatePrompt();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast({
      title: t("Copié !", "Copied!"),
      description: t("Le prompt a été copié dans le presse-papier", "The prompt has been copied to clipboard"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlight variables in the prompt
  const highlightVariables = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={index} className="bg-primary/20 text-primary px-1 rounded font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">{action.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
          </div>
          {action.githubUrl && (
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <a href={action.githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 relative">
          <p className="text-sm pr-12 leading-relaxed">
            {highlightVariables(prompt)}
          </p>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t(
            "Les éléments entre [crochets] sont à personnaliser",
            "Elements in [brackets] should be customized"
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default Integrations;
