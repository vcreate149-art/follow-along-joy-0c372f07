import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Award, Building2, Calendar } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 2500,
    suffix: "+",
    label: "Alunos Formados",
  },
  {
    icon: Award,
    value: 95,
    suffix: "%",
    label: "Taxa de Empregabilidade",
  },
  {
    icon: Building2,
    value: 50,
    suffix: "+",
    label: "Empresas Parceiras",
  },
  {
    icon: Calendar,
    value: 10,
    suffix: "+",
    label: "Anos de Experiência",
  },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
    }
  }, [value, hasAnimated, isInView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-primary overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center p-3 sm:p-4"
              initial={{ 
                opacity: 0, 
                y: 60,
                rotateX: 45,
                scale: 0.8,
              }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                rotateX: 0,
                scale: 1,
              }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ 
                scale: 1.1,
                rotateY: 10,
                z: 50,
              }}
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <motion.div 
                className="flex justify-center mb-2 sm:mb-3"
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary rounded-full flex items-center justify-center"
                  whileHover={{ 
                    boxShadow: "0 10px 30px -10px hsl(var(--secondary) / 0.5)",
                  }}
                >
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary-foreground" />
                </motion.div>
              </motion.div>
              <motion.div 
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-1 sm:mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </motion.div>
              <motion.p 
                className="text-primary-foreground/80 text-xs sm:text-sm lg:text-base"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5, duration: 0.4 }}
              >
                {stat.label}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
