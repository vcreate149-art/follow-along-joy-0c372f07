import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const UserManagement = () => {
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInscricao, setSelectedInscricao] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: inscricoesData }, { data: profilesData }] = await Promise.all([
      supabase.from("inscricoes").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*, enrollments(*, course:courses(*))").eq("user_type", "student"),
    ]);

    setInscricoes(inscricoesData || []);
    setProfiles(profilesData || []);
    setLoading(false);
  };

  const updateInscricaoStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("inscricoes")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Inscrição ${status === "confirmado" ? "confirmada" : "atualizada"}.`,
      });

      fetchData();
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a inscrição.",
        variant: "destructive",
      });
    }
  };

  const filteredInscricoes = inscricoes.filter(i => {
    const matchesSearch = i.nome_completo.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.telefone.includes(search);
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gestão de Utilizadores</h1>
          <p className="text-muted-foreground">
            Gere inscrições, alunos e utilizadores do sistema.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email ou telefone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="confirmado">Confirmados</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="inscricoes">
          <TabsList>
            <TabsTrigger value="inscricoes" className="gap-2">
              <Clock className="h-4 w-4" />
              Inscrições ({inscricoes.length})
            </TabsTrigger>
            <TabsTrigger value="alunos" className="gap-2">
              <Users className="h-4 w-4" />
              Alunos Registados ({profiles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inscricoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Inscrições</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredInscricoes.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma inscrição encontrada.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredInscricoes.map((inscricao) => (
                      <div
                        key={inscricao.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{inscricao.nome_completo}</h4>
                            <Badge variant={
                              inscricao.status === "pendente" ? "outline" :
                              inscricao.status === "confirmado" ? "default" : "destructive"
                            }>
                              {inscricao.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              {inscricao.curso_escolhido}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {inscricao.telefone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(inscricao.created_at), "d MMM yyyy", { locale: pt })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedInscricao(inscricao);
                              setDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {inscricao.status === "pendente" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-600 hover:text-green-700 hover:bg-green-100"
                                onClick={() => updateInscricaoStatus(inscricao.id, "confirmado")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => updateInscricaoStatus(inscricao.id, "cancelado")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alunos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Registados</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProfiles.length === 0 ? (
                  <div className="py-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum aluno registado.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{profile.full_name}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                            {profile.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {profile.email}
                              </span>
                            )}
                            {profile.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {profile.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {profile.enrollments?.length > 0 ? (
                            <Badge>{profile.enrollments.length} curso(s)</Badge>
                          ) : (
                            <Badge variant="outline">Sem cursos</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes da Inscrição</DialogTitle>
            </DialogHeader>
            {selectedInscricao && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{selectedInscricao.nome_completo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">BI</p>
                    <p className="font-medium">{selectedInscricao.bilhete_identidade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{selectedInscricao.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedInscricao.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {format(new Date(selectedInscricao.data_nascimento), "d 'de' MMMM 'de' yyyy", { locale: pt })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Escolaridade</p>
                    <p className="font-medium">{selectedInscricao.escolaridade}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Morada</p>
                    <p className="font-medium">{selectedInscricao.morada}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Curso</p>
                    <p className="font-medium">{selectedInscricao.tipo_curso}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Curso Escolhido</p>
                    <p className="font-medium">{selectedInscricao.curso_escolhido}</p>
                  </div>
                </div>

                {selectedInscricao.observacoes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="font-medium">{selectedInscricao.observacoes}</p>
                  </div>
                )}

                {selectedInscricao.status === "pendente" && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updateInscricaoStatus(selectedInscricao.id, "confirmado")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Inscrição
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => updateInscricaoStatus(selectedInscricao.id, "cancelado")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
