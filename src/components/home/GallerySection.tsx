import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Motion3D, StaggerContainer, StaggerItem } from "@/components/animations/Motion3D";

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
    <section className="py-12 sm:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Motion3D type="fadeUp" className="text-center mb-8 sm:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Galeria
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-4">
            Momentos especiais das nossas cerimónias e eventos
          </p>
        </Motion3D>

        {/* Gallery Grid - Responsive */}
        <StaggerContainer 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-12"
          staggerDelay={0.1}
        >
          {galleryImages.map((image, index) => (
            <StaggerItem 
              key={index} 
              type="scaleIn"
              className={index === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2" : ""}
            >
              <motion.div
                className="aspect-square overflow-hidden cursor-pointer group rounded-lg relative"
                onClick={() => setSelectedImage(image)}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: index % 2 === 0 ? 5 : -5,
                  rotateX: index % 2 === 0 ? -5 : 5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain bg-muted"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.span
                    className="text-primary-foreground font-semibold text-sm px-4 py-2 bg-primary/80 rounded-full opacity-0 group-hover:opacity-100"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Ver
                  </motion.span>
                </motion.div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <Motion3D type="scaleIn" delay={0.6} className="text-center">
          <motion.div
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block", transformStyle: "preserve-3d" }}
          >
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
          </motion.div>
        </Motion3D>

        {/* Lightbox */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl p-2 sm:p-4 overflow-hidden bg-background border rounded-lg">
            {selectedImage && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded"
                />
                <motion.p 
                  className="text-center text-sm sm:text-base text-muted-foreground mt-2 sm:mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedImage.alt}
                </motion.p>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;
