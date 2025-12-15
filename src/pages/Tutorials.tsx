import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Video, FileText, File, Image, Eye, MoreHorizontal, Pencil, Trash2, ArrowUpDown, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MainLayout from "@/components/layout/MainLayout";
import { useTutorials, useDeleteTutorial } from "@/hooks/useTutorials";
import { useAgents } from "@/hooks/useAgents";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import limovaLogo from "@/assets/limova-logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ContentType = 'video' | 'text' | 'document' | 'image';
type SortOption = 'date_desc' | 'date_asc' | 'views_desc' | 'views_asc';

const typeIcons: Record<ContentType, typeof Video> = {
  video: Video,
  text: FileText,
  document: File,
  image: Image,
};

const typeColors: Record<ContentType, string> = {
  video: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  text: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  document: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  image: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const Tutorials = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { data: tutorials, isLoading } = useTutorials();
  const { data: agents } = useAgents();
  const deleteTutorial = useDeleteTutorial();
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState<string | null>(null);

  // Filter tutorials that have content in the current language
  const tutorialsInCurrentLanguage = tutorials?.filter(tutorial => {
    if (language === 'fr') {
      return tutorial.title_fr && tutorial.title_fr.trim() !== '';
    } else {
      return tutorial.title_en && tutorial.title_en.trim() !== '';
    }
  }) || [];

  const filteredTutorials = tutorialsInCurrentLanguage
    .filter(tutorial => {
      const searchLower = search.toLowerCase();
      const title = language === 'fr' ? tutorial.title_fr : tutorial.title_en;
      const matchesSearch = 
        title?.toLowerCase().includes(searchLower) ||
        tutorial.agents?.name.toLowerCase().includes(searchLower);
      
      const matchesType = filterType === 'all' || tutorial.content_type === filterType;
      const matchesAgent = filterAgent === 'all' || 
        (filterAgent === 'general' ? !tutorial.agent_id : tutorial.agent_id === filterAgent);
      
      return matchesSearch && matchesType && matchesAgent;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'views_desc':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'views_asc':
          return (a.view_count || 0) - (b.view_count || 0);
        default:
          return 0;
      }
    });

  const handleEdit = (id: string) => {
    navigate(`/admin/contents?edit=${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setTutorialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tutorialToDelete) {
      deleteTutorial.mutate(tutorialToDelete);
      setDeleteDialogOpen(false);
      setTutorialToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMM yyyy', { 
      locale: language === 'fr' ? fr : enUS 
    });
  };

  // Mobile Card Component
  const MobileTutorialCard = ({ tutorial }: { tutorial: typeof filteredTutorials[0] }) => {
    const Icon = typeIcons[tutorial.content_type];
    const title = language === 'fr' ? tutorial.title_fr : tutorial.title_en;
    const description = language === 'fr' ? tutorial.description_fr : tutorial.description_en;

    return (
      <div
        className="bg-card rounded-xl border border-border p-4 shadow-card active:bg-muted/50 transition-colors"
        onClick={() => navigate(`/tutorials/${tutorial.id}`)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[tutorial.content_type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground line-clamp-2">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{description}</p>
            )}
          </div>
          {isAdmin && (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => navigate(`/tutorials/${tutorial.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t("Voir", "View")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(tutorial.id)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    {t("Modifier", "Edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(tutorial.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("Supprimer", "Delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {tutorial.agents ? (
              <>
                <Avatar className="h-5 w-5">
                  <AvatarImage src={tutorial.agents.avatar_url || undefined} alt={tutorial.agents.name} />
                  <AvatarFallback className="text-[10px] bg-accent/20 text-accent">
                    {tutorial.agents.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{tutorial.agents.name}</span>
              </>
            ) : (
              <img src={limovaLogo} alt="Limova" className="h-5 w-auto" />
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {tutorial.view_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(tutorial.created_at)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout title={t("Tutoriels", "Tutorials")}>
      {/* Filters Bar */}
      <div className="space-y-3 mb-6">
        {/* Search - full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("Rechercher un tutoriel...", "Search for a tutorial...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2">
          <Select value={filterType} onValueChange={(v) => setFilterType(v as ContentType | 'all')}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder={t("Type", "Type")} />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">{t("Tous types", "All types")}</SelectItem>
              <SelectItem value="video">{t("Vidéos", "Videos")}</SelectItem>
              <SelectItem value="text">{t("Articles", "Articles")}</SelectItem>
              <SelectItem value="document">{t("Documents", "Documents")}</SelectItem>
              <SelectItem value="image">{t("Images", "Images")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={t("Agent", "Agent")} />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">{t("Tous les agents", "All agents")}</SelectItem>
              <SelectItem value="general">{t("Général (Limova)", "General (Limova)")}</SelectItem>
              {agents?.map(agent => (
                <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <ArrowUpDown className="w-4 h-4 mr-2 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="date_desc">{t("Plus récents", "Most recent")}</SelectItem>
              <SelectItem value="date_asc">{t("Plus anciens", "Oldest")}</SelectItem>
              <SelectItem value="views_desc">{t("Plus vus", "Most viewed")}</SelectItem>
              <SelectItem value="views_asc">{t("Moins vus", "Least viewed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <>
          {/* Mobile skeleton */}
          <div className="space-y-3 md:hidden">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden shadow-card p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </>
      )}

      {/* Mobile View - Cards */}
      {!isLoading && (
        <div className="space-y-3 md:hidden">
          {filteredTutorials.map((tutorial) => (
            <MobileTutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t("Aucun tutoriel trouvé.", "No tutorial found.")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Desktop View - Table */}
      {!isLoading && (
        <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    {t("Tutoriel", "Tutorial")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-24">
                    {t("Vues", "Views")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    {t("Agent", "Agent")}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground w-32">
                    {t("Date", "Date")}
                  </th>
                  {isAdmin && (
                    <th className="w-12 px-6 py-4"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTutorials.map((tutorial) => {
                  const Icon = typeIcons[tutorial.content_type];
                  const title = language === 'fr' ? tutorial.title_fr : tutorial.title_en;
                  const description = language === 'fr' ? tutorial.description_fr : tutorial.description_en;
                  
                  return (
                    <tr 
                      key={tutorial.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[tutorial.content_type]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{title}</p>
                            {description && (
                              <p className="text-sm text-muted-foreground truncate max-w-md">{description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{tutorial.view_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tutorial.agents ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={tutorial.agents.avatar_url || undefined} alt={tutorial.agents.name} />
                              <AvatarFallback className="text-xs bg-accent/20 text-accent">
                                {tutorial.agents.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-foreground">{tutorial.agents.name}</span>
                          </div>
                        ) : (
                          <img src={limovaLogo} alt="Limova" className="h-7 w-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(tutorial.created_at)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem onClick={() => navigate(`/tutorials/${tutorial.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                {t("Voir", "View")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(tutorial.id)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                {t("Modifier", "Edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(tutorial.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t("Supprimer", "Delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {filteredTutorials.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">
                      {t("Aucun tutoriel trouvé.", "No tutorial found.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
    </MainLayout>
  );
};

export default Tutorials;
