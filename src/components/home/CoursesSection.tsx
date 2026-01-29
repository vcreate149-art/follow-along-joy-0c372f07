import { Link } from "react-router-dom";
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
  },
  {
    id: 2,
    image: cerimonia5,
    title: "Electricidade Industrial e Instaladora",
    description: "Capacitação técnica em instalações e manutenção eléctrica para indústria e residências.",
  },
  {
    id: 3,
    image: cerimonia6,
    title: "Informática e Redes de Computadores",
    description: "Formação em suporte técnico, reparação de computadores e gestão de redes empresariais.",
  },
];

const CoursesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            Cursos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra cursos profissionais que irão impulsionar o seu conhecimento e carreira.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <div key={course.id} className="group">
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Content */}
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {course.description}
              </p>
              
              {/* Button */}
              <Button
                asChild
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6"
              >
                <Link to="/cursos">
                  Mais informações
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none px-12 font-medium"
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
