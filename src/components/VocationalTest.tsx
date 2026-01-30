import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  GraduationCap,
  Briefcase,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual destas atividades te atrai mais?",
    options: [
      { text: "Resolver problemas com números e cálculos", scores: { contabilidade: 3, logistica: 1 } },
      { text: "Organizar eventos e gerir agendas", scores: { secretariado: 3, rh: 1 } },
      { text: "Montar e reparar equipamentos eletrónicos", scores: { eletricidade: 2, informatica: 2 } },
      { text: "Criar conteúdo para redes sociais", scores: { marketing: 3, informatica: 1 } },
    ],
  },
  {
    id: 2,
    question: "Como preferes trabalhar?",
    options: [
      { text: "Sozinho, focado em tarefas específicas", scores: { contabilidade: 2, informatica: 2 } },
      { text: "Em equipa, coordenando pessoas", scores: { rh: 3, secretariado: 1 } },
      { text: "Com as mãos, fazendo trabalho prático", scores: { eletricidade: 3, logistica: 1 } },
      { text: "Comunicando com clientes e parceiros", scores: { marketing: 2, secretariado: 2 } },
    ],
  },
  {
    id: 3,
    question: "O que te motiva mais numa profissão?",
    options: [
      { text: "Segurança financeira e estabilidade", scores: { contabilidade: 2, rh: 2 } },
      { text: "Criatividade e inovação", scores: { marketing: 3, informatica: 1 } },
      { text: "Ajudar pessoas e fazer a diferença", scores: { rh: 2, secretariado: 2 } },
      { text: "Desafios técnicos e resolução de problemas", scores: { eletricidade: 2, informatica: 2 } },
    ],
  },
  {
    id: 4,
    question: "Qual disciplina mais gostavas na escola?",
    options: [
      { text: "Matemática", scores: { contabilidade: 3, logistica: 1 } },
      { text: "Português/Comunicação", scores: { secretariado: 2, marketing: 2 } },
      { text: "Física/Ciências", scores: { eletricidade: 3, informatica: 1 } },
      { text: "Informática/Tecnologia", scores: { informatica: 3, marketing: 1 } },
    ],
  },
  {
    id: 5,
    question: "Como lidas com pressão e prazos?",
    options: [
      { text: "Sou muito organizado e cumpro sempre", scores: { contabilidade: 2, secretariado: 2 } },
      { text: "Trabalho melhor sob pressão", scores: { logistica: 2, eletricidade: 2 } },
      { text: "Prefiro ambientes mais calmos", scores: { informatica: 2, contabilidade: 1 } },
      { text: "Adapto-me facilmente a qualquer situação", scores: { rh: 2, marketing: 2 } },
    ],
  },
];

const courseMapping: Record<string, { name: string; description: string; duration: string }> = {
  contabilidade: {
    name: "Contabilidade e Gestão",
    description: "Ideal para quem gosta de números, finanças e gestão empresarial.",
    duration: "3 Anos",
  },
  secretariado: {
    name: "Secretariado Executivo",
    description: "Perfeito para quem tem habilidades organizacionais e de comunicação.",
    duration: "3 Anos ou 4 Meses (Curto)",
  },
  eletricidade: {
    name: "Eletricidade Industrial",
    description: "Para quem gosta de trabalho técnico e prático com sistemas elétricos.",
    duration: "3 Anos",
  },
  informatica: {
    name: "Suporte Informático",
    description: "Ideal para apaixonados por tecnologia e resolução de problemas técnicos.",
    duration: "2 Anos",
  },
  rh: {
    name: "Gestão de Recursos Humanos",
    description: "Perfeito para quem gosta de trabalhar com pessoas e desenvolvimento de equipas.",
    duration: "3 Anos",
  },
  logistica: {
    name: "Gestão de Logística",
    description: "Para quem tem interesse em operações, supply chain e gestão de processos.",
    duration: "3 Anos",
  },
  marketing: {
    name: "Marketing Digital",
    description: "Ideal para criativos que querem dominar o mundo digital.",
    duration: "4 Meses (Curso Curto)",
  },
};

const VocationalTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (optionIndex: number) => {
    const option = questions[currentQuestion].options[optionIndex];
    const newScores = { ...scores };
    
    Object.entries(option.scores).forEach(([course, score]) => {
      newScores[course] = (newScores[course] || 0) + score;
    });
    
    setScores(newScores);
    setAnswers([...answers, optionIndex]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      const prevAnswer = answers[currentQuestion - 1];
      const prevOption = questions[currentQuestion - 1].options[prevAnswer];
      const newScores = { ...scores };
      
      Object.entries(prevOption.scores).forEach(([course, score]) => {
        newScores[course] = (newScores[course] || 0) - score;
      });
      
      setScores(newScores);
      setAnswers(answers.slice(0, -1));
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScores({});
    setShowResults(false);
  };

  const getTopCourses = () => {
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => ({ key, ...courseMapping[key] }));
  };

  if (showResults) {
    const topCourses = getTopCourses();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6 sm:p-8 bg-card border-border">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <GraduationCap className="h-10 w-10 text-primary" />
            </motion.div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Os Teus Resultados
            </h2>
            <p className="text-muted-foreground">
              Com base nas tuas respostas, estes são os cursos mais indicados para ti:
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {topCourses.map((course, index) => (
              <motion.div
                key={course.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  index === 0 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{course.name}</h3>
                      {index === 0 && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Melhor Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>Duração: {course.duration}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={restart}
              variant="outline"
              className="flex-1 border-border"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Repetir Teste
            </Button>
            <Button asChild className="flex-1 bg-primary text-primary-foreground">
              <Link to="/inscricoes">
                Inscrever-me Agora
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% completo</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 sm:p-8 bg-card border-border">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary flex items-center justify-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-foreground">{option.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <Button
                onClick={goBack}
                variant="ghost"
                className="mt-6 text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VocationalTest;
