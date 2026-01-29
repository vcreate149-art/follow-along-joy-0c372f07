import { Link } from "react-router-dom";
import { ArrowRight, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-secondary via-secondary to-impnat-gold-dark rounded-3xl p-8 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-secondary-foreground mb-6">
              Pronto para Começar a Tua Carreira?
            </h2>
            <p className="text-lg text-secondary-foreground/80 mb-10">
              Inscrições abertas para 2025! Não percas a oportunidade de te formares numa das melhores 
              instituições de ensino profissional de Moçambique.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-6"
              >
                <Link to="/inscricoes">
                  <FileText className="mr-2 h-5 w-5" />
                  Inscrever-se Agora
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 font-semibold text-lg px-8 py-6"
              >
                <a href="tel:+258875161111">
                  <Phone className="mr-2 h-5 w-5" />
                  Ligar Agora
                </a>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-8 text-secondary-foreground/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Inscrição Grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Certificado ANEP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Estágio Garantido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
