import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { Motion3D } from "@/components/animations/Motion3D";

const VocationalTestSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted overflow-hidden">
      <div className="container mx-auto px-4">
        <Motion3D type="fadeUp" className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 sm:p-12 lg:p-16">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.8 }}
                className="flex-shrink-0"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-secondary" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <span className="text-secondary font-medium text-sm uppercase tracking-wide">
                    Novo
                  </span>
                </div>
                
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  Não sabes que curso escolher?
                </h2>
                
                <p className="text-primary-foreground/90 text-base sm:text-lg mb-6 max-w-xl">
                  Faz o nosso teste vocacional interativo e descobre qual dos nossos cursos 
                  combina melhor com o teu perfil e interesses profissionais.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-6 text-base group"
                  >
                    <Link to="/teste-vocacional">
                      Fazer Teste Vocacional
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </Motion3D>
      </div>
    </section>
  );
};

export default VocationalTestSection;
