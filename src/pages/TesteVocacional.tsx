import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VocationalTest from "@/components/VocationalTest";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

const TesteVocacional = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                <Brain className="h-3.5 w-3.5 mr-1" />
                Descobre o Teu Caminho
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Teste <span className="text-secondary">Vocacional</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Responde a algumas perguntas simples e descobre qual curso do IMPNAT 
                combina melhor com o teu perfil e interesses.
              </p>
            </div>
          </div>
        </section>

        {/* Test Section */}
        <section className="bg-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <VocationalTest />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TesteVocacional;
