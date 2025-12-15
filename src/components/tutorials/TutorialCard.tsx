import { Link, useNavigate } from "react-router-dom";
import { Video, FileText, File, Image, Pencil, Trash2, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteTutorial } from "@/hooks/useTutorials";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import limovaLogo from "@/assets/limova-logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ContentType = 'video' | 'text' | 'document' | 'image';

export interface TutorialCardData {
  id: string;
  title_fr: string;
  title_en: string;
  description_fr: string | null;
  description_en: string | null;
  content_type: ContentType;
  duration: string | null;
  view_count?: number;
  agents?: {
    name: string;
    avatar_url: string | null;
  };
}

interface TutorialCardProps {
  tutorial: TutorialCardData;
  index: number;
}

const typeIcons: Record<ContentType, typeof Video> = {
  video: Video,
  text: FileText,
  document: File,
  image: Image,
};

const typeLabels: Record<ContentType, { fr: string; en: string }> = {
  video: { fr: "Vidéo", en: "Video" },
  text: { fr: "Article", en: "Article" },
  document: { fr: "Document", en: "Document" },
  image: { fr: "Image", en: "Image" },
};

const typeColors: Record<ContentType, string> = {
  video: "bg-red-100 text-red-700",
  text: "bg-blue-100 text-blue-700",
  document: "bg-green-100 text-green-700",
  image: "bg-purple-100 text-purple-700",
};

const TutorialCard = ({ tutorial, index }: TutorialCardProps) => {
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const deleteTutorial = useDeleteTutorial();
  const Icon = typeIcons[tutorial.content_type];

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/contents?edit=${tutorial.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const confirmDelete = () => {
    deleteTutorial.mutate(tutorial.id);
  };

  return (
    <Link 
      to={`/tutorials/${tutorial.id}`}
      className="group bg-card rounded-xl border border-border p-5 card-hover shadow-card cursor-pointer animate-slide-up block relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 hover:bg-background"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("Supprimer ce tutoriel ?", "Delete this tutorial?")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "Cette action est irréversible. Le tutoriel sera définitivement supprimé.",
                    "This action cannot be undone. The tutorial will be permanently deleted."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("Annuler", "Cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t("Supprimer", "Delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              typeColors[tutorial.content_type]
            )}>
              <Icon className="w-3 h-3" />
              {language === 'fr' ? typeLabels[tutorial.content_type].fr : typeLabels[tutorial.content_type].en}
            </span>
            {tutorial.duration && (
              <span className="text-xs text-muted-foreground">
                {tutorial.duration}
              </span>
            )}
            {typeof tutorial.view_count === 'number' && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                {tutorial.view_count}
              </span>
            )}
          </div>
          
          <h4 className="font-medium text-foreground group-hover:text-accent transition-colors">
            {language === 'fr' ? tutorial.title_fr : tutorial.title_en}
          </h4>
          
          {(tutorial.description_fr || tutorial.description_en) && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {language === 'fr' ? tutorial.description_fr : tutorial.description_en}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {tutorial.agents ? (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={tutorial.agents.avatar_url || undefined} alt={tutorial.agents.name} />
                  <AvatarFallback className="text-xs bg-accent/20 text-accent">
                    {tutorial.agents.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {t("Par", "By")} <span className="text-accent font-medium">{tutorial.agents.name}</span>
                </span>
              </>
            ) : (
              <img src={limovaLogo} alt="Limova" className="h-6 w-auto" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TutorialCard;