import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia3 from "@/assets/gallery/cerimonia-3.jpg";
import cerimonia8 from "@/assets/gallery/cerimonia-8.jpg";
import cerimonia9 from "@/assets/gallery/cerimonia-9.jpg";

const galleryImages = [
  { src: cerimonia1, alt: "Cerimónia de Graduação" },
  { src: cerimonia2, alt: "Formandos IMPNAT" },
  { src: cerimonia3, alt: "Entrega de Certificados" },
  { src: cerimonia8, alt: "Evento Institucional" },
  { src: cerimonia9, alt: "Celebração" },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
            Galeria
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Momentos especiais das nossas cerimónias e eventos
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none px-12 font-medium"
          >
            <Link to="/galeria">
              VER GALERIA COMPLETA
            </Link>
          </Button>
        </div>

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Gallery image"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
