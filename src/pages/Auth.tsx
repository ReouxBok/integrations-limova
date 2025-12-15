import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().email('Email invalide').max(255),
  password: z.string().min(6, 'Mot de passe trop court (min. 6 caractères)').max(100),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().trim().min(1, 'Prénom requis').max(100),
  lastName: z.string().trim().min(1, 'Nom requis').max(100),
});

const Auth = () => {
  const { t } = useLanguage();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const schema = isLogin ? loginSchema : signupSchema;
      const validatedData = schema.parse(formData);

      if (isLogin) {
        const { error } = await signIn(validatedData.email, validatedData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({ title: 'Erreur', description: 'Email ou mot de passe incorrect', variant: 'destructive' });
          } else {
            toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
          }
        } else {
          toast({ title: 'Connexion réussie' });
          navigate('/');
        }
      } else {
        const { error } = await signUp(
          validatedData.email, 
          validatedData.password, 
          (validatedData as z.infer<typeof signupSchema>).firstName,
          (validatedData as z.infer<typeof signupSchema>).lastName
        );
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ title: 'Erreur', description: 'Cet email est déjà utilisé', variant: 'destructive' });
          } else {
            toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
          }
        } else {
          toast({ title: 'Compte créé', description: 'Vous pouvez maintenant vous connecter' });
          setIsLogin(true);
        }
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Retour à l'accueil", "Back to home")}
          </Link>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent mx-auto mb-4 flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? t("Connexion Admin", "Admin Login") : t("Créer un compte", "Create Account")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? t("Connectez-vous pour accéder à l'espace administrateur", "Sign in to access the admin area")
                : t("Créez un compte pour demander l'accès admin", "Create an account to request admin access")
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("Prénom", "First Name")}</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("Nom", "Last Name")}</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("Email", "Email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@limova.com"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("Mot de passe", "Password")}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? t("Se connecter", "Sign In") : t("Créer le compte", "Create Account")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-accent hover:underline"
            >
              {isLogin 
                ? t("Pas encore de compte ? Créer un compte", "Don't have an account? Create one")
                : t("Déjà un compte ? Se connecter", "Already have an account? Sign in")
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
