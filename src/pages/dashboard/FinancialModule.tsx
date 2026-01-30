import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  Smartphone,
  Receipt,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const FinancialModule = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        const { data: paymentData } = await supabase
          .from("payments")
          .select("*")
          .eq("student_id", profile.id)
          .order("due_date", { ascending: false });

        setPayments(paymentData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const pendingPayments = payments.filter(p => p.status === "pending");
  const overduePayments = payments.filter(p => p.status === "overdue");
  const paidPayments = payments.filter(p => p.status === "paid");

  const totalPending = pendingPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalOverdue = overduePayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const totalPaid = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CreditCard className="h-5 w-5" />;
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
          <h1 className="font-heading text-2xl font-bold">Módulo Financeiro</h1>
          <p className="text-muted-foreground">
            Gere os teus pagamentos e consulta o histórico financeiro.
          </p>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Em Atraso</p>
                  <p className="text-2xl font-bold text-destructive">
                    {totalOverdue.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {totalPending.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalPaid.toLocaleString()} MT
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Métodos de Pagamento
            </CardTitle>
            <CardDescription>
              Paga as tuas propinas através de M-Pesa ou e-Mola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-red-500/10 to-red-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">M-Pesa</h4>
                    <p className="text-sm text-muted-foreground">Vodacom</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>1.</strong> Marca *150#</p>
                  <p><strong>2.</strong> Seleciona "Pagamentos"</p>
                  <p><strong>3.</strong> Insere o código: <span className="font-mono bg-muted px-2 py-1 rounded">123456</span></p>
                  <p><strong>4.</strong> Introduz o valor e confirma</p>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">e-Mola</h4>
                    <p className="text-sm text-muted-foreground">Movitel</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>1.</strong> Marca *898#</p>
                  <p><strong>2.</strong> Seleciona "Pagar"</p>
                  <p><strong>3.</strong> Insere o código: <span className="font-mono bg-muted px-2 py-1 rounded">789012</span></p>
                  <p><strong>4.</strong> Introduz o valor e confirma</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingPayments.length + overduePayments.length})
            </TabsTrigger>
            <TabsTrigger value="paid" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Pagos ({paidPayments.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Receipt className="h-4 w-4" />
              Todos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                {[...overduePayments, ...pendingPayments].length === 0 ? (
                  <div className="py-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">
                      Não tens pagamentos pendentes. Excelente!
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {[...overduePayments, ...pendingPayments].map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(payment.status)}
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Vencimento: {format(new Date(payment.due_date), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{Number(payment.amount).toLocaleString()} MT</p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paid" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {paidPayments.length === 0 ? (
                  <div className="py-8 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Ainda não tens pagamentos registados.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {paidPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Pago em: {payment.paid_date ? format(new Date(payment.paid_date), "d MMM yyyy", { locale: pt }) : "-"}
                              </p>
                              {payment.payment_method && (
                                <p className="text-xs text-muted-foreground">
                                  Via {payment.payment_method}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-600">
                              {Number(payment.amount).toLocaleString()} MT
                            </p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="py-8 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Não existem registos financeiros.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(payment.status)}
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(payment.due_date), "d MMM yyyy", { locale: pt })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {Number(payment.amount).toLocaleString()} MT
                            </p>
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinancialModule;
