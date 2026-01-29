import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Motion3DProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: "card" | "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight" | "float" | "tilt" | "perspective";
}

const variants: Record<string, Variants> = {
  card: {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 15,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
    },
  },
  fadeUp: {
    hidden: { 
      opacity: 0, 
      y: 40,
    },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  },
  fadeIn: {
    hidden: { 
      opacity: 0,
    },
    visible: { 
      opacity: 1,
    },
  },
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
    },
  },
  slideLeft: {
    hidden: { 
      opacity: 0, 
      x: -80,
      rotateY: -10,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
    },
  },
  slideRight: {
    hidden: { 
      opacity: 0, 
      x: 80,
      rotateY: 10,
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
    },
  },
  float: {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    visible: { 
      opacity: 1,
      y: 0,
    },
  },
  tilt: {
    hidden: { 
      opacity: 0, 
      rotateX: 20,
      rotateY: -10,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    },
  },
  perspective: {
    hidden: { 
      opacity: 0,
      z: -100,
      rotateX: 25,
    },
    visible: { 
      opacity: 1,
      z: 0,
      rotateX: 0,
    },
  },
};

export const Motion3D = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.6,
  type = "card" 
}: Motion3DProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[type]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      style={{ 
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
};

interface Card3DProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
}

export const Card3D = ({ 
  children, 
  className = "", 
  hoverScale = 1.02,
  hoverRotate = 2,
}: Card3DProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale: hoverScale,
        rotateY: hoverRotate,
        rotateX: -hoverRotate,
        z: 30,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {children}
    </motion.div>
  );
};

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export const FloatingElement = ({
  children,
  className = "",
  amplitude = 10,
  duration = 3,
}: FloatingElementProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const Parallax = ({ children, className = "", speed = 0.5 }: ParallaxProps) => {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: -20 * speed }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ 
  children, 
  className = "",
  type = "card",
}: Omit<Motion3DProps, "delay">) => {
  return (
    <motion.div
      className={className}
      variants={variants[type]}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ 
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
};
