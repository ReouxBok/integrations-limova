import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import TutorialCard from "@/components/tutorials/TutorialCard";
import { useAgent } from "@/hooks/useAgents";
import { useTutorialsByAgent } from "@/hooks/useTutorials";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { data: agent, isLoading: agentLoading } = useAgent(id || "");
  const { data: tutorials, isLoading: tutorialsLoading } = useTutorialsByAgent(id || "");

  if (agentLoading) {
    return (
      <MainLayout title={t("Chargement...", "Loading...")}>
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-40 w-full rounded-2xl mb-8" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </MainLayout>
    );
  }

  if (!agent) {
    return (
      <MainLayout title={t("Agent non trouvé", "Agent not found")}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("Cet agent n'existe pas.", "This agent doesn't exist.")}
          </p>
          <Button asChild>
            <Link to="/agents">{t("Retour aux agents", "Back to agents")}</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={agent.name}>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/agents" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("Retour", "Back")}
          </Link>
        </Button>
      </div>

      {/* Agent Header */}
      <div className="bg-card rounded-2xl border border-border p-8 mb-8 shadow-card">
        <div className="flex items-start gap-6">
          {agent.avatar_url && (
            <img 
              src={agent.avatar_url} 
              alt={agent.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-border"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{agent.name}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {language === 'fr' ? agent.description_fr : agent.description_en}
            </p>
          </div>
        </div>
      </div>

      {/* Tutorials */}
      <section>
        {(() => {
          // Filter tutorials that have content in the current language
          const filteredTutorials = tutorials?.filter(tutorial => {
            if (language === 'fr') {
              return tutorial.title_fr && tutorial.title_fr.trim() !== '';
            } else {
              return tutorial.title_en && tutorial.title_en.trim() !== '';
            }
          }) || [];
          
          return (
            <>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t("Tutoriels", "Tutorials")} ({filteredTutorials.length})
              </h3>

              {tutorialsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))}
                </div>
              ) : filteredTutorials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTutorials.map((tutorial, index) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} index={index} />
                  ))}
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">
                    {t(
                      "Aucun tutoriel disponible pour cet agent.",
                      "No tutorials available for this agent."
                    )}
                  </p>
                </div>
              )}
            </>
          );
        })()}
      </section>
    </MainLayout>
  );
};

export default AgentDetail;