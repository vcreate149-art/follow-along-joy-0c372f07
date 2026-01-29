import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Contabilista na Vodacom",
    content: "O IMPNAT preparou-me completamente para o mercado de trabalho. Hoje trabalho numa das maiores empresas do país graças à formação que recebi.",
  },
  {
    id: 2,
    name: "João Mabunda",
    role: "Técnico de Redes na Mcel",
    content: "O curso de Redes de Computadores abriu-me muitas portas. A formação prática do IMPNAT fez toda a diferença na minha carreira.",
  },
  {
    id: 3,
    name: "Ana Machava",
    role: "Secretária Executiva no BCI",
    content: "Recomendo o IMPNAT a todos! Os professores são excelentes e o ambiente de aprendizagem é incrível. Consegui emprego antes de terminar o curso.",
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
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            Testemunhos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O que dizem os nossos ex-alunos sobre a sua experiência no IMPNAT
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-background p-8 md:p-12 relative">
            <Quote className="h-10 w-10 text-primary/20 absolute top-6 left-6" />
            
            <blockquote className="text-lg md:text-xl text-foreground mb-8 leading-relaxed pl-8">
              "{testimonials[currentIndex].content}"
            </blockquote>

            <div className="pl-8">
              <p className="font-heading font-semibold text-foreground">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-muted-foreground text-sm">
                {testimonials[currentIndex].role}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background rounded-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background rounded-none"
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
