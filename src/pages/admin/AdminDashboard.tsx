import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  CreditCard,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEnrollments: 0,
    pendingPayments: 0,
    overduePayments: 0,
    pendingDocuments: 0,
    totalRevenue: 0,
    pendingInscricoes: 0,
  });
  const [recentInscricoes, setRecentInscricoes] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData?.role !== "admin") {
        navigate("/dashboard");
        return;
      }

      // Fetch stats
      const [
        { count: studentCount },
        { count: enrollmentCount },
        { data: paymentsData },
        { count: documentCount },
        { data: inscricoesData },
        { count: pendingInscricoesCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("user_type", "student"),
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("payments").select("*"),
        supabase.from("document_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("inscricoes").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("inscricoes").select("*", { count: "exact", head: true }).eq("status", "pendente"),
      ]);

      const pendingPayments = paymentsData?.filter(p => p.status === "pending").length || 0;
      const overduePayments = paymentsData?.filter(p => p.status === "overdue").length || 0;
      const totalRevenue = paymentsData?.filter(p => p.status === "paid").reduce((acc, p) => acc + Number(p.amount), 0) || 0;

      setStats({
        totalStudents: studentCount || 0,
        activeEnrollments: enrollmentCount || 0,
        pendingPayments,
        overduePayments,
        pendingDocuments: documentCount || 0,
        totalRevenue,
        pendingInscricoes: pendingInscricoesCount || 0,
      });

      setRecentInscricoes(inscricoesData || []);

      // Get recent payments
      const { data: recentPaymentsData } = await supabase
        .from("payments")
        .select("*, student:profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentPayments(recentPaymentsData || []);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
            Painel Administrativo
          </h1>
          <p className="text-primary-foreground/80">
            Gestão completa do IMPNAT - Alunos, Finanças e Conteúdos.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alunos</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <GraduationCap className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matrículas Ativas</p>
                  <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamentos Atrasados</p>
                  <p className="text-2xl font-bold text-destructive">{stats.overduePayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.totalRevenue.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.pendingInscricoes > 0 && (
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardContent className="p-4 flex items-center gap-4">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="font-medium">Inscrições Pendentes</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingInscricoes} novas inscrições aguardam aprovação
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate("/admin/utilizadores")}>
                  Ver
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.pendingDocuments > 0 && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardContent className="p-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">Documentos Pendentes</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingDocuments} pedidos aguardam processamento
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  Ver
                </Button>
              </CardContent>
            </Card>
          )}

          {stats.pendingPayments > 0 && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4 flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Pagamentos Pendentes</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingPayments} pagamentos por confirmar
                  </p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto" onClick={() => navigate("/admin/financeiro")}>
                  Ver
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inscricoes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Inscrições Recentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/utilizadores")}>
                Ver Todas <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentInscricoes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma inscrição recente.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentInscricoes.map((inscricao) => (
                    <div key={inscricao.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{inscricao.nome_completo}</p>
                        <p className="text-sm text-muted-foreground">{inscricao.curso_escolhido}</p>
                      </div>
                      <Badge variant={
                        inscricao.status === "pendente" ? "outline" :
                        inscricao.status === "confirmado" ? "default" : "destructive"
                      }>
                        {inscricao.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pagamentos Recentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/financeiro")}>
                Ver Todos <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum pagamento registado.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {payment.status === "paid" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : payment.status === "overdue" ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-500" />
                        )}
                        <div>
                          <p className="font-medium">{payment.student?.full_name || "Aluno"}</p>
                          <p className="text-sm text-muted-foreground">{payment.description}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${
                        payment.status === "paid" ? "text-green-600" : ""
                      }`}>
                        {Number(payment.amount).toLocaleString()} MT
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/utilizadores")}>
            <Users className="h-6 w-6" />
            <span>Gerir Alunos</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/financeiro")}>
            <CreditCard className="h-6 w-6" />
            <span>Controlo Financeiro</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/conteudo")}>
            <FileText className="h-6 w-6" />
            <span>Gestão de Conteúdo</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate("/admin/configuracoes")}>
            <GraduationCap className="h-6 w-6" />
            <span>Cursos</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
