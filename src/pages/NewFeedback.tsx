import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MainLayout from "@/components/layout/MainLayout";
import { useTeamMembers, TeamType } from "@/hooks/useTeamMembers";
import { useAgents } from "@/hooks/useAgents";
import { useCreateFeedback, CriticalityLevel, CompanySize, BugType, FeedbackCategory } from "@/hooks/useFeedbacks";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date({ required_error: "La date est requise" }),
  team: z.enum(["sav", "onboarding", "founders", "sales"], { required_error: "L'équipe est requise" }),
  team_member_id: z.string({ required_error: "Le collaborateur est requis" }),
  criticality: z.enum(["critical", "medium", "low"], { required_error: "La criticité est requise" }),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  client_email: z.string().email("Email invalide"),
  client_sector: z.string().optional(),
  company_size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+", "unknown"]).optional(),
  hubspot_link: z.string().url("URL invalide").optional().or(z.literal("")),
  is_global: z.boolean().default(false),
  agent_id: z.string().optional(),
  jam_link: z.string().url("URL invalide").optional().or(z.literal("")),
  feedback_category: z.enum(["bug", "feature", "bug_prod"]).optional(),
  bug_type: z.enum(["backend", "frontend", "ai", "prompt", "mixed", "other"]).optional(),
  is_mandatory: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const NewFeedback = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createFeedback = useCreateFeedback();
  
  const [selectedTeam, setSelectedTeam] = useState<TeamType | undefined>();
  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers(selectedTeam);
  const { data: agents, isLoading: agentsLoading } = useAgents();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      company_size: "unknown",
      hubspot_link: "",
      jam_link: "",
      is_global: false,
      is_mandatory: false,
      feedback_category: "bug",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted with data:", data);
    
    try {
      const feedbackData = {
        date: format(data.date, "yyyy-MM-dd"),
        team_member_id: data.team_member_id,
        criticality: data.criticality as CriticalityLevel,
        description: data.description,
        client_email: data.client_email,
        client_sector: data.client_sector || undefined,
        company_size: (data.company_size as CompanySize) || undefined,
        hubspot_link: data.hubspot_link || undefined,
        is_global: data.is_global,
        agent_id: data.is_global ? undefined : data.agent_id || undefined,
        jam_link: data.jam_link || undefined,
        feedback_category: (data.feedback_category as FeedbackCategory) || undefined,
        bug_type: (data.bug_type as BugType) || undefined,
        is_mandatory: data.is_mandatory,
      };
      
      console.log("Sending feedback data:", feedbackData);
      
      const result = await createFeedback.mutateAsync(feedbackData);
      console.log("Feedback created successfully:", result);

      toast({
        title: t("Feedback créé", "Feedback created"),
        description: t("Le feedback a été enregistré avec succès", "The feedback has been recorded successfully"),
      });

      navigate("/feedbacks");
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      toast({
        title: t("Erreur", "Error"),
        description: error?.message || t("Une erreur est survenue", "An error occurred"),
        variant: "destructive",
      });
    }
  };

  const criticalityOptions = [
    { value: "critical", label: { fr: "🔴 Critique", en: "🔴 Critical" } },
    { value: "medium", label: { fr: "🟡 Moyenne", en: "🟡 Medium" } },
    { value: "low", label: { fr: "🟢 Basse", en: "🟢 Low" } },
  ];

  const companySizeOptions = [
    { value: "unknown", label: { fr: "Non renseigné", en: "Unknown" } },
    { value: "1-10", label: { fr: "1-10 employés", en: "1-10 employees" } },
    { value: "11-50", label: { fr: "11-50 employés", en: "11-50 employees" } },
    { value: "51-200", label: { fr: "51-200 employés", en: "51-200 employees" } },
    { value: "201-500", label: { fr: "201-500 employés", en: "201-500 employees" } },
    { value: "500+", label: { fr: "500+ employés", en: "500+ employees" } },
  ];

  const categoryOptions = [
    { value: "bug", label: { fr: "🐛 Bug", en: "🐛 Bug" } },
    { value: "feature", label: { fr: "✨ Feature", en: "✨ Feature" } },
    { value: "bug_prod", label: { fr: "🔥 Bug en Prod", en: "🔥 Bug in Prod" } },
  ];

  const bugTypeOptions = [
    { value: "backend", label: { fr: "Backend", en: "Backend" } },
    { value: "frontend", label: { fr: "Frontend", en: "Frontend" } },
    { value: "ai", label: { fr: "AI", en: "AI" } },
    { value: "prompt", label: { fr: "Prompt", en: "Prompt" } },
    { value: "mixed", label: { fr: "Mixte", en: "Mixed" } },
    { value: "other", label: { fr: "Autre", en: "Other" } },
  ];

  return (
    <MainLayout title={t("Nouveau Feedback", "New Feedback")}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("Enregistrer un retour client", "Record Customer Feedback")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("Date", "Date")} *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("Sélectionner une date", "Pick a date")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team */}
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Équipe", "Team")} *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTeam(value as TeamType);
                        form.setValue("team_member_id", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Sélectionner l'équipe", "Select team")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="founders">Founders</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="sav">SAV</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Team Member */}
              <FormField
                control={form.control}
                name="team_member_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Collaborateur concerné", "Team Member")} *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedTeam || membersLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Sélectionner le collaborateur", "Select team member")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers?.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} {member.is_manager && "👑"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agent Limova ou Problème Global */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <FormField
                  control={form.control}
                  name="is_global"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              form.setValue("agent_id", undefined);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {t("Problème global sur la plateforme", "Global platform issue")}
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          {t("Cochez si le problème affecte toute la plateforme et non un agent spécifique", "Check if the issue affects the entire platform, not a specific agent")}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {!form.watch("is_global") && (
                  <FormField
                    control={form.control}
                    name="agent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Agent Limova concerné", "Related Limova Agent")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={agentsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("Sélectionner l'agent", "Select agent")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {agents?.map((agent) => (
                              <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Criticality */}
              <FormField
                control={form.control}
                name="criticality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Niveau de criticité", "Criticality Level")} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Sélectionner la criticité", "Select criticality")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {criticalityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.label.fr, option.label.en)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Description du problème", "Problem Description")} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("Décrivez le problème rencontré...", "Describe the issue...")}
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Email */}
              <FormField
                control={form.control}
                name="client_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email du client", "Client Email")} *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="client@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Sector */}
              <FormField
                control={form.control}
                name="client_sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Secteur d'activité (optionnel)", "Industry (optional)")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Ex: Immobilier, Tech, Santé...", "E.g: Real Estate, Tech, Healthcare...")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Size */}
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Taille de l'entreprise (optionnel)", "Company Size (optional)")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(option.label.fr, option.label.en)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HubSpot Link */}
              <FormField
                control={form.control}
                name="hubspot_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Lien HubSpot (optionnel)", "HubSpot Link (optional)")}</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://app.hubspot.com/contacts/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Jam Link */}
              <FormField
                control={form.control}
                name="jam_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Lien Jam (optionnel)", "Jam Link (optional)")}</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://jam.dev/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Bug Type */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="feedback_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Catégorie (optionnel)", "Category (optional)")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.label.fr, option.label.en)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bug_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Type technique (optionnel)", "Technical Type (optional)")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Sélectionner", "Select")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bugTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.label.fr, option.label.en)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mandatory Checkbox */}
              <FormField
                control={form.control}
                name="is_mandatory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-destructive">
                        🚨 {t("Problème MANDATORY", "MANDATORY Issue")}
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {t("Cochez si ce problème est critique et doit être traité en priorité absolue", "Check if this issue is critical and must be treated as absolute priority")}
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={createFeedback.isPending}
              >
                {createFeedback.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("Enregistrer le feedback", "Save Feedback")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default NewFeedback;
