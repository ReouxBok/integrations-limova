import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Menu } from "lucide-react";
import limovaLogo from "@/assets/limova-logo.png";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { integrationCategories } from "@/lib/integrations-full-data";

const Sidebar = () => {
  const location = useLocation();
  const params = useParams();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentCategoryId = params.categoryId || (location.pathname === "/" ? "all" : null);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="h-14 lg:h-16 flex items-center px-6 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2" onClick={onNavigate}>
          <img src={limovaLogo} alt="Limova" className="h-8" />
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
        <h3 className="px-3 pb-3 text-sm font-semibold text-foreground">
          {t("Catégories", "Categories")}
        </h3>

        {integrationCategories.map((category) => {
          const isActive = currentCategoryId === category.id;
          const path = category.id === "all" ? "/" : `/category/${category.id}`;
          
          return (
            <Link
              key={category.id}
              to={path}
              onClick={onNavigate}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary ml-0" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {t(category.label.fr, category.label.en)}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 pt-4">
        <p className="text-xs text-muted-foreground text-center">© 2024 Limova</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-60 bg-background border-r border-border/50 flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header with Hamburger */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border/50 flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={limovaLogo} alt="Limova" className="h-7" />
        </Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 bg-background border-border/50">
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
