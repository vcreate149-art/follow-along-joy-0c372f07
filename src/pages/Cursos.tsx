import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  DollarSign, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";

// Cursos Curtos Images
import secretariadoCurto from "@/assets/cursos/secretariado-curto.jpg";
import informaticaBasica from "@/assets/cursos/informatica-basica.jpg";
import marketingDigital from "@/assets/cursos/marketing-digital.jpg";
import contabilidadeBasica from "@/assets/cursos/contabilidade-basica.jpg";

// Cursos Médios Images
import suporteInformatico from "@/assets/cursos/suporte-informatico.jpg";
import electricidadeIndustrial from "@/assets/cursos/electricidade-industrial.jpg";
import recursosHumanos from "@/assets/cursos/recursos-humanos.jpg";
import logistica from "@/assets/cursos/logistica.jpg";
import secretariadoMedio from "@/assets/cursos/secretariado-medio.jpg";
import contabilidadeMedio from "@/assets/cursos/contabilidade-medio.jpg";

type CourseCategory = "todos" | "medios" | "curtos";

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: "medio" | "curto";
  image: string;
  requirements: string[];
  highlights: string[];
}

const cursosMedios: Course[] = [
  {
    id: "suporte-informatico",
    name: "Suporte Informático",
    description: "Forma-te para montar, reparar e gerir sistemas informáticos. Aprende a diagnosticar problemas, instalar software e hardware, e dar suporte técnico profissional.",
    duration: "2 Anos",
    price: "3.500 MT/mês",
    category: "medio",
    image: suporteInformatico,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Formação prática em laboratório", "Certificação ANEP", "Estágio garantido"]
  },
  {
    id: "electricidade-industrial",
    name: "Electricidade Industrial",
    description: "Aprende a instalar, reparar e manter sistemas eléctricos industriais. Domina circuitos, quadros eléctricos e automação industrial.",
    duration: "3 Anos",
    price: "3.500 MT/mês",
    category: "medio",
    image: electricidadeIndustrial,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Formação prática e moderna", "Alta empregabilidade", "Certificação reconhecida"]
  },
  {
    id: "gestao-recursos-humanos",
    name: "Gestão de Recursos Humanos",
    description: "Aprende a arte de gerir pessoas. Domina recrutamento, selecção, formação, avaliação de desempenho e gestão de carreiras.",
    duration: "3 Anos",
    price: "2.500 MT/mês",
    category: "medio",
    image: recursosHumanos,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Gestão de equipas", "Liderança organizacional", "Desenvolvimento de talentos"]
  },
  {
    id: "gestao-logistica",
    name: "Gestão de Logística",
    description: "Aprende a gerir processos e operações logísticas. Domina cadeia de abastecimento, armazenagem, transporte e distribuição.",
    duration: "3 Anos",
    price: "2.500 MT/mês",
    category: "medio",
    image: logistica,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Supply chain management", "Gestão de stocks", "Operações logísticas"]
  },
  {
    id: "secretariado-executivo-medio",
    name: "Secretariado Executivo",
    description: "Domine a arte de organizar, comunicar e administrar processos. Formação completa em gestão de escritório e apoio executivo.",
    duration: "3 Anos",
    price: "2.500 MT/mês",
    category: "medio",
    image: secretariadoMedio,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Gestão de agenda", "Comunicação empresarial", "Protocolos administrativos"]
  },
  {
    id: "contabilidade-medio",
    name: "Contabilidade",
    description: "Domina a linguagem dos números e constrói um futuro sólido. Aprende contabilidade geral, fiscalidade, análise financeira e auditoria.",
    duration: "3 Anos",
    price: "2.500 MT/mês",
    category: "medio",
    image: contabilidadeMedio,
    requirements: ["10ª Classe concluída", "Idade mínima 15 anos", "Bilhete de Identidade"],
    highlights: ["Contabilidade geral", "Fiscalidade", "Análise financeira"]
  }
];

