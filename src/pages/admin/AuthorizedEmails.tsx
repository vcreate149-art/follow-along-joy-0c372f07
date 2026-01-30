import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Upload,
  Loader2,
  Users,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface AuthorizedEmail {
  id: string;
  email: string;
  full_name: string;
  student_id: string | null;
  course_id: string | null;
  authorized_at: string;
  registered_at: string | null;
  notes: string | null;
  course?: { name: string } | null;
}

const AuthorizedEmails = () => {
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkEmails, setBulkEmails] = useState("");
  const [bulkCourseId, setBulkCourseId] = useState("");
  
  const [newEmailForm, setNewEmailForm] = useState({
    email: "",
    full_name: "",
    student_id: "",
    course_id: "",
    notes: "",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: emailsData }, { data: coursesData }] = await Promise.all([
      supabase
        .from("authorized_emails")
        .select("*, course:courses(name)")
        .order("authorized_at", { ascending: false }),
      supabase.from("courses").select("id, name").eq("is_active", true),
    ]);

    setEmails(emailsData || []);
    setCourses(coursesData || []);
    setLoading(false);
  };

  const handleAddEmail = async () => {
    if (!newEmailForm.email || !newEmailForm.full_name) {
      toast({
        title: "Erro",
        description: "Email e nome completo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("authorized_emails").insert({
        email: newEmailForm.email.toLowerCase().trim(),
        full_name: newEmailForm.full_name.trim(),
        student_id: newEmailForm.student_id || null,
        course_id: newEmailForm.course_id || null,
        notes: newEmailForm.notes || null,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Este email já está autorizado.");
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "Email autorizado com sucesso.",
      });

      setDialogOpen(false);
      setNewEmailForm({ email: "", full_name: "", student_id: "", course_id: "", notes: "" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível autorizar o email.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkAdd = async () => {
    const lines = bulkEmails.split("\n").filter(line => line.trim());
    
    if (lines.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um email.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const emailsToAdd = lines.map(line => {
        const parts = line.split(",").map(p => p.trim());
        return {
          email: parts[0]?.toLowerCase() || "",
          full_name: parts[1] || parts[0]?.split("@")[0] || "Aluno",
          student_id: parts[2] || null,
          course_id: bulkCourseId || null,
        };
      }).filter(e => e.email.includes("@"));

      const { error } = await supabase.from("authorized_emails").insert(emailsToAdd);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${emailsToAdd.length} emails autorizados com sucesso.`,
      });

      setBulkDialogOpen(false);
      setBulkEmails("");
      setBulkCourseId("");
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar os emails.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta autorização?")) return;

    try {
      const { error } = await supabase.from("authorized_emails").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Autorização removida.",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a autorização.",
        variant: "destructive",
      });
    }
  };

  const filteredEmails = emails.filter(e =>
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.student_id?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: emails.length,
    registered: emails.filter(e => e.registered_at).length,
    pending: emails.filter(e => !e.registered_at).length,
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
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Emails Autorizados
          </h1>
          <p className="text-muted-foreground">
            Apenas emails nesta lista podem criar conta no sistema.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Registados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.registered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por email, nome ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Adicionar em Massa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar Emails em Massa</DialogTitle>
                <DialogDescription>
                  Cole uma lista de emails (um por linha). Formato: email, nome, id_aluno
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Curso (opcional)</Label>
                  <Select value={bulkCourseId} onValueChange={setBulkCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar curso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lista de Emails</Label>
                  <Textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="aluno1@email.com, João Silva, 2024001
aluno2@email.com, Maria Santos, 2024002"
                    rows={8}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setBulkDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleBulkAdd} disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Autorizar Novo Email</DialogTitle>
                <DialogDescription>
                  Este aluno poderá criar uma conta no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={newEmailForm.email}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, email: e.target.value })}
                    placeholder="aluno@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    value={newEmailForm.full_name}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, full_name: e.target.value })}
                    placeholder="João Silva"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID do Aluno</Label>
                    <Input
                      value={newEmailForm.student_id}
                      onChange={(e) => setNewEmailForm({ ...newEmailForm, student_id: e.target.value })}
                      placeholder="2024001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Curso</Label>
                    <Select
                      value={newEmailForm.course_id}
                      onValueChange={(value) => setNewEmailForm({ ...newEmailForm, course_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={newEmailForm.notes}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, notes: e.target.value })}
                    placeholder="Notas adicionais..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={handleAddEmail} disabled={submitting}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Autorizar"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Email List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Emails Autorizados</CardTitle>
            <CardDescription>
              Alunos com email nesta lista podem criar conta na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEmails.length === 0 ? (
              <div className="py-12 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum email autorizado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      email.registered_at ? "bg-green-500/5 border-green-500/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${email.registered_at ? "bg-green-500/10" : "bg-muted"}`}>
                        {email.registered_at ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{email.full_name}</p>
                          {email.student_id && (
                            <Badge variant="outline" className="text-xs">
                              #{email.student_id}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{email.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {email.course?.name && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {email.course.name}
                            </Badge>
                          )}
                          {email.registered_at ? (
                            <span className="text-xs text-green-600">
                              Registou-se em {format(new Date(email.registered_at), "d MMM yyyy", { locale: pt })}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Autorizado em {format(new Date(email.authorized_at), "d MMM yyyy", { locale: pt })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={email.registered_at ? "default" : "outline"}>
                        {email.registered_at ? "Registado" : "Pendente"}
                      </Badge>
                      {!email.registered_at && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(email.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

export default AuthorizedEmails;
