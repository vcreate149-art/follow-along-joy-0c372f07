import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import ctaImage from "@/assets/cta-image.jpg";

const benefits = [
  "Inscrição 100% Grátis",
  "Certificado reconhecido pela ANEP",
  "Estágio garantido em empresas parceiras",
  "Professores qualificados e experientes",
];

const CTASection = () => {
  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Side */}
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-auto lg:min-h-[500px] order-2 lg:order-1">
          <img
            src={ctaImage}
            alt="Pais apoiem o futuro dos vossos filhos - Estudante IMPNAT celebrando"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-primary/10" />
        </div>

        {/* Content Side */}
        <div className="bg-muted flex items-center order-1 lg:order-2">
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 w-full">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              Transforme o seu aprendizado em uma{" "}
              <span className="text-primary">carreira de sucesso</span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              No IMPNAT, oferecemos formação profissional de qualidade com certificação 
              reconhecida pela ANEP. Junte-se a milhares de alunos que já transformaram 
              suas vidas através da educação.
            </p>

            {/* Benefits List */}
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3 text-foreground">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 sm:px-8 font-medium text-sm sm:text-base w-full xs:w-auto"
              >
                <Link to="/inscricoes">
                  Inscrever-se Agora
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-foreground/30 text-foreground hover:bg-foreground/10 rounded-none px-6 sm:px-8 font-medium text-sm sm:text-base w-full xs:w-auto"
              >
                <a href="tel:+258875161111">
                  Ligar Agora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
