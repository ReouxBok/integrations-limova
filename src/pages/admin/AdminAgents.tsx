import { useState } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAgents, useCreateAgent, useUpdateAgent, useDeleteAgent, Agent } from "@/hooks/useAgents";
import { Navigate, Link } from "react-router-dom";

const AdminAgents = () => {
  const { t, language } = useLanguage();
  const { isAdmin, isLoading: authLoading, user } = useAuth();
  const { data: agents, isLoading } = useAgents();
  
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const deleteAgent = useDeleteAgent();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    <MainLayout title={t("Gestion des agents", "Agent Management")}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {t("Gérez tous vos agents depuis cet espace.", "Manage all your agents from this space.")}
          </p>
          <AgentDialog 
            onSubmit={(data) => createAgent.mutate(data)}
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("Ajouter un agent", "Add agent")}
            </Button>
          </AgentDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents?.map((agent) => (
          <div key={agent.id} className="bg-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-start gap-4 mb-4">
              {agent.avatar_url ? (
                <img src={agent.avatar_url} alt={agent.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {agent.tutorial_count} {t("tutoriels", "tutorials")}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {language === 'fr' ? agent.description_fr : agent.description_en}
            </p>
            <div className="flex gap-2">
              <AgentDialog 
                agent={agent}
                onSubmit={(data) => updateAgent.mutate({ id: agent.id, ...data })}
              >
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit className="w-4 h-4" />
                  {t("Modifier", "Edit")}
                </Button>
              </AgentDialog>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => deleteAgent.mutate(agent.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {(!agents || agents.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t("Aucun agent. Cliquez sur 'Ajouter' pour commencer.", "No agents. Click 'Add' to start.")}
          </p>
        </div>
      )}
    </MainLayout>
  );
};

// Agent Dialog Component
interface AgentDialogProps {
  agent?: Agent;
  onSubmit: (data: Omit<Agent, 'id' | 'tutorial_count' | 'created_at' | 'updated_at'>) => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AgentDialog = ({ agent, onSubmit, children, open, onOpenChange }: AgentDialogProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    description_fr: agent?.description_fr || '',
    description_en: agent?.description_en || '',
    avatar_url: agent?.avatar_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {agent ? t("Modifier l'agent", "Edit agent") : t("Nouvel agent", "New agent")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("Nom", "Name")} *</Label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Charly"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("URL de l'avatar", "Avatar URL")}</Label>
            <Input 
              value={formData.avatar_url || ''} 
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>{t("Description (FR)", "Description (FR)")} *</Label>
            <Textarea 
              value={formData.description_fr} 
              onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("Description (EN)", "Description (EN)")} *</Label>
            <Textarea 
              value={formData.description_en} 
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {agent ? t("Mettre à jour", "Update") : t("Créer", "Create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAgents;
