import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Motion3D, FloatingElement } from "@/components/animations/Motion3D";

import ctaImage from "@/assets/cta-image.jpg";

const benefits = [
  "Inscrição 100% Grátis",
  "Certificado reconhecido pela ANEP",
  "Estágio garantido em empresas parceiras",
  "Professores qualificados e experientes",
];

const CTASection = () => {
  return (
    <section className="bg-background overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Side */}
        <Motion3D type="slideLeft" className="relative h-48 sm:h-64 md:h-80 lg:h-auto lg:min-h-[500px] order-2 lg:order-1">
          <motion.img
            src={ctaImage}
            alt="Pais apoiem o futuro dos vossos filhos - Estudante IMPNAT celebrando"
            className="absolute inset-0 w-full h-full object-cover object-top"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-primary/10" />
        </Motion3D>

        {/* Content Side */}
        <div className="bg-muted flex items-center order-1 lg:order-2">
          <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 w-full">
            <Motion3D type="fadeUp">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
                Transforme o seu aprendizado em uma{" "}
                <motion.span 
                  className="text-primary inline-block"
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 10,
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  carreira de sucesso
                </motion.span>
              </h2>
            </Motion3D>
            
            <Motion3D type="fadeUp" delay={0.2}>
              <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                No IMPNAT, oferecemos formação profissional de qualidade com certificação 
                reconhecida pela ANEP. Junte-se a milhares de alunos que já transformaram 
                suas vidas através da educação.
              </p>
            </Motion3D>

            {/* Benefits List */}
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-2 sm:gap-3 text-foreground"
                  initial={{ opacity: 0, x: -30, rotateY: -20 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <span className="text-sm sm:text-base">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div 
              className="flex flex-col xs:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <FloatingElement amplitude={3} duration={2}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px -15px hsl(var(--primary) / 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6 sm:px-8 font-medium text-sm sm:text-base w-full xs:w-auto"
                  >
                    <Link to="/inscricoes">
                      Inscrever-se Agora
                      <motion.span
                        className="inline-block ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
              </FloatingElement>
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5,
                }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: "preserve-3d" }}
              >
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
