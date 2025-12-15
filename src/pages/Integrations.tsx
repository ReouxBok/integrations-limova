import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, Blocks, Star } from "lucide-react";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { allIntegrations, integrationCategories, Integration } from "@/lib/integrations-full-data";

const Integrations = () => {
  const { t, language } = useLanguage();
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCategory = categoryId || "all";
  const currentCategory = integrationCategories.find(c => c.id === selectedCategory);

  const filteredIntegrations = useMemo(() => {
    return allIntegrations.filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || integration.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const popularIntegrations = filteredIntegrations.filter(i => i.isPopular);
  const otherIntegrations = filteredIntegrations.filter(i => !i.isPopular);

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
              `${filteredIntegrations.length} intégrations disponibles avec prompts prêts à l'emploi`,
              `${filteredIntegrations.length} integrations available with ready-to-use prompts`
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("Rechercher une intégration...", "Search an integration...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Popular Integrations */}
        {popularIntegrations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              {t("Populaires", "Popular")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularIntegrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} language={language} />
              ))}
            </div>
          </div>
        )}

        {/* Other Integrations */}
        {otherIntegrations.length > 0 && (
          <div className="space-y-4">
            {popularIntegrations.length > 0 && (
              <h2 className="text-xl font-semibold text-foreground">
                {t("Autres intégrations", "Other Integrations")}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
  integration: Integration;
  language: "fr" | "en";
}

const IntegrationCard = ({ integration, language }: IntegrationCardProps) => {
  return (
    <Link to={`/integration/${integration.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={integration.logoUrl}
                alt={integration.name}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
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
