import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import MainLayout from "@/components/layout/MainLayout";
import AgentCard from "@/components/agents/AgentCard";
import { useAgents } from "@/hooks/useAgents";
import { useLanguage } from "@/contexts/LanguageContext";

const Agents = () => {
  const { t, language } = useLanguage();
  const { data: agents, isLoading } = useAgents();
  const [search, setSearch] = useState("");

  const filteredAgents = agents?.filter(agent => {
    const searchLower = search.toLowerCase();
    return (
      agent.name.toLowerCase().includes(searchLower) ||
      agent.description_fr.toLowerCase().includes(searchLower) ||
      agent.description_en.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <MainLayout title={t("Agents", "Agents")}>
      <div className="mb-8">
        <p className="text-muted-foreground mb-6">
          {t(
            "Découvrez tous les agents Limova et leurs tutoriels associés.",
            "Discover all Limova agents and their associated tutorials."
          )}
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("Rechercher un agent...", "Search for an agent...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      )}

      {!isLoading && filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {t("Aucun agent trouvé.", "No agent found.")}
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Agents;