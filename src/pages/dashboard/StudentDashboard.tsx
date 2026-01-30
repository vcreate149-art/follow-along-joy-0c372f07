import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Bell,
  TrendingUp,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const StudentDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);

      if (profileData) {
        // Get enrollments
        const { data: enrollmentData } = await supabase
          .from("enrollments")
          .select(`
            *,
            course:courses(*)
          `)
          .eq("student_id", profileData.id);

        setEnrollments(enrollmentData || []);

        // Get payments
        const { data: paymentData } = await supabase
          .from("payments")
          .select("*")
          .eq("student_id", profileData.id)
          .order("due_date", { ascending: true })
          .limit(5);

        setPayments(paymentData || []);
      }

      // Get announcements
      const { data: announcementData } = await supabase
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);

      setAnnouncements(announcementData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const pendingPayments = payments.filter(p => p.status === "pending" || p.status === "overdue");
  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_percent || 0), 0) / enrollments.length)
    : 0;

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">
            Olá, {profile?.full_name?.split(" ")[0] || "Aluno"}! 👋
          </h1>
          <p className="text-primary-foreground/80">
            Bem-vindo à tua Área do Aluno. Aqui podes acompanhar o teu progresso académico.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                  <p className="text-2xl font-bold">{totalProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <CreditCard className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pagamentos Pendentes</p>
                  <p className="text-2xl font-bold">{pendingPayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/50">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próximas Avaliações</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Meus Cursos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Ainda não estás inscrito em nenhum curso.</p>
                  <Button className="mt-4" asChild>
                    <a href="/inscricoes">Inscrever-me Agora</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{enrollment.course?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.course?.category}
                          </p>
                        </div>
                        <Badge variant={enrollment.status === "active" ? "default" : "secondary"}>
                          {enrollment.status === "active" ? "Ativo" : enrollment.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{enrollment.progress_percent || 0}%</span>
                        </div>
                        <Progress value={enrollment.progress_percent || 0} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Avisos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sem avisos recentes.
                </p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
                      {announcement.is_urgent && (
                        <Badge variant="destructive" className="mb-1">Urgente</Badge>
                      )}
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(announcement.published_at), "d MMM yyyy", { locale: pt })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payments Section */}
        {pendingPayments.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <CreditCard className="h-5 w-5" />
                Pagamentos Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {format(new Date(payment.due_date), "d 'de' MMMM", { locale: pt })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{payment.amount.toLocaleString()} MT</p>
                      <Badge variant={payment.status === "overdue" ? "destructive" : "outline"}>
                        {payment.status === "overdue" ? "Em Atraso" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" asChild>
                <a href="/dashboard/financeiro">Ver Todos os Pagamentos</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <a href="/dashboard/academico">
              <BookOpen className="h-6 w-6" />
              <span>Materiais de Estudo</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <a href="/dashboard/financeiro">
              <CreditCard className="h-6 w-6" />
              <span>Pagar Propina</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <a href="/dashboard/secretaria">
              <FileText className="h-6 w-6" />
              <span>Solicitar Documento</span>
            </a>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
            <a href="/dashboard/avisos">
              <Bell className="h-6 w-6" />
              <span>Ver Avisos</span>
            </a>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
