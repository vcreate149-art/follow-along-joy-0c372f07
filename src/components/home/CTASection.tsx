import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Motion3D, FloatingElement } from "@/components/animations/Motion3D";

const benefits = [
  "Inscrição 100% Grátis",
  "Certificado reconhecido pela ANEP",
  "Estágio garantido em empresas parceiras",
  "Professores qualificados e experientes",
];

const CTASection = () => {
  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Motion3D type="fadeUp">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              Pais, apoiem o futuro dos{" "}
              <motion.span 
                className="text-primary inline-block"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                vossos filhos
              </motion.span>
            </h2>
          </Motion3D>
          
          <Motion3D type="fadeUp" delay={0.2}>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
              Invista na educação profissional do seu filho. Com a formação certa, 
              ele terá as competências necessárias para entrar no mercado de trabalho 
              e construir um futuro próspero.
            </p>
          </Motion3D>

          {/* Benefits List */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left max-w-2xl mx-auto">
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
            className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4"
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
                className="border-2 border-foreground text-foreground bg-foreground/10 hover:bg-foreground/20 rounded-none px-6 sm:px-8 font-semibold text-sm sm:text-base w-full xs:w-auto"
              >
                <a href="tel:+258875161111">
                  Ligar Agora
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
