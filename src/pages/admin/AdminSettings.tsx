import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Settings,
  BookOpen,
  Loader2,
} from "lucide-react";

const AdminSettings = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  
  const [courseForm, setCourseForm] = useState({
    name: "",
    description: "",
    duration: "",
    category: "Cursos Médios",
    is_active: true,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*, disciplines(*)")
      .order("name");

    setCourses(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseForm)
          .eq("id", editingCourse.id);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Curso atualizado." });
      } else {
        const { error } = await supabase
          .from("courses")
          .insert(courseForm);
        if (error) throw error;
        toast({ title: "Sucesso", description: "Curso criado." });
      }

      setDialogOpen(false);
      setCourseForm({ name: "", description: "", duration: "", category: "Cursos Médios", is_active: true });
      setEditingCourse(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este curso?")) return;
    
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível eliminar.", variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Curso eliminado." });
      fetchData();
    }
  };

  const toggleCourseActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("courses")
      .update({ is_active: !isActive })
      .eq("id", id);
    
    if (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar.", variant: "destructive" });
    } else {
      fetchData();
    }
  };

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
          <h1 className="font-heading text-2xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gere cursos e configurações do sistema.
          </p>
        </div>

        {/* Courses Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Gestão de Cursos
              </CardTitle>
              <CardDescription>
                Adicione, edite ou remova cursos do sistema.
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setEditingCourse(null);
                setCourseForm({ name: "", description: "", duration: "", category: "Cursos Médios", is_active: true });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Curso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingCourse ? "Editar Curso" : "Novo Curso"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Curso *</Label>
                    <Input
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      placeholder="Ex: Cursos Médios, Cursos Curtos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <Input
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      placeholder="Ex: 3 anos, 6 meses"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={courseForm.is_active}
                      onCheckedChange={(checked) => setCourseForm({ ...courseForm, is_active: checked })}
                    />
                    <Label>Curso Ativo</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCourse ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum curso cadastrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      !course.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{course.name}</h4>
                        <Badge variant={course.is_active ? "default" : "secondary"}>
                          {course.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} • {course.disciplines?.length || 0} disciplinas
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={course.is_active}
                        onCheckedChange={() => toggleCourseActive(course.id, course.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCourse(course);
                          setCourseForm({
                            name: course.name,
                            description: course.description || "",
                            duration: course.duration || "",
                            category: course.category,
                            is_active: course.is_active,
                          });
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Estatísticas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Total de Cursos: {courses.length}</li>
                  <li>Cursos Ativos: {courses.filter(c => c.is_active).length}</li>
                  <li>Cursos Médios: {courses.filter(c => c.category === "Cursos Médios").length}</li>
                  <li>Cursos Curtos: {courses.filter(c => c.category === "Cursos Curtos").length}</li>
                </ul>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Versão do Sistema</h4>
                <p className="text-sm text-muted-foreground">
                  IMPNAT SaaS v1.0<br />
                  Última atualização: Janeiro 2026
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
