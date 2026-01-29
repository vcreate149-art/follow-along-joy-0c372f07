import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, GraduationCap, Award, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
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
const features = [{
  icon: GraduationCap,
  title: "Inscrição Grátis",
  description: "Sem taxas de inscrição"
}, {
  icon: Award,
  title: "Certificado ANEP",
  description: "Diploma reconhecido"
}, {
  icon: Briefcase,
  title: "Estágio Garantido",
  description: "Parcerias empresariais"
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
  return <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: `url(${slide.image})`
      }} />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/30 sm:from-primary/70 sm:via-primary/50 sm:to-transparent" />
        </div>)}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-full sm:max-w-2xl lg:max-w-3xl">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-2 sm:mb-4">
              <span className="block leading-tight">{slides[currentSlide].title}</span>
              <span className="italic font-normal text-secondary block leading-tight">
                {slides[currentSlide].highlight}
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/90 mb-6 sm:mb-8 max-w-md sm:max-w-lg">
              {slides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-none w-full xs:w-auto">
                <Link to="/inscricoes">
                  Inscrever-se Agora
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-medium text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-none w-full xs:w-auto">
                <Link to="/cursos">
                  Ver Cursos
                </Link>
              </Button>
            </div>

            {/* Features - Mobile cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-primary-foreground">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-primary-foreground/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 flex items-center gap-2 sm:gap-4">
        <button onClick={prevSlide} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors rounded-full" aria-label="Slide anterior">
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        
        <div className="flex gap-2 sm:gap-3">
          {slides.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`text-base sm:text-lg font-medium transition-colors ${index === currentSlide ? "text-primary-foreground" : "text-primary-foreground/50 hover:text-primary-foreground/70"}`}>
              {index + 1}
            </button>)}
        </div>
        
        <button onClick={nextSlide} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors rounded-full" aria-label="Próximo slide">
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </section>;
};
export default HeroSection;