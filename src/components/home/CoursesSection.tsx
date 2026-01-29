import { Link } from "react-router-dom";
import { ArrowRight, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: 1,
    name: "Contabilidade e Gestão",
    duration: "3 anos",
    type: "Curso Médio",
    students: "120+ alunos",
    description: "Formação completa em contabilidade, finanças e gestão empresarial.",
    icon: "📊",
    featured: true,
  },
  {
    id: 2,
    name: "Secretariado Executivo",
    duration: "2 anos",
    type: "Curso Médio",
    students: "80+ alunos",
    description: "Preparação para funções administrativas e de secretariado de alto nível.",
    icon: "📋",
    featured: false,
  },
  {
    id: 3,
    name: "Gestão de Logística",
    duration: "2 anos",
    type: "Curso Médio",
    students: "60+ alunos",
    description: "Especialização em gestão de cadeia de suprimentos e logística.",
    icon: "📦",
    featured: false,
  },
  {
    id: 4,
    name: "Electricidade Industrial",
    duration: "3 anos",
    type: "Curso Médio",
    students: "90+ alunos",
    description: "Formação técnica em instalações e manutenção eléctrica industrial.",
    icon: "⚡",
    featured: true,
  },
  {
    id: 5,
    name: "Redes de Computadores",
    duration: "6 meses",
    type: "Curso Curto",
    students: "40+ alunos",
    description: "Capacitação em instalação e gestão de redes de computadores.",
    icon: "🌐",
    featured: false,
  },
  {
    id: 6,
    name: "Gestão de Recursos Humanos",
    duration: "2 anos",
    type: "Curso Médio",
    students: "70+ alunos",
    description: "Formação em gestão de pessoas e práticas de RH.",
    icon: "👥",
    featured: false,
  },
];

const CoursesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-secondary border-secondary">
            Formação Profissional
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossos <span className="text-primary">Cursos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos cursos médios e curtos com certificação reconhecida pela ANEP, 
            preparando profissionais qualificados para o mercado de trabalho.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <Card
              key={course.id}
              className={`group hover:shadow-xl transition-all duration-300 border-2 ${
                course.featured ? "border-secondary" : "border-border hover:border-primary/30"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{course.icon}</span>
                  {course.featured && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      Popular
                    </Badge>
                  )}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mt-4 group-hover:text-primary transition-colors">
                  {course.name}
                </h3>
                <Badge variant="outline" className="w-fit">
                  {course.type}
                </Badge>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground text-sm mb-4">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <Link to="/cursos">
                    Saber Mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/cursos">
              Ver Todos os Cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
