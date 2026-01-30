import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";
import logo from "@/assets/logo-impnat.png";
import { isAdminRole } from "@/lib/admin-roles";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        const role = roleData?.role as string | null;
        navigate(isAdminRole(role) ? "/admin" : "/dashboard");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
          
          const role = roleData?.role as string | null;
          navigate(isAdminRole(role) ? "/admin" : "/dashboard");
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").insert({
            user_id: data.user.id,
            full_name: email.split("@")[0],
            email: email,
            user_type: "student",
          });
        }

        toast({
          title: "Conta Criada",
          description: "Bem-vindo ao IMPNAT! A tua conta foi criada com sucesso.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login Efetuado",
          description: "Bem-vindo de volta!",
        });
      }
    } catch (error: any) {
      let message = "Ocorreu um erro. Tenta novamente.";
      
      if (error.message.includes("Invalid login credentials")) {
        message = "Email ou password incorretos.";
      } else if (error.message.includes("User already registered")) {
        message = "Este email já está registado.";
      } else if (error.message.includes("Password should be")) {
        message = "A password deve ter pelo menos 6 caracteres.";
      }

      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-background">
        <div className="text-center mb-8">
          <img src={logo} alt="IMPNAT Logo" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Área do Aluno
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isSignUp ? "Cria uma conta para aceder" : "Inicia sessão para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="aluno@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              "Criar Conta"
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp
              ? "Já tens conta? Inicia sessão"
              : "Não tens conta? Regista-te"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            ← Voltar ao site
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
