import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  FileText, 
  GraduationCap, 
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  LogOut,
  Loader2,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Inscricao {
  id: string;
  nome_completo: string;
  telefone: string;
  email: string | null;
  curso_escolhido: string;
  tipo_curso: string;
  status: string;
  created_at: string;
}

interface Stats {
  totalInscricoes: number;
  pendentes: number;
  confirmadas: number;
  cursosMedios: number;
  cursosCurtos: number;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalInscricoes: 0,
    pendentes: 0,
    confirmadas: 0,
    cursosMedios: 0,
    cursosCurtos: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          title: "Acesso Negado",
          description: "Não tens permissões de administrador.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setUser(session.user);
      await fetchData();
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const fetchData = async () => {
    // Fetch inscricoes
    const { data: inscricoesData } = await supabase
      .from("inscricoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (inscricoesData) {
      setInscricoes(inscricoesData);

      // Calculate stats
      setStats({
        totalInscricoes: inscricoesData.length,
        pendentes: inscricoesData.filter((i) => i.status === "pendente").length,
        confirmadas: inscricoesData.filter((i) => i.status === "confirmada").length,
        cursosMedios: inscricoesData.filter((i) => i.tipo_curso === "medio").length,
        cursosCurtos: inscricoesData.filter((i) => i.tipo_curso === "curto").length,
      });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("inscricoes")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      toast({
        title: "Status Atualizado",
        description: `Inscrição marcada como ${newStatus}.`,
      });
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-800",
    confirmada: "bg-green-100 text-green-800",
    cancelada: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pendente: <Clock className="h-3.5 w-3.5" />,
    confirmada: <CheckCircle className="h-3.5 w-3.5" />,
    cancelada: <XCircle className="h-3.5 w-3.5" />,
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold">Painel Admin</h1>
            <p className="text-sm text-primary-foreground/80">IMPNAT - Instituto Médio Politécnico</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">{user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Inscrições", value: stats.totalInscricoes, icon: Users, color: "text-primary" },
            { label: "Pendentes", value: stats.pendentes, icon: Clock, color: "text-yellow-600" },
            { label: "Confirmadas", value: stats.confirmadas, icon: CheckCircle, color: "text-green-600" },
            { label: "Cursos Médios", value: stats.cursosMedios, icon: GraduationCap, color: "text-blue-600" },
            { label: "Cursos Curtos", value: stats.cursosCurtos, icon: TrendingUp, color: "text-purple-600" },
          ].map((stat, index) => (
            <Card key={index} className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="inscricoes" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="inscricoes" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Inscrições</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inscricoes">
            <Card className="p-6">
              <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                Inscrições Recentes
              </h2>

              {inscricoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma inscrição encontrada.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inscricoes.map((inscricao) => (
                        <TableRow key={inscricao.id}>
                          <TableCell className="font-medium">
                            {inscricao.nome_completo}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {inscricao.telefone}
                              </div>
                              {inscricao.email && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {inscricao.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {inscricao.curso_escolhido.replace(/-/g, " ")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {inscricao.tipo_curso}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(inscricao.created_at), "d MMM yyyy", { locale: pt })}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[inscricao.status]} gap-1`}>
                              {statusIcons[inscricao.status]}
                              {inscricao.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {inscricao.status === "pendente" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => updateStatus(inscricao.id, "confirmada")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => updateStatus(inscricao.id, "cancelada")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
