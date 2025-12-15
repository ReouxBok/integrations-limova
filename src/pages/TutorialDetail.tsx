import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Video, FileText, File, Image, Clock, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import { useTutorial, useIncrementTutorialView } from "@/hooks/useTutorials";
import { useLanguage } from "@/contexts/LanguageContext";

const TutorialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { data: tutorial, isLoading, error } = useTutorial(id || "");
  const incrementView = useIncrementTutorialView();

  // Increment view count when tutorial is loaded
  useEffect(() => {
    if (tutorial?.id) {
      incrementView.mutate(tutorial.id);
    }
  }, [tutorial?.id]);

  const typeIcons = {
    video: Video,
    text: FileText,
    document: File,
    image: Image,
  };

  if (isLoading) {
    return (
      <MainLayout title={t("Chargement...", "Loading...")}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !tutorial) {
    return (
      <MainLayout title={t("Tutoriel non trouvé", "Tutorial not found")}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("Ce tutoriel n'existe pas ou n'est pas encore publié.", "This tutorial doesn't exist or isn't published yet.")}
          </p>
          <Button asChild>
            <Link to="/tutorials">{t("Retour aux tutoriels", "Back to tutorials")}</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const title = language === 'fr' ? tutorial.title_fr : tutorial.title_en;
  const description = language === 'fr' ? tutorial.description_fr : tutorial.description_en;
  const textContent = language === 'fr' ? tutorial.text_content_fr : tutorial.text_content_en;
  const Icon = typeIcons[tutorial.content_type];

  return (
    <MainLayout title={title}>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/tutorials" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("Retour", "Back")}
          </Link>
        </Button>
      </div>

      {/* Tutorial Header */}
      <div className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-card">
        <div className="flex items-start gap-6">
          {tutorial.agents?.avatar_url && (
            <img 
              src={tutorial.agents.avatar_url} 
              alt={tutorial.agents.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-border"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Icon className="w-3 h-3" />
                {tutorial.content_type}
              </span>
              {tutorial.duration && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {tutorial.duration}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            {tutorial.agents?.name && (
              <p className="text-accent font-medium mb-3">
                {t("Par", "By")} {tutorial.agents.name}
              </p>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
        {tutorial.content_type === 'video' && tutorial.arcade_embed_url && (
          <div className="relative w-full" style={{ paddingBottom: 'calc(45.9896% + 41px)' }}>
            <iframe
              src={tutorial.arcade_embed_url}
              title={title}
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              allow="clipboard-write"
              className="absolute top-0 left-0 w-full h-full"
              style={{ colorScheme: 'light' }}
            />
          </div>
        )}

        {tutorial.content_type === 'video' && !tutorial.arcade_embed_url && tutorial.content_url && (
          <div className="aspect-video w-full">
            <video 
              src={tutorial.content_url} 
              controls 
              className="w-full h-full"
            />
          </div>
        )}

        {tutorial.content_type === 'image' && tutorial.content_url && (
          <div className="p-8">
            <img 
              src={tutorial.content_url} 
              alt={title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {tutorial.content_type === 'document' && tutorial.content_url && (
          <div className="p-8 text-center">
            <File className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("Document à télécharger", "Document to download")}</p>
            <Button asChild>
              <a href={tutorial.content_url} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                {t("Télécharger", "Download")}
              </a>
            </Button>
          </div>
        )}

        {tutorial.content_type === 'text' && textContent && (
          <div className="p-8 prose prose-stone max-w-none">
            <div dangerouslySetInnerHTML={{ __html: textContent.replace(/\n/g, '<br/>') }} />
          </div>
        )}

        {!tutorial.content_url && !tutorial.arcade_embed_url && !textContent && (
          <div className="p-12 text-center">
            <Icon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t("Contenu à venir...", "Content coming soon...")}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TutorialDetail;
