import { Link } from "react-router-dom";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import cerimonia4 from "@/assets/gallery/cerimonia-4.jpg";
import cerimonia5 from "@/assets/gallery/cerimonia-5.jpg";
import cerimonia6 from "@/assets/gallery/cerimonia-6.jpg";

const courses = [
  {
    id: 1,
    image: cerimonia4,
    title: "Contabilidade e Gestão Empresarial",
    description: "Formação completa em contabilidade, finanças e gestão empresarial com foco na prática profissional.",
    duration: "3 anos",
    students: "120+ alunos",
  },
  {
    id: 2,
    image: cerimonia5,
    title: "Electricidade Industrial e Instaladora",
    description: "Capacitação técnica em instalações e manutenção eléctrica para indústria e residências.",
    duration: "3 anos",
    students: "90+ alunos",
  },
  {
    id: 3,
    image: cerimonia6,
    title: "Informática e Redes de Computadores",
    description: "Formação em suporte técnico, reparação de computadores e gestão de redes empresariais.",
    duration: "6 meses",
    students: "60+ alunos",
  },
];

const CoursesSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Cursos
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            Descubra cursos profissionais que irão impulsionar o seu conhecimento e carreira.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {courses.map((course) => (
            <div key={course.id} className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {course.students}
                  </span>
                </div>
                
                {/* Button */}
                <Button
                  asChild
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 sm:px-6 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Link to="/cursos">
                    Mais informações
                    <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none px-8 sm:px-12 font-medium text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Link to="/cursos">
              VER TODOS OS CURSOS
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
