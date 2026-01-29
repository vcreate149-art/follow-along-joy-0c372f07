import { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
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
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-3 sm:p-4">
              <div className="flex justify-center mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-secondary rounded-full flex items-center justify-center">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-secondary-foreground" />
                </div>
              </div>
              <div className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-1 sm:mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-primary-foreground/80 text-xs sm:text-sm lg:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
