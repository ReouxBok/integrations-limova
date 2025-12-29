import { useState, useCallback, useEffect, useRef } from "react";
import { Search, Loader2, Sparkles, ExternalLink, Copy, Check, ArrowLeft, Blocks, Zap, ChevronRight, Keyboard } from "lucide-react";
import MinimalLayout from "@/components/layout/MinimalLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { pipedreamApi, PipedreamApp, PipedreamAppDetails, PipedreamAction } from "@/lib/api/pipedream";
import IntegrationLogo from "@/components/integrations/IntegrationLogo";

const Integrations = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PipedreamApp[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedApp, setSelectedApp] = useState<PipedreamAppDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

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

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      setHighlightedIndex(0);
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
          const filtered = popularApps.filter(app => 
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.slug.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } catch (error) {
        console.error('Search error:', error);
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

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % searchResults.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
        break;
      case "Enter":
        e.preventDefault();
        handleSelectApp(searchResults[highlightedIndex]);
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

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
    inputRef.current?.focus();
  };

  return (
    <MinimalLayout>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="w-4 h-4" />
            {t("3000+ intégrations disponibles", "3000+ integrations available")}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
            {t("Trouvez les actions", "Find the actions")}
            <br />
            <span className="text-primary">{t("de vos apps favorites", "of your favorite apps")}</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Recherchez une application et découvrez instantanément toutes les actions automatisables avec des prompts prêts à l'emploi.",
              "Search for an application and instantly discover all automatable actions with ready-to-use prompts."
            )}
          </p>
        </div>

        {/* Search Box */}
        <div className="relative max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <Input
                ref={inputRef}
                placeholder={t("Rechercher une app...", "Search for an app...")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedApp) setSelectedApp(null);
                }}
                onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="pl-14 pr-24 h-16 text-lg rounded-2xl border-2 border-border/50 bg-background shadow-xl shadow-primary/5 focus:border-primary/50 transition-all"
              />
              {isSearching ? (
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2 hidden md:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                  <Keyboard className="w-3 h-3" />
                  <span>⌘K</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && !selectedApp && (
            <Card className="absolute top-full left-0 right-0 mt-3 z-50 max-h-80 overflow-auto shadow-2xl border-border/50 animate-scale-in">
              <CardContent className="p-2">
                {searchResults.map((app, index) => (
                  <button
                    key={app.slug}
                    onClick={() => handleSelectApp(app)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
                      index === highlightedIndex 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent"
                    }`}
                  >
                    <IntegrationLogo slug={app.slug} name={app.name} size="sm" />
                    <span className="font-medium flex-1">{app.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      index === highlightedIndex ? "translate-x-1 text-primary" : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Loading State with Skeletons */}
        {isLoadingDetails && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start gap-6 p-6 bg-card rounded-2xl border border-border/50">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected App Details */}
        {selectedApp && !isLoadingDetails && (
          <div className="space-y-8 animate-fade-in">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="group -ml-2 hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              {t("Nouvelle recherche", "New search")}
            </Button>

            {/* App Header */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-8 bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border/50 shadow-lg">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-sm"></div>
                <IntegrationLogo 
                  slug={selectedApp.slug} 
                  name={selectedApp.name} 
                  size="lg"
                  className="relative rounded-2xl w-20 h-20"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-foreground">{selectedApp.name}</h2>
                  <Badge variant="secondary" className="rounded-full">{selectedApp.category}</Badge>
                  <Badge variant="outline" className="rounded-full">
                    {selectedApp.actions.length} {t("actions", "actions")}
                  </Badge>
                </div>
                {selectedApp.description && (
                  <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    {selectedApp.description}
                  </p>
                )}
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <a href={selectedApp.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {t("Voir sur Pipedream", "View on Pipedream")}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">
                  {t("Actions disponibles", "Available Actions")}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {t("Cliquez pour copier le prompt", "Click to copy the prompt")}
                </span>
              </div>
              
              {selectedApp.actions.length > 0 ? (
                <div className="grid gap-4">
                  {selectedApp.actions.map((action, index) => (
                    <ActionCard 
                      key={index} 
                      action={action} 
                      appName={selectedApp.name}
                      language={language}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed">
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
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("Apps populaires", "Popular Apps")}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularApps.map((app, index) => (
                <button
                  key={app.slug}
                  onClick={() => handleSelectApp(app)}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="h-full hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 hover:border-primary/30 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <IntegrationLogo 
                          slug={app.slug} 
                          name={app.name} 
                          size="lg"
                          className="relative rounded-xl transition-transform group-hover:scale-110"
                        />
                      </div>
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
    </MinimalLayout>
  );
};

interface ActionCardProps {
  action: PipedreamAction;
  appName: string;
  language: "fr" | "en";
  index: number;
}

const ActionCard = ({ action, appName, language, index }: ActionCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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
      description: t("Le prompt a été copié", "Prompt copied to clipboard"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightVariables = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={i} className="bg-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleCopy}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {action.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
          </div>
          <div className={`p-2 rounded-lg transition-all ${
            copied 
              ? "bg-green-500/10 text-green-500" 
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}>
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-xl p-4 border border-border/50 group-hover:border-primary/20 transition-colors">
          <p className="text-sm leading-relaxed">
            {highlightVariables(prompt)}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/50"></span>
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
