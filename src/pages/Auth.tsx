import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, AlertCircle, ShieldCheck, Shield } from "lucide-react";
import logo from "@/assets/logo-impnat.png";
import { isAdminRole } from "@/lib/admin-roles";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailAuthorized, setEmailAuthorized] = useState<boolean | null>(null);
  const [authorizedInfo, setAuthorizedInfo] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Check if coming from admin route
  const fromAdmin = searchParams.get("from") === "admin";

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
        navigate(isAdminRole(role) ? "/admin" : "/impnat-aluno");
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
          navigate(isAdminRole(role) ? "/admin" : "/impnat-aluno");
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check if email is authorized when in signup mode
  const checkEmailAuthorization = async (emailToCheck: string) => {
    if (!emailToCheck || !isSignUp) {
      setEmailAuthorized(null);
      setAuthorizedInfo(null);
      return;
    }

    setCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from("authorized_emails")
        .select("*, course:courses(name)")
        .eq("email", emailToCheck.toLowerCase().trim())
        .is("registered_at", null) // Only check unregistered emails
        .single();

      if (data && !error) {
        setEmailAuthorized(true);
        setAuthorizedInfo(data);
      } else {
        setEmailAuthorized(false);
        setAuthorizedInfo(null);
      }
    } catch {
      setEmailAuthorized(false);
      setAuthorizedInfo(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  // Debounce email check
  useEffect(() => {
    if (!isSignUp) {
      setEmailAuthorized(null);
      return;
    }

    const timer = setTimeout(() => {
      if (email.includes("@")) {
        checkEmailAuthorization(email);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Check authorization before signup
        if (!emailAuthorized) {
          toast({
            title: "Email Não Autorizado",
            description: "Este email não está na lista de alunos autorizados. Contacte a secretaria do IMPNAT.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/impnat-aluno`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Create profile with authorized info
          await supabase.from("profiles").insert({
            user_id: data.user.id,
            full_name: authorizedInfo?.full_name || email.split("@")[0],
            email: email,
            user_type: "student",
          });

          // Mark email as registered
          await supabase
            .from("authorized_emails")
            .update({ registered_at: new Date().toISOString() })
            .eq("email", email.toLowerCase().trim());

          // Create enrollment if course was pre-assigned
          if (authorizedInfo?.course_id) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("id")
              .eq("user_id", data.user.id)
              .single();

            if (profileData) {
              await supabase.from("enrollments").insert({
                student_id: profileData.id,
                course_id: authorizedInfo.course_id,
                status: "active",
              });
            }
          }
        }

        toast({
          title: "Conta Criada",
          description: `Bem-vindo ao IMPNAT, ${authorizedInfo?.full_name || ""}! A tua conta foi criada com sucesso.`,
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
          {fromAdmin ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  Administração
                </h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Acesso restrito a administradores
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-bold text-foreground">
                Área do Aluno
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                {isSignUp ? "Cria uma conta para aceder" : "Inicia sessão para continuar"}
              </p>
            </>
          )}
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
            
            {/* Authorization status for signup */}
            {isSignUp && email.includes("@") && (
              <div className="mt-2">
                {checkingEmail ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    A verificar email...
                  </div>
                ) : emailAuthorized === true ? (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      <strong>Email autorizado!</strong>
                      {authorizedInfo?.full_name && (
                        <span className="block text-sm">
                          Bem-vindo(a), {authorizedInfo.full_name}
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : emailAuthorized === false ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este email não está autorizado. Contacte a secretaria do IMPNAT para solicitar acesso.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            )}
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
            disabled={loading || (isSignUp && emailAuthorized !== true)}
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
