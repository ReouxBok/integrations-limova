import { Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 lg:h-16 bg-background flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 z-30">
      <h1 className="text-lg lg:text-xl font-semibold text-foreground truncate">{title}</h1>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-2 h-8 sm:h-9 px-2 sm:px-3"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs sm:text-sm">{language.toUpperCase()}</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
