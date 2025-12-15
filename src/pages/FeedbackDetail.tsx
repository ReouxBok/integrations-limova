import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { ArrowLeft, Calendar, Mail, Building2, ExternalLink, User, Users, Edit2, Loader2, Trash2, GitMerge, Bot, Globe, Video, Code, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import MainLayout from "@/components/layout/MainLayout";
import CriticalityBadge from "@/components/feedbacks/CriticalityBadge";
import StatusBadge from "@/components/feedbacks/StatusBadge";
import PriorityBadge from "@/components/feedbacks/PriorityBadge";
import SlackMessageDialog from "@/components/feedbacks/SlackMessageDialog";
import MergeFeedbackDialog from "@/components/feedbacks/MergeFeedbackDialog";
import { useFeedback, useFeedbacks, useUpdateFeedback, useDeleteFeedback, FeedbackStatus, PriorityLevel } from "@/hooks/useFeedbacks";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const locale = language === "fr" ? fr : enUS;

  const { data: feedback, isLoading } = useFeedback(id || "");
  const updateFeedback = useUpdateFeedback();
  const deleteFeedback = useDeleteFeedback();

  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [showSlackDialog, setShowSlackDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState(false);
  const [developer, setDeveloper] = useState("");
  const [editingFollowUp, setEditingFollowUp] = useState(false);
  const [followUp, setFollowUp] = useState("");

  // Get merged feedbacks (feedbacks that have been merged into this one)
  const { data: allFeedbacks } = useFeedbacks({ includeMerged: true });
  const mergedFeedbacks = allFeedbacks?.filter(f => f.merged_into_id === feedback?.id) || [];

  const handleDelete = async () => {
    if (!feedback) return;
    
    try {
      await deleteFeedback.mutateAsync(feedback.id);
      toast({
        title: t("Feedback supprimé", "Feedback deleted"),
      });
      navigate("/feedbacks");
    } catch (error) {
      toast({
        title: t("Erreur", "Error"),
        description: t("Impossible de supprimer ce feedback", "Unable to delete this feedback"),
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (status: FeedbackStatus) => {
    if (!feedback) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updates: Record<string, unknown> = { status };
      
      // If marking as resolved, set resolved_at and resolved_by
      if (status === "resolved") {
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = user?.id || null;
      }
      
      await updateFeedback.mutateAsync({ id: feedback.id, ...updates });
      toast({
        title: t("Statut mis à jour", "Status updated"),
      });
      
      // Show Slack message dialog when marking as resolved
      if (status === "resolved") {
        setShowSlackDialog(true);
      }
    } catch {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (priority: PriorityLevel | "none") => {
    if (!feedback) return;
    
    try {
      await updateFeedback.mutateAsync({ 
        id: feedback.id, 
        priority: priority === "none" ? null : priority 
      });
      toast({
        title: t("Priorité mise à jour", "Priority updated"),
      });
    } catch {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!feedback) return;
    
    try {
      await updateFeedback.mutateAsync({ id: feedback.id, admin_notes: notes });
      setEditingNotes(false);
      toast({
        title: t("Notes sauvegardées", "Notes saved"),
      });
    } catch (error) {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  const handleSaveDeveloper = async () => {
    if (!feedback) return;
    
    try {
      await updateFeedback.mutateAsync({ id: feedback.id, assigned_developer: developer || null });
      setEditingDeveloper(false);
      toast({
        title: t("Développeur assigné", "Developer assigned"),
      });
    } catch (error) {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  const handleSaveFollowUp = async () => {
    if (!feedback) return;
    
    try {
      await updateFeedback.mutateAsync({ id: feedback.id, follow_up_notes: followUp || null });
      setEditingFollowUp(false);
      toast({
        title: t("Notes de suivi sauvegardées", "Follow-up notes saved"),
      });
    } catch (error) {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout title={t("Chargement...", "Loading...")}>
        <Skeleton className="h-96" />
      </MainLayout>
    );
  }

  if (!feedback) {
    navigate("/feedbacks", { replace: true });
    return null;
  }

  const handleUnmerge = async () => {
    if (!feedback) return;
    
    try {
      await updateFeedback.mutateAsync({ 
        id: feedback.id, 
        merged_into_id: null 
      });
      toast({
        title: t("Fusion annulée", "Merge cancelled"),
        description: t("Ce feedback est maintenant un ticket indépendant", "This feedback is now an independent ticket"),
      });
    } catch {
      toast({
        title: t("Erreur", "Error"),
        variant: "destructive",
      });
    }
  };

  // Check if this feedback is merged into another
  const isMerged = !!feedback.merged_into_id;

  const companySizeLabels: Record<string, { fr: string; en: string }> = {
    "1-10": { fr: "1-10 employés", en: "1-10 employees" },
    "11-50": { fr: "11-50 employés", en: "11-50 employees" },
    "51-200": { fr: "51-200 employés", en: "51-200 employees" },
    "201-500": { fr: "201-500 employés", en: "201-500 employees" },
    "500+": { fr: "500+ employés", en: "500+ employees" },
    "unknown": { fr: "Non renseigné", en: "Unknown" },
  };

  return (
    <MainLayout title={t("Détail du feedback", "Feedback Detail")}>
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("Retour", "Back")}
      </Button>

      {/* Merged Banner */}
      {isMerged && isAdmin && (
        <div className="mb-6 p-4 rounded-lg border bg-purple-500/10 border-purple-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20">
                <GitMerge className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-purple-500">
                  {t("Ce feedback a été fusionné", "This feedback has been merged")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Il fait partie d'un ticket principal", "It's part of a main ticket")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/feedbacks/${feedback.merged_into_id}`}>
                  {t("Voir ticket principal", "View main ticket")}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUnmerge}
                disabled={updateFeedback.isPending}
                className="text-purple-500 border-purple-500/30 hover:bg-purple-500/10"
              >
                {updateFeedback.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {t("Annuler la fusion", "Unmerge")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <CriticalityBadge level={feedback.criticality} />
                  <StatusBadge status={feedback.status} />
                  <PriorityBadge level={feedback.priority} />
                  {feedback.merged_into_id && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-purple-500/20 text-purple-500 border-purple-500/30">
                      <GitMerge className="w-3 h-3" />
                      {t("Fusionné", "Merged")}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">
                  {t("Feedback du", "Feedback from")}{" "}
                  {format(new Date(feedback.date), "dd MMMM yyyy", { locale })}
                </CardTitle>
              </div>

              {isAdmin && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Priority Selector */}
                  <Select
                    value={feedback.priority || "none"}
                    onValueChange={(value) => handlePriorityChange(value as PriorityLevel | "none")}
                    disabled={updateFeedback.isPending}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t("Priorité", "Priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("Sans priorité", "No priority")}</SelectItem>
                      <SelectItem value="urgent">🔥 {t("Urgent", "Urgent")}</SelectItem>
                      <SelectItem value="high">⬆️ {t("Haute", "High")}</SelectItem>
                      <SelectItem value="medium">➡️ {t("Moyenne", "Medium")}</SelectItem>
                      <SelectItem value="low">⬇️ {t("Basse", "Low")}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status Selector */}
                  <Select
                    value={feedback.status}
                    onValueChange={handleStatusChange}
                    disabled={updateFeedback.isPending}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{t("Nouveau", "New")}</SelectItem>
                      <SelectItem value="in_progress">{t("En cours", "In Progress")}</SelectItem>
                      <SelectItem value="testing">{t("À tester", "Testing")}</SelectItem>
                      <SelectItem value="resolved">{t("Résolu", "Resolved")}</SelectItem>
                      <SelectItem value="closed">{t("Fermé", "Closed")}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Merge Button */}
                  {!feedback.merged_into_id && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowMergeDialog(true)}
                      title={t("Fusionner avec un autre feedback", "Merge with another feedback")}
                    >
                      <GitMerge className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Delete Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("Supprimer ce feedback ?", "Delete this feedback?")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t(
                            "Cette action est irréversible. Le feedback sera définitivement supprimé.",
                            "This action cannot be undone. The feedback will be permanently deleted."
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("Annuler", "Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteFeedback.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {t("Supprimer", "Delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <h3 className="font-medium text-foreground mb-2">
                {t("Description du problème", "Problem Description")}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {feedback.description}
              </p>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          {isAdmin && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {t("Notes internes", "Internal Notes")}
                </CardTitle>
                {!editingNotes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNotes(feedback.admin_notes || "");
                      setEditingNotes(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t("Modifier", "Edit")}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingNotes ? (
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t("Ajouter des notes...", "Add notes...")}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveNotes}
                        disabled={updateFeedback.isPending}
                      >
                        {updateFeedback.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("Sauvegarder", "Save")}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingNotes(false)}
                      >
                        {t("Annuler", "Cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {feedback.admin_notes || t("Aucune note", "No notes")}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Merged Feedbacks */}
          {isAdmin && mergedFeedbacks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GitMerge className="w-5 h-5" />
                  {t("Feedbacks fusionnés", "Merged Feedbacks")} ({mergedFeedbacks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mergedFeedbacks.map((mf) => (
                  <Link
                    key={mf.id}
                    to={`/feedbacks/${mf.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <CriticalityBadge level={mf.criticality} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(mf.date), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {mf.description.slice(0, 80)}...
                    </p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Limova Agent Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {t("Agent Limova", "Limova Agent")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.is_global ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{t("Problème global", "Global Issue")}</span>
                </div>
              ) : feedback.agent ? (
                <p className="font-medium text-foreground">{feedback.agent.name}</p>
              ) : (
                <p className="text-muted-foreground">{t("Non spécifié", "Not specified")}</p>
              )}
            </CardContent>
          </Card>

          {/* Team Member Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                {t("Collaborateur concerné", "Team Member")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {feedback.team_member ? (
                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    {feedback.team_member.name}
                    {feedback.team_member.is_manager && " 👑"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                      {feedback.team_member.team}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("Non assigné", "Not assigned")}</p>
              )}
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {t("Informations client", "Client Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a
                  href={`mailto:${feedback.client_email}`}
                  className="text-accent hover:underline"
                >
                  {feedback.client_email}
                </a>
              </div>

              {feedback.client_sector && (
                <div>
                  <p className="text-sm text-muted-foreground">{t("Secteur", "Industry")}</p>
                  <p className="font-medium">{feedback.client_sector}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">{t("Taille entreprise", "Company Size")}</p>
                <p className="font-medium">
                  {t(
                    companySizeLabels[feedback.company_size]?.fr || feedback.company_size,
                    companySizeLabels[feedback.company_size]?.en || feedback.company_size
                  )}
                </p>
              </div>

              {feedback.hubspot_link && (
                <a
                  href={feedback.hubspot_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("Voir sur HubSpot", "View on HubSpot")}
                </a>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t("Informations", "Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Date du feedback", "Feedback Date")}</span>
                <span className="font-medium">
                  {format(new Date(feedback.date), "dd/MM/yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Créé le", "Created")}</span>
                <span className="font-medium">
                  {format(new Date(feedback.created_at), "dd/MM/yyyy HH:mm")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("Mis à jour", "Updated")}</span>
                <span className="font-medium">
                  {format(new Date(feedback.updated_at), "dd/MM/yyyy HH:mm")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <SlackMessageDialog
        open={showSlackDialog}
        onOpenChange={setShowSlackDialog}
        feedback={feedback}
      />
      <MergeFeedbackDialog
        open={showMergeDialog}
        onOpenChange={setShowMergeDialog}
        currentFeedback={feedback}
      />
    </MainLayout>
  );
};

export default FeedbackDetail;