const cursosCurtos: Course[] = [
  {
    id: "secretariado-executivo-curto",
    name: "Secretariado Executivo",
    description: "Curso intensivo para dominar as competências essenciais de um secretário executivo moderno. Organização, comunicação e administração.",
    duration: "4 Meses",
    price: "2.000 MT/mês",
    category: "curto",
    image: secretariadoCurto,
    requirements: ["12ª Classe concluída ou equivalente", "Bilhete de Identidade"],
    highlights: ["Curso intensivo", "Certificado profissional", "Entrada rápida no mercado"]
  },
  {
    id: "informatica-basica",
    name: "Informática Básica",
    description: "Aprende a dominar as ferramentas essenciais do Office: Word, Excel, PowerPoint. Navegação na internet e gestão de emails.",
    duration: "4 Meses",
    price: "2.000 MT/mês",
    category: "curto",
    image: informaticaBasica,
    requirements: ["Saber ler e escrever", "Bilhete de Identidade"],
    highlights: ["Microsoft Office", "Internet e Email", "Produtividade digital"]
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital",
    description: "Domina as redes sociais, criação de conteúdo, publicidade online e estratégias de marketing digital para empresas.",
    duration: "4 Meses",
    price: "2.000 MT/mês",
    category: "curto",
    image: marketingDigital,
    requirements: ["Conhecimentos básicos de informática", "Bilhete de Identidade"],
    highlights: ["Redes sociais", "Publicidade online", "Criação de conteúdo"]
  },
  {
    id: "contabilidade-basica",
    name: "Contabilidade Básica",
    description: "Introdução prática à contabilidade. Aprende lançamentos, balancetes, demonstrações financeiras e noções fiscais.",
    duration: "4 Meses",
    price: "2.000 MT/mês",
    category: "curto",
    image: contabilidadeBasica,
    requirements: ["10ª Classe concluída", "Bilhete de Identidade"],
    highlights: ["Lançamentos contabilísticos", "Balancetes", "Noções fiscais"]
  }
];

const allCourses = [...cursosMedios, ...cursosCurtos];

const Cursos = () => {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("todos");

  const filteredCourses = activeCategory === "todos" 
    ? allCourses 
    : activeCategory === "medios" 
      ? cursosMedios 
      : cursosCurtos;

  const categories = [
    { id: "todos" as CourseCategory, label: "Todos os Cursos", count: allCourses.length },
    { id: "medios" as CourseCategory, label: "Cursos Médios", count: cursosMedios.length },
    { id: "curtos" as CourseCategory, label: "Cursos Curtos", count: cursosCurtos.length },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4">
                Inscrições Abertas 2025
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Os Nossos <span className="text-secondary">Cursos</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed mb-6">
                Formação profissional de qualidade com certificação ANEP. 
                Escolhe entre cursos médios de 2-3 anos ou cursos curtos intensivos de 4-6 meses.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <GraduationCap className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-foreground">{allCourses.length}</p>
                  <p className="text-xs text-primary-foreground/80">Cursos Disponíveis</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <Award className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-foreground">ANEP</p>
                  <p className="text-xs text-primary-foreground/80">Certificação</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <Briefcase className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-foreground">100%</p>
                  <p className="text-xs text-primary-foreground/80">Estágio Garantido</p>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <Users className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary-foreground">500+</p>
                  <p className="text-xs text-primary-foreground/80">Formandos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-muted py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-primary/10"
                  }`}
                >
                  {category.label}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-secondary/20">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Course Type Info */}
        {activeCategory !== "todos" && (
          <section className="bg-background py-8 border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                {activeCategory === "medios" ? (
                  <>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                      Cursos Médios Profissionais
                    </h2>
                    <p className="text-muted-foreground">
                      Formação completa com duração de 2 a 3 anos. Diploma reconhecido pela ANEP 
                      que te prepara para entrar no mercado de trabalho com competências sólidas.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                      Cursos Curtos Intensivos
                    </h2>
                    <p className="text-muted-foreground">
                      Formação intensiva de 4 meses. Ideal para quem quer adquirir competências 
                      específicas rapidamente e entrar no mercado de trabalho.
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Courses Grid */}
        <section className="bg-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCourses.map((course) => (
                <article 
                  key={course.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border group"
                >
                  {/* Course Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge 
                        className={course.category === "medio" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary text-secondary-foreground"
                        }
                      >
                        {course.category === "medio" ? "Curso Médio" : "Curso Curto"}
                      </Badge>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
                      {course.name}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course Details */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <DollarSign className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">{course.price}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-5">
                      {course.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Requirements Accordion */}
                    <details className="group/details mb-5">
                      <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary/80 list-none flex items-center gap-2">
                        <span>Ver Requisitos</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-open/details:rotate-90" />
                      </summary>
                      <ul className="mt-3 space-y-1.5 pl-2 border-l-2 border-primary/20">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </details>

                    {/* CTA Button */}
                    <Button
                      asChild
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
                    >
                      <Link to="/inscricoes">
                        Inscrever-se
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para começar a tua jornada?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Inscrição 100% grátis. Não percas esta oportunidade de transformar o teu futuro 
              com formação profissional de qualidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none px-8"
              >
                <Link to="/inscricoes">
                  Inscrever-se Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-none px-8"
              >
                <a href="tel:+258875161111">
                  Ligar: +258 87 516 1111
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cursos;
