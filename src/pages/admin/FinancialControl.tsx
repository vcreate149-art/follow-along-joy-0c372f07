import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  PieChart,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const FinancialControl = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*, student:profiles(full_name, email)")
      .order("due_date", { ascending: false });

    setPayments(data || []);
    setLoading(false);
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === "paid") {
        updateData.paid_date = new Date().toISOString().split("T")[0];
      }

      const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Pagamento ${status === "paid" ? "confirmado" : "atualizado"}.`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.student?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRevenue: payments.filter(p => p.status === "paid").reduce((acc, p) => acc + Number(p.amount), 0),
    totalPending: payments.filter(p => p.status === "pending").reduce((acc, p) => acc + Number(p.amount), 0),
    totalOverdue: payments.filter(p => p.status === "overdue").reduce((acc, p) => acc + Number(p.amount), 0),
    pendingCount: payments.filter(p => p.status === "pending").length,
    overdueCount: payments.filter(p => p.status === "overdue").length,
    studentsWithDebt: new Set(payments.filter(p => p.status === "overdue").map(p => p.student_id)).size,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Pago</Badge>;
      case "overdue":
        return <Badge variant="destructive">Em Atraso</Badge>;
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
        <div>
          <h1 className="font-heading text-2xl font-bold">Controlo Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão de pagamentos, receitas e inadimplências.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-500/5 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.totalRevenue.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendente ({stats.pendingCount})</p>
                  <p className="text-xl font-bold text-amber-600">
                    {stats.totalPending.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Atraso ({stats.overdueCount})</p>
                  <p className="text-xl font-bold text-destructive">
                    {stats.totalOverdue.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alunos Inadimplentes</p>
                  <p className="text-xl font-bold">{stats.studentsWithDebt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por aluno ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="overdue">Em Atraso</SelectItem>
              <SelectItem value="paid">Pagos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Lista de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="py-8 text-center">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Vencimento: {format(new Date(payment.due_date), "d MMM yyyy", { locale: pt })}
                          {payment.paid_date && (
                            <span className="ml-2 text-green-600">
                              • Pago: {format(new Date(payment.paid_date), "d MMM yyyy", { locale: pt })}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {Number(payment.amount).toLocaleString()} MT
                        </p>
                        {getStatusBadge(payment.status)}
                      </div>
                      {payment.status !== "paid" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updatePaymentStatus(payment.id, "paid")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FinancialControl;
