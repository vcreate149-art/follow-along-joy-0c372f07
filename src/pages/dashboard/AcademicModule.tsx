import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StudentLayout from "@/components/dashboard/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const AcademicModule = () => {
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        // Get enrollments with course disciplines
        const { data: enrollments } = await supabase
          .from("enrollments")
          .select(`
            course:courses(
              id,
              name,
              disciplines(*)
            )
          `)
          .eq("student_id", profile.id);

        const allDisciplines = enrollments?.flatMap(e => 
          e.course?.disciplines?.map((d: any) => ({
            ...d,
            courseName: e.course?.name
          })) || []
        ) || [];

        setDisciplines(allDisciplines);

        // Get study materials for these disciplines
        if (allDisciplines.length > 0) {
          const disciplineIds = allDisciplines.map(d => d.id);
          
          const { data: materialsData } = await supabase
            .from("study_materials")
            .select("*, discipline:disciplines(name)")
            .in("discipline_id", disciplineIds);

          setMaterials(materialsData || []);

          const { data: assessmentsData } = await supabase
            .from("assessments")
            .select("*, discipline:disciplines(name)")
            .in("discipline_id", disciplineIds)
            .gte("assessment_date", new Date().toISOString())
            .order("assessment_date", { ascending: true });

          setAssessments(assessmentsData || []);
        }

        // Get grades
        const { data: gradesData } = await supabase
          .from("grades")
          .select("*, assessment:assessments(title, max_grade, discipline:disciplines(name))")
          .eq("student_id", profile.id);

        setGrades(gradesData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "pdf":
      default:
        return <FileText className="h-5 w-5 text-red-500" />;
    }
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
        <div>
          <h1 className="font-heading text-2xl font-bold">Módulo Académico</h1>
          <p className="text-muted-foreground">
            Acede aos materiais de estudo, calendário de avaliações e notas.
          </p>
        </div>

        <Tabs defaultValue="disciplinas" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

          <TabsContent value="disciplinas" className="mt-6">
            {disciplines.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Ainda não tens disciplinas associadas ao teu curso.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {disciplines.map((discipline) => (
                  <Card key={discipline.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{discipline.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{discipline.courseName}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Semestre {discipline.semester}</span>
                        <Badge variant="outline">{discipline.credits} créditos</Badge>
                      </div>
                      {discipline.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {discipline.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="materiais" className="mt-6">
            {materials.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Ainda não existem materiais disponíveis.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <Card key={material.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          {getFileIcon(material.file_type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{material.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {material.discipline?.name}
                          </p>
                          {material.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {material.description}
                            </p>
                          )}
                        </div>
                        {material.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="avaliacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendário de Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Não há avaliações agendadas.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {assessments.map((assessment) => (
                        <div key={assessment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-lg min-w-[60px]">
                            <span className="text-2xl font-bold text-primary">
                              {format(new Date(assessment.assessment_date), "d")}
                            </span>
                            <span className="text-xs text-primary uppercase">
                              {format(new Date(assessment.assessment_date), "MMM", { locale: pt })}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{assessment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {assessment.discipline?.name}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(assessment.assessment_date), "HH:mm")}
                              </span>
                              {assessment.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {assessment.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">
                            Máx: {assessment.max_grade} valores
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notas" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Minhas Notas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grades.length === 0 ? (
                  <div className="py-8 text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Ainda não tens notas registadas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{grade.assessment?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {grade.assessment?.discipline?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            grade.grade >= 10 ? "text-green-600" : "text-destructive"
                          }`}>
                            {grade.grade}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            de {grade.assessment?.max_grade} valores
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default AcademicModule;
