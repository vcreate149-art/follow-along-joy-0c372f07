import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingElement } from "@/components/animations/Motion3D";
import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia3 from "@/assets/gallery/cerimonia-3.jpg";

const slides = [{
  image: cerimonia1,
  title: "EDUCAÇÃO",
  highlight: "PARA TODOS",
  subtitle: "Cursos Profissionais com Certificação ANEP"
}, {
  image: cerimonia2,
  title: "A TUA JORNADA",
  highlight: "COMEÇA AQUI",
  subtitle: "Formação de Qualidade com Estágio Garantido"
}, {
  image: cerimonia3,
  title: "INVESTE NO TEU",
  highlight: "FUTURO",
  subtitle: "Inscrições Abertas 2025 - Inscrição Grátis"
}];


const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-primary">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <motion.img 
            src={slides[currentSlide].image} 
            alt={`${slides[currentSlide].title} ${slides[currentSlide].highlight}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8 }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-full sm:max-w-2xl lg:max-w-3xl" style={{ perspective: "1000px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: -10 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-2 sm:mb-4">
                  <motion.span 
                    className="block leading-tight"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {slides[currentSlide].title}
                  </motion.span>
                  <motion.span 
                    className="italic font-normal text-secondary block leading-tight"
                    initial={{ opacity: 0, x: 30, rotateY: 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {slides[currentSlide].highlight}
                  </motion.span>
                </h1>
                
                <motion.p 
                  className="text-sm sm:text-base lg:text-lg text-primary-foreground/90 mb-6 sm:mb-8 max-w-md sm:max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-none w-full xs:w-auto">
                  <Link to="/inscricoes">
                    Inscrever-se Agora
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: -5 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-medium text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-none w-full xs:w-auto">
                  <Link to="/cursos">
                    Ver Cursos
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 flex items-center gap-2 sm:gap-4">
        <motion.button 
          onClick={prevSlide} 
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors rounded-full" 
          aria-label="Slide anterior"
          whileHover={{ scale: 1.1, rotateY: -10 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
        
        <div className="flex gap-2 sm:gap-3">
          {slides.map((_, index) => (
            <motion.button 
              key={index} 
              onClick={() => setCurrentSlide(index)} 
              className={`text-base sm:text-lg font-medium transition-colors ${index === currentSlide ? "text-primary-foreground" : "text-primary-foreground/50 hover:text-primary-foreground/70"}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>
        
        <motion.button 
          onClick={nextSlide} 
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors rounded-full" 
          aria-label="Próximo slide"
          whileHover={{ scale: 1.1, rotateY: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
