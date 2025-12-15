import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, Send, Loader2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MainLayout from "@/components/layout/MainLayout";
import { useAgents } from "@/hooks/useAgents";
import { useCreateContentRequest } from "@/hooks/useContentRequests";
import { useLanguage } from "@/contexts/LanguageContext";

const requestSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(100),
  lastName: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(20).optional(),
  description: z.string().trim().min(10, "Description trop courte (min. 10 caractères)").max(2000),
  agentId: z.string().optional(),
  isGeneral: z.boolean(),
});

const RequestContent = () => {
  const { t, language } = useLanguage();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const createRequest = useCreateContentRequest();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
    agentId: "",
    isGeneral: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = requestSchema.parse(formData);

      await createRequest.mutateAsync({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || undefined,
        description: validatedData.description,
        agent_id: validatedData.isGeneral ? null : (validatedData.agentId || null),
        is_general: validatedData.isGeneral,
      });

      setSubmitted(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  if (submitted) {
    return (
      <MainLayout title={t("Demande envoyée", "Request Sent")}>
        <div className="max-w-xl mx-auto text-center py-12">
          <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
            <MessageSquarePlus className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t("Merci pour votre demande !", "Thank you for your request!")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(
              "Nous avons bien reçu votre demande de contenu. Vous recevrez un email dès que le contenu sera disponible sur Limova Academy.",
              "We have received your content request. You will receive an email as soon as the content is available on Limova Academy."
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/">{t("Retour à l'accueil", "Back to home")}</Link>
            </Button>
            <Button onClick={() => setSubmitted(false)}>
              {t("Nouvelle demande", "New request")}
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("Demander du contenu", "Request Content")}>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t("Retour", "Back")}
          </Link>
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {t("Proposez un nouveau contenu", "Suggest new content")}
            </h2>
            <p className="text-muted-foreground">
              {t(
                "Vous souhaitez un tutoriel spécifique ? Remplissez ce formulaire et nous vous contacterons dès qu'il sera disponible.",
                "Want a specific tutorial? Fill out this form and we'll contact you as soon as it's available."
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("Prénom", "First Name")} *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("Nom", "Last Name")} *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("Email", "Email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("Téléphone", "Phone")} ({t("optionnel", "optional")})</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="isGeneral"
                  checked={formData.isGeneral}
                  onCheckedChange={(checked) => setFormData({ ...formData, isGeneral: !!checked, agentId: "" })}
                />
                <Label htmlFor="isGeneral" className="text-sm cursor-pointer">
                  {t("C'est une demande générale (pas liée à un agent)", "This is a general request (not linked to an agent)")}
                </Label>
              </div>
              
              {!formData.isGeneral && (
                <div className="space-y-2">
                  <Label>{t("Agent concerné", "Related Agent")}</Label>
                  <Select
                    value={formData.agentId}
                    onValueChange={(value) => setFormData({ ...formData, agentId: value })}
                    disabled={agentsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Sélectionner un agent", "Select an agent")} />
                    </SelectTrigger>
                    <SelectContent>
                      {agents?.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} - {language === 'fr' ? agent.description_fr.slice(0, 50) : agent.description_en.slice(0, 50)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("Description de votre demande", "Description of your request")} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t(
                  "Décrivez le type de contenu que vous aimeriez voir sur Limova Academy...",
                  "Describe the type of content you would like to see on Limova Academy..."
                )}
                rows={5}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={createRequest.isPending}>
              {createRequest.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {t("Envoyer ma demande", "Send my request")}
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestContent;
