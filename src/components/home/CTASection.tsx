import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import cerimonia7 from "@/assets/gallery/cerimonia-7.jpg";

const CTASection = () => {
  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        {/* Image Side */}
        <div className="relative h-64 lg:h-auto">
          <img
            src={cerimonia7}
            alt="Estudantes IMPNAT"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Side */}
        <div className="bg-muted flex items-center">
          <div className="p-8 md:p-16 lg:p-20">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              Transforme o seu<br />
              aprendizado em uma<br />
              <span className="text-primary">carreira de sucesso</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              No IMPNAT, oferecemos formação profissional de qualidade com certificação 
              reconhecida pela ANEP. Junte-se a milhares de alunos que já transformaram 
              suas vidas através da educação.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 font-medium"
            >
              <Link to="/inscricoes">
                Inscrever-se Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
