import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Menu, Brain, Zap, MessageSquare, Users, Database, Kanban, Code, Megaphone, CreditCard, FileText, Cloud, Share2, BarChart3, Workflow, ShoppingCart, Headphones, Briefcase, Wallet, MoreHorizontal, Blocks } from "lucide-react";
import limovaLogo from "@/assets/limova-logo.png";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { integrationCategories } from "@/lib/integrations-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Blocks,
  Brain,
  Zap,
  MessageSquare,
  Users,
  Database,
  Kanban,
  Code,
  Megaphone,
  CreditCard,
  FileText,
  Cloud,
  Share2,
  BarChart3,
  Workflow,
  ShoppingCart,
  HeadphonesIcon: Headphones,
  Briefcase,
  Wallet,
  MoreHorizontal,
};

const Sidebar = () => {
  const location = useLocation();
  const params = useParams();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentCategoryId = params.categoryId || (location.pathname === "/" ? "all" : null);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <img src={limovaLogo} alt="Limova" className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="pb-2">
          <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t("Catégories", "Categories")}
          </span>
        </div>

        {integrationCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || Blocks;
          const isActive = currentCategoryId === category.id;
          const path = category.id === "all" ? "/" : `/category/${category.id}`;
          
          return (
            <Link
              key={category.id}
              to={path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <IconComponent className="w-5 h-5" />
              {t(category.label.fr, category.label.en)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
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
