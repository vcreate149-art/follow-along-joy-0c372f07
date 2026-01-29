import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GallerySection from "@/components/home/GallerySection";
import { Badge } from "@/components/ui/badge";

const Galeria = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                Momentos IMPNAT
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Galeria de <span className="text-secondary">Fotos</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Revive os melhores momentos das nossas cerimónias de formatura, 
                actividades académicas e vida no campus.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <GallerySection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Galeria;
