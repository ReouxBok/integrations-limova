import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Video, FileText, File, Image, Check, X, Mail, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAgents } from "@/hooks/useAgents";
import { useTutorials, useCreateTutorial, useUpdateTutorial, useDeleteTutorial, Tutorial } from "@/hooks/useTutorials";
import { useContentRequests, useUpdateContentRequestStatus, useDeleteContentRequest, ContentRequest } from "@/hooks/useContentRequests";
import { cn } from "@/lib/utils";
import { Navigate, Link } from "react-router-dom";

const typeIcons = {
  video: Video,
  text: FileText,
  document: File,
  image: Image,
};

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  published: "bg-green-500/10 text-green-600 border-green-500/20",
};

const AdminContents = () => {
  const { t, language } = useLanguage();
  const { isAdmin, isLoading: authLoading, user } = useAuth();
  const { data: agents } = useAgents();
  const { data: tutorials, isLoading: tutorialsLoading } = useTutorials(false);
  const { data: contentRequests } = useContentRequests();
  
  const createTutorial = useCreateTutorial();
  const updateTutorial = useUpdateTutorial();
  const deleteTutorial = useDeleteTutorial();
  const updateRequestStatus = useUpdateContentRequestStatus();
  const deleteRequest = useDeleteContentRequest();

  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Redirect non-admin users
  if (authLoading) {
    return (
      <MainLayout title={t("Chargement...", "Loading...")}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <MainLayout title={t("Accès refusé", "Access Denied")}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("Vous n'avez pas les droits administrateur.", "You don't have admin rights.")}
          </p>
          <Button asChild>
            <Link to="/">{t("Retour à l'accueil", "Back to home")}</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("Gestion des contenus", "Content Management")}>
      <Tabs defaultValue="tutorials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tutorials">
            {t("Tutoriels", "Tutorials")} ({tutorials?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="requests">
            {t("Demandes", "Requests")} ({contentRequests?.filter(r => r.status === 'pending').length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {t("Gérez tous vos tutoriels depuis cet espace.", "Manage all your tutorials from this space.")}
            </p>
            <TutorialDialog 
              agents={agents || []} 
              onSubmit={(data) => createTutorial.mutate(data as any)}
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t("Ajouter un tutoriel", "Add tutorial")}
              </Button>
            </TutorialDialog>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Titre", "Title")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Agent", "Agent")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Type", "Type")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Publié", "Published")}</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">{t("Actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tutorials?.map((tutorial) => {
                    const Icon = typeIcons[tutorial.content_type];
                    return (
                      <tr key={tutorial.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">
                            {language === 'fr' ? tutorial.title_fr : tutorial.title_en}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-muted-foreground">
                            {tutorial.agents?.name || t("Général", "General")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground capitalize">{tutorial.content_type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Switch
                            checked={tutorial.is_published}
                            onCheckedChange={(checked) => updateTutorial.mutate({ id: tutorial.id, is_published: checked })}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <TutorialDialog 
                              tutorial={tutorial} 
                              agents={agents || []}
                              onSubmit={(data) => updateTutorial.mutate({ id: tutorial.id, ...data })}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TutorialDialog>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteTutorial.mutate(tutorial.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!tutorials || tutorials.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        {t("Aucun tutoriel. Cliquez sur 'Ajouter' pour commencer.", "No tutorials. Click 'Add' to start.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <p className="text-muted-foreground">
            {t("Gérez les demandes de contenu des utilisateurs.", "Manage user content requests.")}
          </p>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Demandeur", "Requester")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Description", "Description")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Agent", "Agent")}</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">{t("Statut", "Status")}</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">{t("Actions", "Actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {contentRequests?.map((request) => (
                    <tr key={request.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{request.first_name} {request.last_name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-muted-foreground truncate" title={request.description}>
                          {request.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">
                          {request.is_general ? t("Général", "General") : (request.agents?.name || '-')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(statusColors[request.status])}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600"
                                onClick={() => updateRequestStatus.mutate({ id: request.id, status: 'approved' })}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => updateRequestStatus.mutate({ id: request.id, status: 'rejected' })}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-accent"
                              onClick={() => updateRequestStatus.mutate({ id: request.id, status: 'published', sendNotification: true })}
                              title={t("Marquer comme publié et notifier", "Mark as published and notify")}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          <RequestDetailDialog request={request} />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteRequest.mutate(request.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!contentRequests || contentRequests.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        {t("Aucune demande de contenu.", "No content requests.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

// Tutorial Dialog Component
interface TutorialDialogProps {
  tutorial?: Tutorial;
  agents: { id: string; name: string }[];
  onSubmit: (data: Partial<Tutorial>) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type TutorialLanguage = 'fr' | 'en' | 'both';

const TutorialDialog = ({ tutorial, agents, onSubmit, children, open, onOpenChange }: TutorialDialogProps) => {
  const { t } = useLanguage();
  const [tutorialLang, setTutorialLang] = useState<TutorialLanguage>(() => {
    if (tutorial) {
      if (tutorial.title_fr && tutorial.title_en) return 'both';
      if (tutorial.title_fr) return 'fr';
      return 'en';
    }
    return 'fr';
  });
  const [isGeneral, setIsGeneral] = useState(() => !tutorial?.agent_id);
  const [formData, setFormData] = useState({
    agent_id: tutorial?.agent_id || null as string | null,
    title_fr: tutorial?.title_fr || '',
    title_en: tutorial?.title_en || '',
    description_fr: tutorial?.description_fr || '',
    description_en: tutorial?.description_en || '',
    content_type: tutorial?.content_type || 'video',
    duration: tutorial?.duration || '',
    content_url: tutorial?.content_url || '',
    arcade_embed_url: tutorial?.arcade_embed_url || '',
    text_content_fr: tutorial?.text_content_fr || '',
    text_content_en: tutorial?.text_content_en || '',
    is_published: tutorial?.is_published || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isGeneral && !formData.agent_id) {
      newErrors.agent_id = t("L'agent est requis", "Agent is required");
    }
    
    if (tutorialLang === 'fr' || tutorialLang === 'both') {
      if (!formData.title_fr.trim()) {
        newErrors.title_fr = t("Le titre français est requis", "French title is required");
      }
    }
    if (tutorialLang === 'en' || tutorialLang === 'both') {
      if (!formData.title_en.trim()) {
        newErrors.title_en = t("Le titre anglais est requis", "English title is required");
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    if (!isGeneral && !formData.agent_id) return false;
    if (tutorialLang === 'fr' || tutorialLang === 'both') {
      if (!formData.title_fr.trim()) return false;
    }
    if (tutorialLang === 'en' || tutorialLang === 'both') {
      if (!formData.title_en.trim()) return false;
    }
    return true;
  }, [formData.agent_id, formData.title_fr, formData.title_en, tutorialLang, isGeneral]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = {
      ...formData,
      agent_id: isGeneral ? null : formData.agent_id,
    };
    onSubmit(submitData as any);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tutorial ? t("Modifier le tutoriel", "Edit tutorial") : t("Nouveau tutoriel", "New tutorial")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <Switch 
              checked={isGeneral} 
              onCheckedChange={(checked) => {
                setIsGeneral(checked);
                if (checked) {
                  setFormData({ ...formData, agent_id: null });
                  setErrors({ ...errors, agent_id: '' });
                }
              }} 
            />
            <Label className="cursor-pointer" onClick={() => {
              const newIsGeneral = !isGeneral;
              setIsGeneral(newIsGeneral);
              if (newIsGeneral) {
                setFormData({ ...formData, agent_id: null });
                setErrors({ ...errors, agent_id: '' });
              }
            }}>
              {t("Tutoriel général (toute la plateforme)", "General tutorial (entire platform)")}
            </Label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {!isGeneral && (
              <div className="space-y-2">
                <Label>{t("Agent", "Agent")} *</Label>
                <Select value={formData.agent_id || ''} onValueChange={(v) => { setFormData({ ...formData, agent_id: v }); setErrors({ ...errors, agent_id: '' }); }}>
                  <SelectTrigger className={errors.agent_id ? 'border-destructive' : ''}><SelectValue placeholder="..." /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.agent_id && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agent_id}</p>}
              </div>
            )}
            <div className="space-y-2">
              <Label>{t("Type", "Type")} *</Label>
              <Select value={formData.content_type} onValueChange={(v: any) => setFormData({ ...formData, content_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("Langue du contenu", "Content Language")} *</Label>
              <Select value={tutorialLang} onValueChange={(v: TutorialLanguage) => setTutorialLang(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">{t("Français uniquement", "French only")}</SelectItem>
                  <SelectItem value="en">{t("Anglais uniquement", "English only")}</SelectItem>
                  <SelectItem value="both">{t("Les deux langues", "Both languages")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(tutorialLang === 'fr' || tutorialLang === 'both') && (
            <div className="space-y-2">
              <Label>{t("Titre (FR)", "Title (FR)")} *</Label>
              <Input 
                value={formData.title_fr} 
                onChange={(e) => { setFormData({ ...formData, title_fr: e.target.value }); setErrors({ ...errors, title_fr: '' }); }}
                className={errors.title_fr ? 'border-destructive' : ''}
              />
              {errors.title_fr && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title_fr}</p>}
            </div>
          )}
          
          {(tutorialLang === 'en' || tutorialLang === 'both') && (
            <div className="space-y-2">
              <Label>{t("Titre (EN)", "Title (EN)")} *</Label>
              <Input 
                value={formData.title_en} 
                onChange={(e) => { setFormData({ ...formData, title_en: e.target.value }); setErrors({ ...errors, title_en: '' }); }}
                className={errors.title_en ? 'border-destructive' : ''}
              />
              {errors.title_en && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title_en}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(tutorialLang === 'fr' || tutorialLang === 'both') && (
              <div className="space-y-2">
                <Label>{t("Description (FR)", "Description (FR)")}</Label>
                <Textarea value={formData.description_fr || ''} onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })} rows={2} />
              </div>
            )}
            {(tutorialLang === 'en' || tutorialLang === 'both') && (
              <div className="space-y-2">
                <Label>{t("Description (EN)", "Description (EN)")}</Label>
                <Textarea value={formData.description_en || ''} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} rows={2} />
              </div>
            )}
          </div>

          {formData.content_type === 'video' && (
            <div className="space-y-2">
              <Label>{t("Code Embed Arcade.software", "Arcade.software Embed Code")}</Label>
              <Textarea 
                value={formData.arcade_embed_url || ''} 
                onChange={(e) => {
                  const value = e.target.value;
                  // Extract URL from embed code if pasted
                  const srcMatch = value.match(/src="([^"]+)"/);
                  const url = srcMatch ? srcMatch[1] : value;
                  setFormData({ ...formData, arcade_embed_url: url });
                }} 
                placeholder={t("Collez le code embed Arcade ici...", "Paste the Arcade embed code here...")}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {t("Collez le code embed complet, l'URL sera extraite automatiquement.", "Paste the full embed code, the URL will be extracted automatically.")}
              </p>
            </div>
          )}

          {(formData.content_type === 'document' || formData.content_type === 'image' || formData.content_type === 'video') && (
            <div className="space-y-2">
              <Label>{t("URL du contenu", "Content URL")}</Label>
              <Input value={formData.content_url || ''} onChange={(e) => setFormData({ ...formData, content_url: e.target.value })} />
            </div>
          )}

          {formData.content_type === 'text' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(tutorialLang === 'fr' || tutorialLang === 'both') && (
                <div className="space-y-2">
                  <Label>{t("Contenu (FR)", "Content (FR)")}</Label>
                  <Textarea value={formData.text_content_fr || ''} onChange={(e) => setFormData({ ...formData, text_content_fr: e.target.value })} rows={5} />
                </div>
              )}
              {(tutorialLang === 'en' || tutorialLang === 'both') && (
                <div className="space-y-2">
                  <Label>{t("Contenu (EN)", "Content (EN)")}</Label>
                  <Textarea value={formData.text_content_en || ''} onChange={(e) => setFormData({ ...formData, text_content_en: e.target.value })} rows={5} />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("Durée", "Duration")}</Label>
              <Input value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="5 min" />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Switch checked={formData.is_published} onCheckedChange={(v) => setFormData({ ...formData, is_published: v })} />
              <Label>{t("Publié", "Published")}</Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid}>
            {tutorial ? t("Mettre à jour", "Update") : t("Créer", "Create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Request Detail Dialog
const RequestDetailDialog = ({ request }: { request: ContentRequest }) => {
  const { t } = useLanguage();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Détail de la demande", "Request Detail")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">{t("Demandeur", "Requester")}</Label>
            <p className="font-medium">{request.first_name} {request.last_name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">{t("Email", "Email")}</Label>
            <p>{request.email}</p>
          </div>
          {request.phone && (
            <div>
              <Label className="text-muted-foreground">{t("Téléphone", "Phone")}</Label>
              <p>{request.phone}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">{t("Agent concerné", "Related Agent")}</Label>
            <p>{request.is_general ? t("Demande générale", "General request") : (request.agents?.name || '-')}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">{t("Description", "Description")}</Label>
            <p className="whitespace-pre-wrap">{request.description}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">{t("Date de création", "Created at")}</Label>
            <p>{new Date(request.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminContents;
