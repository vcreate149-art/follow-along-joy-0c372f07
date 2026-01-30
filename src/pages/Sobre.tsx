import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle,
  ArrowRight,
  Calendar,
  MapPin,
  Phone
} from "lucide-react";

import cerimonia1 from "@/assets/gallery/cerimonia-1.jpg";
import cerimonia2 from "@/assets/gallery/cerimonia-2.jpg";
import cerimonia5 from "@/assets/gallery/cerimonia-5.jpg";

const Sobre = () => {
  const valores = [
    {
      icon: GraduationCap,
      title: "Excelência Académica",
      description: "Compromisso com a qualidade do ensino e formação contínua dos docentes."
    },
    {
      icon: Heart,
      title: "Integridade",
      description: "Actuamos com honestidade, transparência e respeito em todas as relações."
    },
    {
      icon: Users,
      title: "Inclusão",
      description: "Educação acessível para todos, independentemente da origem socioeconómica."
    },
    {
      icon: Target,
      title: "Inovação",
      description: "Metodologias modernas e actualizadas às necessidades do mercado."
    },
    {
      icon: Briefcase,
      title: "Empregabilidade",
      description: "Formação orientada para o sucesso profissional dos nossos alunos."
    },
    {
      icon: Award,
      title: "Responsabilidade Social",
      description: "Contribuímos activamente para o desenvolvimento da comunidade."
    }
  ];

  const timeline = [
    {
      year: "2015",
      title: "Fundação",
      description: "O IMPNAT nasce com a missão de democratizar o acesso à educação técnica profissional em Moçambique."
    },
    {
      year: "2017",
      title: "Certificação ANEP",
      description: "Obtemos a acreditação da Autoridade Nacional de Educação Profissional, validando a qualidade dos nossos cursos."
    },
    {
      year: "2019",
      title: "Expansão de Cursos",
      description: "Lançamos novos cursos nas áreas de Tecnologia, Gestão e Administração para responder à demanda do mercado."
    },
    {
      year: "2021",
      title: "Parcerias Empresariais",
      description: "Estabelecemos acordos com empresas líderes para garantir estágios profissionais aos nossos formandos."
    },
    {
      year: "2023",
      title: "500+ Formandos",
      description: "Alcançamos a marca de mais de 500 profissionais formados e integrados no mercado de trabalho."
    },
    {
      year: "2025",
      title: "Novas Instalações",
      description: "Inauguramos laboratórios modernos e salas equipadas com tecnologia de ponta."
    }
  ];

  const stats = [
    { value: "500+", label: "Formandos", icon: GraduationCap },
    { value: "10+", label: "Cursos", icon: Award },
    { value: "95%", label: "Taxa de Empregabilidade", icon: Briefcase },
    { value: "20+", label: "Empresas Parceiras", icon: Building2 }
  ];

  const team = [
    {
      role: "Direcção Pedagógica",
      description: "Equipa dedicada à excelência do ensino e desenvolvimento curricular."
    },
    {
      role: "Corpo Docente",
      description: "Professores qualificados com experiência profissional nas suas áreas."
    },
    {
      role: "Apoio ao Estudante",
      description: "Acompanhamento personalizado para garantir o sucesso académico."
    },
    {
      role: "Relações Empresariais",
      description: "Ligação directa com o mercado de trabalho e gestão de estágios."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-primary py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={cerimonia1} 
              alt="Cerimónia IMPNAT" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                Desde 2015
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Sobre o <span className="text-secondary">IMPNAT</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg lg:text-xl leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                O Instituto Médio Politécnico de Negócios, Administração e Tecnologia é uma instituição 
                de ensino técnico profissional comprometida com a formação de jovens moçambicanos 
                para o mercado de trabalho.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-background py-12 sm:py-16 -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in-up hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="bg-muted py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission */}
              <div className="bg-card p-8 sm:p-10 rounded-lg shadow-sm border border-border animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Missão
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  Proporcionar educação técnica profissional de qualidade, acessível e orientada 
                  para o mercado de trabalho, formando profissionais competentes, éticos e 
                  preparados para contribuir activamente para o desenvolvimento socioeconómico 
                  de Moçambique.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-card p-8 sm:p-10 rounded-lg shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Eye className="h-7 w-7 text-secondary" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Visão
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  Ser a instituição de referência em educação técnica profissional em Moçambique, 
                  reconhecida pela excelência académica, inovação pedagógica e pelo impacto 
                  positivo na vida dos nossos estudantes e na comunidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Os Nossos <span className="text-primary">Valores</span>
              </h2>
              <p className="text-muted-foreground">
                Princípios que guiam todas as nossas acções e decisões.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valores.map((valor, index) => (
                <div 
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <valor.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    {valor.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {valor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="bg-muted py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                A Nossa <span className="text-primary">História</span>
              </h2>
              <p className="text-muted-foreground">
                Uma jornada de crescimento e compromisso com a educação.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform sm:-translate-x-1/2" />

                {timeline.map((item, index) => (
                  <div 
                    key={index}
                    className={`relative flex items-start gap-6 mb-8 opacity-0 animate-fade-in ${
                      index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                    style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
                  >
                    {/* Year Badge */}
                    <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 -translate-y-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                      <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-2">
                        {item.year}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Image */}
              <div className="relative animate-fade-in">
                <img 
                  src={cerimonia2} 
                  alt="Equipa IMPNAT" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg" />
              </div>

              {/* Content */}
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  A Nossa <span className="text-primary">Equipa</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Contamos com uma equipa de profissionais dedicados e qualificados, 
                  comprometidos com o sucesso de cada estudante.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {team.map((member, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 bg-muted rounded-lg opacity-0 animate-fade-in"
                      style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{member.role}</h4>
                        <p className="text-xs text-muted-foreground">{member.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="bg-muted py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Onde Estamos
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Endereço</h4>
                      <p className="text-muted-foreground">Alto Maé, próximo à King Pie, Maputo, Moçambique</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Contacto</h4>
                      <a href="tel:+258875161111" className="text-primary hover:underline">+258 87 516 1111</a>
                    </div>
                  </div>
                </div>

                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none group">
                  <Link to="/inscricoes">
                    Visita-nos e Inscreve-te
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="order-1 lg:order-2">
                <img 
                  src={cerimonia5} 
                  alt="Campus IMPNAT" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 animate-fade-in">
              Pronto para fazer parte da nossa história?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Junta-te a mais de 500 estudantes que já transformaram as suas vidas através da educação no IMPNAT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button
                asChild
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-none px-8 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
              >
                <Link to="/inscricoes">
                  Inscrever-se Agora
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-none px-8"
              >
                <Link to="/cursos">
                  Ver Cursos
                </Link>
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

export default Sobre;
