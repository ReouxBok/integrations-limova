import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Blocks, Star } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { integrations, integrationCategories } from "@/lib/integrations-data";
import { cn } from "@/lib/utils";

const Integrations = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description[language].toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        integration.category[language].toLowerCase() === 
          integrationCategories.find(c => c.id === selectedCategory)?.label[language].toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, language]);

  const popularIntegrations = filteredIntegrations.filter(i => i.isPopular);
  const otherIntegrations = filteredIntegrations.filter(i => !i.isPopular);

  return (
    <MainLayout title={t("Intégrations IA", "AI Integrations")}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Blocks className="w-8 h-8 text-primary" />
            {t("Intégrations IA", "AI Integrations")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t(
              "Catalogue des intégrations disponibles avec prompts prêts à l'emploi",
              "Catalog of available integrations with ready-to-use prompts"
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("Rechercher une intégration...", "Search an integration...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {integrationCategories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label[language]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Popular Integrations */}
        {popularIntegrations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {t("Populaires", "Popular")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} language={language} />
              ))}
            </div>
          </div>
        )}

        {/* Other Integrations */}
        {otherIntegrations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {t("Autres intégrations", "Other Integrations")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} language={language} />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Blocks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("Aucune intégration trouvée", "No integration found")}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

interface IntegrationCardProps {
  integration: typeof integrations[0];
  language: "fr" | "en";
}

const IntegrationCard = ({ integration, language }: IntegrationCardProps) => {
  return (
    <Link to={`/integrations/${integration.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={integration.logoUrl}
                alt={integration.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {integration.name}
                </h3>
                {integration.isPopular && (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {integration.description[language]}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {integration.category[language]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {integration.actions.length} {language === "fr" ? "actions" : "actions"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Integrations;
