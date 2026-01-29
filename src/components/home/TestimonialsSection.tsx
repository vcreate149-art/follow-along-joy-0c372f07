import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Contabilista",
    company: "Vodacom Moçambique",
    course: "Contabilidade e Gestão",
    content: "O IMPNAT preparou-me completamente para o mercado de trabalho. Hoje trabalho numa das maiores empresas do país graças à formação que recebi.",
    initials: "MS",
  },
  {
    id: 2,
    name: "João Mabunda",
    role: "Técnico de Redes",
    company: "Mcel",
    course: "Redes de Computadores",
    content: "O curso de Redes de Computadores abriu-me muitas portas. A formação prática do IMPNAT fez toda a diferença na minha carreira.",
    initials: "JM",
  },
  {
    id: 3,
    name: "Ana Machava",
    role: "Secretária Executiva",
    company: "BCI",
    course: "Secretariado Executivo",
    content: "Recomendo o IMPNAT a todos! Os professores são excelentes e o ambiente de aprendizagem é incrível. Consegui emprego antes de terminar o curso.",
    initials: "AM",
  },
  {
    id: 4,
    name: "Carlos Nhaca",
    role: "Electricista Industrial",
    company: "EDM",
    course: "Electricidade Industrial",
    content: "A formação técnica do IMPNAT é de primeira qualidade. Hoje sou electricista na EDM e devo tudo à base sólida que construí no instituto.",
    initials: "CN",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            O Que Dizem os Nossos <span className="text-secondary">Ex-Alunos</span>
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Histórias de sucesso de quem passou pelo IMPNAT e hoje brilha no mercado de trabalho
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-primary-foreground/20">
            <Quote className="h-12 w-12 text-secondary mb-6" />
            
            <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
              "{testimonials[currentIndex].content}"
            </blockquote>

            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-secondary">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                  {testimonials[currentIndex].initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-heading font-semibold text-lg">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-primary-foreground/80 text-sm">
                  {testimonials[currentIndex].role} na {testimonials[currentIndex].company}
                </p>
                <p className="text-secondary text-sm">
                  Curso: {testimonials[currentIndex].course}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-secondary"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
