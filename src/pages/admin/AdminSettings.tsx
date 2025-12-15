import { Save, Globe, Palette, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminSettings = () => {
  const { t } = useLanguage();

  return (
    <MainLayout title={t("Paramètres", "Settings")}>
      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-8">
          {t(
            "Configurez les paramètres de votre académie.",
            "Configure your academy settings."
          )}
        </p>

        {/* General Settings */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("Paramètres généraux", "General settings")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("Informations de base de l'académie", "Basic academy information")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName">{t("Nom du site", "Site name")}</Label>
              <Input id="siteName" defaultValue="Limova Academy" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="siteDesc">{t("Description", "Description")}</Label>
              <Input 
                id="siteDesc" 
                defaultValue={t(
                  "Maîtrisez vos agents Limova avec nos tutoriels",
                  "Master your Limova agents with our tutorials"
                )} 
                className="mt-1.5" 
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("Apparence", "Appearance")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("Personnalisez l'apparence du site", "Customize site appearance")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {t("Mode sombre", "Dark mode")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Activer le thème sombre", "Enable dark theme")}
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card rounded-xl border border-border p-6 mb-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {t("Notifications", "Notifications")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("Gérez vos préférences de notification", "Manage notification preferences")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {t("Nouveaux tutoriels", "New tutorials")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Être notifié des nouveaux contenus", "Get notified of new content")}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            {t("Enregistrer", "Save")}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
