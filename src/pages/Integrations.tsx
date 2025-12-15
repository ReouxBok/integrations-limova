import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Star, SlidersHorizontal, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, Sparkles, Filter } from "lucide-react";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { allIntegrations, integrationCategories, Integration } from "@/lib/integrations-full-data";
import IntegrationLogo from "@/components/integrations/IntegrationLogo";

type SortOption = "popular" | "name-asc" | "name-desc" | "actions-desc" | "actions-asc";

const Integrations = () => {
  const { t, language } = useLanguage();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const selectedCategory = categoryId || "all";
  const currentCategory = integrationCategories.find(c => c.id === selectedCategory);

  const filteredAndSortedIntegrations = useMemo(() => {
    let result = allIntegrations.filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || integration.categoryId === selectedCategory;

      const matchesPopularFilter = !showOnlyPopular || integration.isPopular;

      return matchesSearch && matchesCategory && matchesPopularFilter;
    });

    // Sort based on selected option
    switch (sortBy) {
      case "popular":
        result = [...result].sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name);
        });
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "actions-desc":
        result = [...result].sort((a, b) => b.actions.length - a.actions.length);
        break;
      case "actions-asc":
        result = [...result].sort((a, b) => a.actions.length - b.actions.length);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, showOnlyPopular]);

  const sortLabels: Record<SortOption, { fr: string; en: string }> = {
    "popular": { fr: "Populaires d'abord", en: "Popular first" },
    "name-asc": { fr: "Nom A → Z", en: "Name A → Z" },
    "name-desc": { fr: "Nom Z → A", en: "Name Z → A" },
    "actions-desc": { fr: "Plus d'actions", en: "Most actions" },
    "actions-asc": { fr: "Moins d'actions", en: "Least actions" },
  };

  const pageTitle = selectedCategory === "all" 
    ? t("Toutes les intégrations", "All Integrations")
    : currentCategory?.label[language] || t("Intégrations", "Integrations");

  return (
    <MainLayout title={pageTitle}>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t("Le catalogue d'intégrations IA", "The AI toolkit for integrations")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              `Plus de ${allIntegrations.length.toLocaleString()} intégrations avec des prompts prêts à l'emploi. Automatisez vos workflows en quelques clics.`,
              `Add ${allIntegrations.length.toLocaleString()}+ APIs and tools to your AI assistant. Connect your accounts securely.`
            )}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder={t("Rechercher une intégration...", "Search apps...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base rounded-xl border-border/50 bg-background shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 rounded-xl h-12 px-4">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{sortLabels[sortBy][language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{t("Trier par", "Sort by")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("popular")} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  {sortLabels["popular"][language]}
                  {sortBy === "popular" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-asc")} className="gap-2">
                  <ArrowDownAZ className="w-4 h-4" />
                  {sortLabels["name-asc"][language]}
                  {sortBy === "name-asc" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")} className="gap-2">
                  <ArrowUpAZ className="w-4 h-4" />
                  {sortLabels["name-desc"][language]}
                  {sortBy === "name-desc" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("actions-desc")} className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {sortLabels["actions-desc"][language]}
                  {sortBy === "actions-desc" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("actions-asc")} className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  {sortLabels["actions-asc"][language]}
                  {sortBy === "actions-asc" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={showOnlyPopular ? "default" : "outline"} 
                  size="lg" 
                  className="gap-2 rounded-xl h-12 px-4"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("Filtres", "Filters")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("Filtrer", "Filter")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showOnlyPopular}
                  onCheckedChange={setShowOnlyPopular}
                >
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  {t("Populaires uniquement", "Popular only")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedIntegrations.length} {t("intégrations", "integrations")}
          {selectedCategory !== "all" && ` • ${currentCategory?.label[language]}`}
        </div>

        {/* Integrations Grid */}
        {filteredAndSortedIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} language={language} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("Aucune intégration trouvée", "No integration found")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("Essayez un autre terme de recherche", "Try a different search term")}
            </p>
            {showOnlyPopular && (
              <Button variant="outline" onClick={() => setShowOnlyPopular(false)}>
                {t("Afficher toutes les intégrations", "Show all integrations")}
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface IntegrationCardProps {
  integration: Integration;
  language: "fr" | "en";
}

const IntegrationCard = ({ integration, language }: IntegrationCardProps) => {
  const { t } = useLanguage();
  
  // Generate a more descriptive text
  const getDescription = () => {
    const baseDesc = integration.description[language];
    if (baseDesc.length > 50) return baseDesc;
    return `${integration.name} ${t("vous permet d'automatiser vos workflows et de connecter vos outils favoris.", "allows you to automate your workflows and connect your favorite tools.")}`;
  };

  return (
    <Link to={`/integration/${integration.slug}`}>
      <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30 cursor-pointer h-full bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with logo and name */}
            <div className="flex items-center gap-4">
              <IntegrationLogo 
                slug={integration.slug} 
                name={integration.name} 
                size="lg"
                className="rounded-xl"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                    {integration.name}
                  </h3>
                  {integration.isPopular && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {getDescription()}
            </p>
            
            {/* Category badge */}
            <div className="pt-2">
              <Badge variant="secondary" className="text-xs font-normal">
                {integration.category[language]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Integrations;
