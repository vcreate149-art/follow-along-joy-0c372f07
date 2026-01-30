import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Motion3D } from "@/components/animations/Motion3D";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Contabilista na Vodacom",
    course: "Contabilidade e Gestão",
    content: "O IMPNAT preparou-me completamente para o mercado de trabalho. Hoje trabalho numa das maiores empresas do país graças à formação que recebi.",
  },
  {
    id: 2,
    name: "João Mabunda",
    role: "Técnico de Redes na Mcel",
    course: "Redes de Computadores",
    content: "O curso de Redes de Computadores abriu-me muitas portas. A formação prática do IMPNAT fez toda a diferença na minha carreira.",
  },
  {
    id: 3,
    name: "Ana Machava",
    role: "Secretária Executiva no BCI",
    course: "Secretariado Executivo",
    content: "Recomendo o IMPNAT a todos! Os professores são excelentes e o ambiente de aprendizagem é incrível. Consegui emprego antes de terminar o curso.",
  },
  {
    id: 4,
    name: "Carlos Nhaca",
    role: "Eletricista na EDM",
    course: "Eletricidade Industrial",
    content: "A formação técnica do IMPNAT é de primeira qualidade. Hoje sou eletricista na EDM e devo tudo à base sólida que construí no instituto.",
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
    <section className="py-12 sm:py-16 lg:py-20 bg-muted overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Motion3D type="fadeUp" className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Testemunhos
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            O que dizem os nossos ex-alunos sobre a sua experiência no IMPNAT
          </p>
        </Motion3D>

        {/* Testimonial Card */}
        <div className="max-w-3xl mx-auto" style={{ perspective: "1200px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ 
                opacity: 0, 
                rotateY: 90,
                scale: 0.8,
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                scale: 1,
              }}
              exit={{ 
                opacity: 0, 
                rotateY: -90,
                scale: 0.8,
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut",
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-background p-6 sm:p-8 md:p-10 lg:p-12 relative rounded-lg shadow-lg"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/20 absolute top-4 sm:top-6 left-4 sm:left-6" />
              </motion.div>
              
              <motion.blockquote 
                className="text-base sm:text-lg md:text-xl text-foreground mb-6 sm:mb-8 leading-relaxed pl-4 sm:pl-8 pt-6 sm:pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                "{testimonials[currentIndex].content}"
              </motion.blockquote>

              <motion.div 
                className="pl-4 sm:pl-8 border-l-4 border-secondary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <p className="font-heading font-semibold text-foreground text-sm sm:text-base">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {testimonials[currentIndex].role}
                </p>
                <motion.p 
                  className="text-secondary text-xs sm:text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  Curso: {testimonials[currentIndex].course}
                </motion.p>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <motion.div
              whileHover={{ scale: 1.1, rotateZ: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background rounded-full h-10 w-10 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-foreground/20 hover:bg-foreground/40"
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.8 }}
                  animate={{ 
                    scale: index === currentIndex ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background rounded-full h-10 w-10 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
