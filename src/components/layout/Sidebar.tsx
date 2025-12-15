import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, MessageSquarePlus, LogIn, LogOut, Menu, List, Headphones, GraduationCap, FileSpreadsheet } from "lucide-react";
import limovaLogo from "@/assets/limova-logo.png";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: { fr: "Tableau de bord", en: "Dashboard" }, path: "/" },
    { icon: MessageSquarePlus, label: { fr: "Nouveau Feedback", en: "New Feedback" }, path: "/feedback/new" },
    { icon: List, label: { fr: "Tous les Feedbacks", en: "All Feedbacks" }, path: "/feedbacks" },
    { icon: Headphones, label: { fr: "Équipe SAV", en: "SAV Team" }, path: "/team/sav" },
    { icon: GraduationCap, label: { fr: "Équipe Onboarding", en: "Onboarding Team" }, path: "/team/onboarding" },
  ];

  const adminItems = [
    { icon: FileSpreadsheet, label: { fr: "Import Excel", en: "Excel Import" }, path: "/admin/import" },
    { icon: Settings, label: { fr: "Paramètres", en: "Settings" }, path: "/admin/settings" },
  ];

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <img src={limovaLogo} alt="Limova" className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {t(item.label.fr, item.label.en)}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-6 pb-2">
              <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("Administration", "Administration")}
              </span>
            </div>

            {adminItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {t(item.label.fr, item.label.en)}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4 space-y-2">
        {user ? (
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { signOut(); onNavigate?.(); }}>
            <LogOut className="w-4 h-4" />
            {t("Déconnexion", "Logout")}
          </Button>
        ) : (
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/auth" onClick={onNavigate}>
              <LogIn className="w-4 h-4" />
              {t("Connexion Admin", "Admin Login")}
            </Link>
          </Button>
        )}
        <p className="text-xs text-muted-foreground text-center">© 2024 Limova</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header with Hamburger */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={limovaLogo} alt="Limova" className="h-7" />
        </Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
            <div className="flex flex-col h-full">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default Sidebar;
