import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import AgentCard from "@/components/agents/AgentCard";
import { useAgents } from "@/hooks/useAgents";
import { useTutorials } from "@/hooks/useTutorials";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: tutorials } = useTutorials();
  
  const featuredAgents = agents?.slice(0, 4) || [];
  const totalTutorials = tutorials?.length || 0;

  return (
    <MainLayout title={t("Accueil", "Home")}>
      {/* Hero Section */}
      <section className="relative mb-12 p-8 rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            {t("Bienvenue sur Limova Academy", "Welcome to Limova Academy")}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-up">
            {t("Maîtrisez vos agents", "Master your agents")}
            <br />
            <span className="gradient-text">{t("en quelques clics", "in just a few clicks")}</span>
          </h2>
          
          <p className="text-muted-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t(
              "Découvrez nos tutoriels interactifs pour tirer le meilleur parti de chaque assistant Limova.",
              "Discover our interactive tutorials to get the most out of each Limova assistant."
            )}
          </p>
          
          <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="gap-2">
              <Link to="/agents">
                <Users className="w-4 h-4" />
                {t("Explorer les agents", "Explore agents")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/tutorials">
                <BookOpen className="w-4 h-4" />
                {t("Tous les tutoriels", "All tutorials")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { value: (agents?.length || 0).toString(), label: { fr: "Agents disponibles", en: "Available agents" }, icon: Users },
          { value: totalTutorials.toString(), label: { fr: "Tutoriels", en: "Tutorials" }, icon: BookOpen },
          { value: "2", label: { fr: "Langues", en: "Languages" }, icon: Sparkles },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-card rounded-xl border border-border p-6 shadow-card animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">
                  {t(stat.label.fr, stat.label.en)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Agents */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {t("Agents populaires", "Popular agents")}
          </h3>
          <Link 
            to="/agents" 
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {t("Voir tous", "View all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {agentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAgents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        )}

        {!agentsLoading && featuredAgents.length === 0 && (
          <div className="text-center py-12 bg-muted rounded-xl">
            <p className="text-muted-foreground">
              {t("Aucun agent disponible pour le moment.", "No agents available yet.")}
            </p>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default Index;