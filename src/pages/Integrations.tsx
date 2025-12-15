import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Blocks, Star, SlidersHorizontal, ArrowUpDown, ArrowDownAZ, ArrowUpAZ, Sparkles, Filter } from "lucide-react";
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Blocks className="w-8 h-8 text-primary" />
            {pageTitle}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(
              `${filteredAndSortedIntegrations.length} intégrations disponibles avec prompts prêts à l'emploi`,
              `${filteredAndSortedIntegrations.length} integrations available with ready-to-use prompts`
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("Rechercher une intégration...", "Search an integration...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{sortLabels[sortBy][language]}</span>
                  <span className="sm:hidden">{t("Trier", "Sort")}</span>
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
                  size="default" 
                  className="gap-2"
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
                  {t("Intégrations populaires uniquement", "Popular integrations only")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active filters display */}
        {showOnlyPopular && (
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setShowOnlyPopular(false)}>
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {t("Populaires uniquement", "Popular only")}
              <span className="ml-1">×</span>
            </Badge>
          </div>
        )}

        {/* Integrations Grid */}
        {filteredAndSortedIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} language={language} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Blocks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("Aucune intégration trouvée", "No integration found")}
            </p>
            {showOnlyPopular && (
              <Button variant="link" onClick={() => setShowOnlyPopular(false)} className="mt-2">
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
  return (
    <Link to={`/integration/${integration.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <IntegrationLogo 
              slug={integration.slug} 
              name={integration.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {integration.name}
                </h3>
                {integration.isPopular && (
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {integration.description[language]}
              </p>
              <Badge variant="outline" className="text-xs">
                {integration.actions.length} actions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Integrations;
