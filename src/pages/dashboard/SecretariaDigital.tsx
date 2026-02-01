import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StudentLayout from "@/components/dashboard/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const documentTypes = [
  { value: "declaracao_matricula", label: "Declaração de Matrícula" },
  { value: "declaracao_frequencia", label: "Declaração de Frequência" },
  { value: "historico_escolar", label: "Histórico Escolar" },
  { value: "certificado", label: "Certificado de Conclusão" },
  { value: "declaracao_notas", label: "Declaração de Notas" },
  { value: "outro", label: "Outro Documento" },
];

const SecretariaDigital = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    document_type: "",
    purpose: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    setProfile(profileData);

    if (profileData) {
      const { data: requestsData } = await supabase
        .from("document_requests")
        .select("*")
        .eq("student_id", profileData.id)
        .order("requested_at", { ascending: false });

      setRequests(requestsData || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !formData.document_type) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("document_requests")
        .insert({
          student_id: profile.id,
          document_type: formData.document_type,
          purpose: formData.purpose || null,
        });

      if (error) throw error;

      toast({
        title: "Pedido Enviado",
        description: "O teu pedido foi registado com sucesso. Serás notificado quando estiver pronto.",
      });

      setFormData({ document_type: "", purpose: "" });
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o pedido. Tenta novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500">Pronto para Levantar</Badge>;
      case "delivered":
        return <Badge variant="secondary">Entregue</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Em Processamento</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-muted-foreground" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getDocumentLabel = (value: string) => {
    return documentTypes.find(d => d.value === value)?.label || value;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold">Secretaria Digital</h1>
            <p className="text-muted-foreground">
              Solicita declarações e certificados online.
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar Documento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document_type">Tipo de Documento *</Label>
                  <Select
                    value={formData.document_type}
                    onValueChange={(value) => setFormData({ ...formData, document_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleciona o documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((doc) => (
                        <SelectItem key={doc.value} value={doc.value}>
                          {doc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Finalidade (Opcional)</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Ex: Para apresentar no emprego"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Informação Importante:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Prazo de preparação: 3 a 5 dias úteis</li>
                    <li>• Serás notificado quando estiver pronto</li>
                    <li>• Levantamento na secretaria com BI</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting || !formData.document_type} className="flex-1">
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Enviar Pedido"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === "processing").length}
              </p>
              <p className="text-sm text-muted-foreground">Em Processamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === "ready").length}
              </p>
              <p className="text-sm text-muted-foreground">Prontos</p>
            </CardContent>
          </Card>
        </div>

        {/* Request List */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Pedidos</CardTitle>
            <CardDescription>Histórico de documentos solicitados</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Ainda não solicitaste nenhum documento.
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Fazer Primeiro Pedido
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="p-3 bg-muted rounded-lg">
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">
                            {getDocumentLabel(request.document_type)}
                          </h4>
                          {request.purpose && (
                            <p className="text-sm text-muted-foreground">
                              Finalidade: {request.purpose}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          Solicitado: {format(new Date(request.requested_at), "d MMM yyyy 'às' HH:mm", { locale: pt })}
                        </span>
                        {request.ready_at && (
                          <span>
                            Pronto: {format(new Date(request.ready_at), "d MMM yyyy", { locale: pt })}
                          </span>
                        )}
                      </div>
                      {request.notes && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded">
                          <strong>Nota:</strong> {request.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Informações Úteis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Horário da Secretaria</h4>
                <p className="text-sm text-muted-foreground">
                  Segunda a Sexta: 08:00 - 16:00<br />
                  Sábado: 08:00 - 12:00
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Contacto</h4>
                <p className="text-sm text-muted-foreground">
                  Tel: +258 87 516 1111<br />
                  Email: secretaria@impnat.co.mz
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
};

export default SecretariaDigital;
