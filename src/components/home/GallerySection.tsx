import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia3 from "@/assets/gallery/cerimonia-3.jpg";
import cerimonia4 from "@/assets/gallery/cerimonia-4.jpg";
import cerimonia5 from "@/assets/gallery/cerimonia-5.jpg";
import cerimonia6 from "@/assets/gallery/cerimonia-6.jpg";

const galleryImages = [
  { src: cerimonia1, alt: "Cerimónia de Graduação IMPNAT", caption: "Cerimónia de Formatura 2024" },
  { src: cerimonia2, alt: "Alunos IMPNAT", caption: "Nossos Formandos" },
  { src: cerimonia3, alt: "Evento IMPNAT", caption: "Entrega de Certificados" },
  { src: cerimonia4, alt: "Formatura IMPNAT", caption: "Celebração de Conquistas" },
  { src: cerimonia5, alt: "Graduação IMPNAT", caption: "Novos Profissionais" },
  { src: cerimonia6, alt: "Cerimónia IMPNAT", caption: "Momento Especial" },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="text-primary">Galeria</span> de Momentos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reviva os melhores momentos das nossas cerimónias e eventos
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? "h-64 md:h-full" : "h-48 md:h-64"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-heading font-semibold">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-heading text-xl font-semibold">
                    {selectedImage.caption}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
