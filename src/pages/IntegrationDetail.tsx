import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Blocks } from "lucide-react";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getIntegrationBySlug } from "@/lib/integrations-data";
import { useToast } from "@/hooks/use-toast";

const IntegrationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const integration = getIntegrationBySlug(slug || "");

  if (!integration) {
    return (
      <MainLayout title={t("Intégration non trouvée", "Integration not found")}>
        <div className="text-center py-12">
          <Blocks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {t("Intégration non trouvée", "Integration not found")}
          </p>
          <Button asChild variant="outline">
            <Link to="/integrations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Retour aux intégrations", "Back to integrations")}
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={integration.name}>
      <div className="space-y-6">
        {/* Back button */}
        <Button asChild variant="ghost" size="sm">
          <Link to="/integrations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Retour aux intégrations", "Back to integrations")}
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={integration.logoUrl}
              alt={integration.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{integration.name}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {integration.description[language]}
            </p>
            <div className="flex gap-2 mt-3">
              <Badge>{integration.category[language]}</Badge>
              <Badge variant="outline">
                {integration.actions.length} {t("actions disponibles", "available actions")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {t("Actions disponibles", "Available Actions")}
          </h2>
          <div className="grid gap-4">
            {integration.actions.map((action) => (
              <ActionCard key={action.id} action={action} language={language} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface ActionCardProps {
  action: {
    id: string;
    name: { fr: string; en: string };
    description: { fr: string; en: string };
    prompt: { fr: string; en: string };
  };
  language: "fr" | "en";
}

const ActionCard = ({ action, language }: ActionCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(action.prompt[language]);
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{action.name[language]}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{action.description[language]}</p>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-4 relative group">
          <p className="text-sm pr-12 leading-relaxed">
            {highlightVariables(action.prompt[language])}
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

export default IntegrationDetail;
