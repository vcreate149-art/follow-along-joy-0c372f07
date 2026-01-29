import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia3 from "@/assets/gallery/cerimonia-3.jpg";

const slides = [
  {
    image: cerimonia1,
    title: "EDUCAÇÃO",
    highlight: "PARA TODOS",
    subtitle: "Cursos Profissionais com Certificação ANEP",
  },
  {
    image: cerimonia2,
    title: "A TUA JORNADA",
    highlight: "COMEÇA AQUI",
    subtitle: "Formação de Qualidade com Estágio Garantido",
  },
  {
    image: cerimonia3,
    title: "INVESTE NO TEU",
    highlight: "FUTURO",
    subtitle: "Inscrições Abertas 2025 - Inscrição Grátis",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
              <span className="block">{slides[currentSlide].title}</span>
              <span className="italic font-normal text-secondary">
                {slides[currentSlide].highlight}
              </span>
            </h1>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-primary/90 hover:bg-primary text-primary-foreground font-medium text-lg px-8 py-6 rounded-none border-2 border-primary-foreground/20"
              >
                <Link to="/inscricoes">
                  {slides[currentSlide].subtitle}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-8 z-20 flex gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`text-lg font-medium transition-colors ${
              index === currentSlide
                ? "text-primary-foreground"
                : "text-primary-foreground/50 hover:text-primary-foreground/70"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
