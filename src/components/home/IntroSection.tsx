import { motion } from "framer-motion";
import ctaImage from "@/assets/cta-image.jpg";

const IntroSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src={ctaImage}
                alt="Estudantes em formação profissional"
                className="w-full h-[350px] sm:h-[420px] lg:h-[500px] object-cover"
                style={{ objectPosition: 'center center' }}
              />
            </div>
            {/* Elemento decorativo */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-lg -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-lg -z-10" />
          </motion.div>

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
              Transforme o seu aprendizado em uma{" "}
              <span className="text-primary">carreira de sucesso</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-muted-foreground text-base sm:text-lg">
              Na IMPNAT, oferecemos formação profissional de qualidade com certificação reconhecida, 
              preparando-te para o mercado de trabalho com competências práticas e estágio garantido.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
