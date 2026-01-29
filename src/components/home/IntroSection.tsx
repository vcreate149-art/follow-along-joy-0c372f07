import { motion } from "framer-motion";

const IntroSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
            Transforme o seu aprendizado em uma{" "}
            <span className="text-primary">carreira de sucesso</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Na IMPNAT, oferecemos formação profissional de qualidade com certificação reconhecida, 
            preparando-te para o mercado de trabalho com competências práticas e estágio garantido.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroSection;
