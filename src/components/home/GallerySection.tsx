import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia3 from "@/assets/gallery/cerimonia-3.jpg";
import cerimonia8 from "@/assets/gallery/cerimonia-8.jpg";
import cerimonia9 from "@/assets/gallery/cerimonia-9.jpg";
import cerimonia4 from "@/assets/gallery/cerimonia-4.jpg";

const galleryImages = [
  { src: cerimonia1, alt: "Cerimónia de Graduação IMPNAT 2024" },
  { src: cerimonia2, alt: "Formandos do IMPNAT celebrando" },
  { src: cerimonia3, alt: "Entrega de Certificados aos alunos" },
  { src: cerimonia8, alt: "Evento Institucional do IMPNAT" },
  { src: cerimonia9, alt: "Celebração de finalistas" },
  { src: cerimonia4, alt: "Momentos especiais na formatura" },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Galeria
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            Momentos especiais das nossas cerimónias e eventos
          </p>
        </div>

        {/* Gallery Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-12">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`aspect-square overflow-hidden cursor-pointer group rounded-lg ${
                index === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none px-8 sm:px-12 font-medium text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Link to="/galeria">
              VER GALERIA COMPLETA
            </Link>
          </Button>
        </div>

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl p-2 sm:p-4 overflow-hidden bg-background border rounded-lg">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded"
                />
                <p className="text-center text-sm sm:text-base text-muted-foreground mt-2 sm:mt-4">
                  {selectedImage.alt}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
