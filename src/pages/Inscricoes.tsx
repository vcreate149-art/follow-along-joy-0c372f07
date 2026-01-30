import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  User,
  FileText,
  Loader2
} from "lucide-react";

const cursosMedios = [
  { value: "suporte-informatico", label: "Suporte Informático (2 Anos - 3.500 MT/mês)" },
  { value: "eletricidade-industrial", label: "Eletricidade Industrial (3 Anos - 3.500 MT/mês)" },
  { value: "gestao-recursos-humanos", label: "Gestão de Recursos Humanos (3 Anos - 2.500 MT/mês)" },
  { value: "gestao-logistica", label: "Gestão de Logística (3 Anos - 2.500 MT/mês)" },
  { value: "secretariado-executivo-medio", label: "Secretariado Executivo (3 Anos - 2.500 MT/mês)" },
  { value: "contabilidade-medio", label: "Contabilidade (3 Anos - 2.500 MT/mês)" },
];

const cursosCurtos = [
  { value: "secretariado-executivo-curto", label: "Secretariado Executivo (4 Meses - 2.000 MT/mês)" },
  { value: "informatica-basica", label: "Informática Básica (4 Meses - 2.000 MT/mês)" },
  { value: "marketing-digital", label: "Marketing Digital (4 Meses - 2.000 MT/mês)" },
  { value: "contabilidade-basica", label: "Contabilidade Básica (4 Meses - 2.000 MT/mês)" },
];

// Step 1 Schema - Course Selection
const step1Schema = z.object({
  tipoCurso: z.string().min(1, { message: "Selecione o tipo de curso" }),
  cursoEscolhido: z.string().min(1, { message: "Selecione o curso pretendido" }),
});

// Step 2 Schema - Personal Data
const step2Schema = z.object({
  nomeCompleto: z.string().trim().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }).max(100),
  dataNascimento: z.string().min(1, { message: "A data de nascimento é obrigatória" }),
  bilheteIdentidade: z.string().trim().min(5, { message: "O número do BI deve ter pelo menos 5 caracteres" }).max(20),
  telefone: z.string().trim().min(9, { message: "O telefone deve ter pelo menos 9 dígitos" }).max(15).regex(/^[0-9+\s-]+$/, { message: "Formato de telefone inválido" }),
  email: z.string().trim().email({ message: "Email inválido" }).max(255).optional().or(z.literal("")),
  morada: z.string().trim().min(5, { message: "A morada deve ter pelo menos 5 caracteres" }).max(200),
  escolaridade: z.string().min(1, { message: "Selecione a escolaridade" }),
  observacoes: z.string().max(500).optional(),
  aceitaTermos: z.boolean().refine(val => val === true, { message: "Deve aceitar os termos e condições" }),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const Inscricoes = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { tipoCurso: "", cursoEscolhido: "" },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      bilheteIdentidade: "",
      telefone: "",
      email: "",
      morada: "",
      escolaridade: "",
      observacoes: "",
      aceitaTermos: false,
    },
  });

  const tipoCurso = step1Form.watch("tipoCurso");
  const progress = (currentStep / 3) * 100;

  const onStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const onStep2Submit = async (data: Step2Data) => {
    if (!step1Data) return;
    setIsSubmitting(true);

    try {
      // Save to database
      const { error } = await supabase.from("inscricoes").insert({
        nome_completo: data.nomeCompleto,
        data_nascimento: data.dataNascimento,
        bilhete_identidade: data.bilheteIdentidade,
        telefone: data.telefone,
        email: data.email || null,
        morada: data.morada,
        escolaridade: data.escolaridade,
        tipo_curso: step1Data.tipoCurso,
        curso_escolhido: step1Data.cursoEscolhido,
        observacoes: data.observacoes || null,
        status: "pendente",
      });

      if (error) throw error;

      // Create WhatsApp message
      const cursoLabel = step1Data.tipoCurso === "medio" 
        ? cursosMedios.find(c => c.value === step1Data.cursoEscolhido)?.label 
        : cursosCurtos.find(c => c.value === step1Data.cursoEscolhido)?.label;

      const message = encodeURIComponent(
        `*Nova Pré-Inscrição IMPNAT*\n\n` +
        `*Nome:* ${data.nomeCompleto}\n` +
        `*Data Nascimento:* ${data.dataNascimento}\n` +
        `*BI:* ${data.bilheteIdentidade}\n` +
        `*Telefone:* ${data.telefone}\n` +
        `${data.email ? `*Email:* ${data.email}\n` : ""}` +
        `*Morada:* ${data.morada}\n` +
        `*Escolaridade:* ${data.escolaridade}\n` +
        `*Curso:* ${cursoLabel}\n` +
        `${data.observacoes ? `*Observações:* ${data.observacoes}\n` : ""}`
      );

      // Open WhatsApp
      window.open(`https://wa.me/258875161111?text=${message}`, "_blank");
      
      setCurrentStep(3);
      toast({
        title: "Pré-inscrição enviada!",
        description: "Entraremos em contacto em breve.",
      });
    } catch (error) {
      console.error("Error saving inscription:", error);
      toast({
        title: "Erro ao enviar",
        description: "Tenta novamente ou contacta-nos via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: GraduationCap, title: "Inscrição Grátis", description: "Sem taxas de inscrição" },
    { icon: Award, title: "Certificado ANEP", description: "Diploma reconhecido nacionalmente" },
    { icon: Briefcase, title: "Estágio Garantido", description: "Parcerias com empresas" },
  ];

  const steps = [
    { number: 1, title: "Escolhe o Curso", icon: GraduationCap },
    { number: 2, title: "Dados Pessoais", icon: User },
    { number: 3, title: "Confirmação", icon: CheckCircle },
  ];

  // Step 3 - Success
  if (currentStep === 3) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Pré-Inscrição Enviada!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                A sua pré-inscrição foi recebida com sucesso. A nossa equipa entrará em contacto 
                nas próximas 24-48 horas para confirmar os dados e agendar a entrega de documentos.
              </p>
              
              <Card className="p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-4">Próximos Passos:</h3>
                <ul className="space-y-3">
                  {[
                    "Aguarde o nosso contacto telefónico",
                    "Prepare os documentos: BI, certificado de habilitações, 2 fotos tipo passe",
                    "Visite o nosso campus para finalizar a matrícula"
                  ].map((step, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/">Voltar ao Início</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="https://wa.me/258875161111" target="_blank" rel="noopener noreferrer">
                    Contactar via WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                Inscrições Abertas 2026
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Inscreve-te <span className="text-secondary">Agora</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Preenche o formulário em 3 passos simples e dá o primeiro passo para transformar o teu futuro. 
                A inscrição é 100% grátis!
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.3 + index * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <benefit.icon className="h-6 w-6 text-secondary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-primary-foreground">{benefit.title}</h3>
                      <p className="text-xs text-primary-foreground/80">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps Indicator */}
        <section className="bg-muted py-6 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Progress value={progress} className="h-2 mb-6" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div 
                    key={step.number}
                    className={`flex flex-col items-center gap-2 ${
                      currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentStep >= step.number 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted-foreground/20 text-muted-foreground"
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {/* Step 1 - Course Selection */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="p-6 sm:p-8">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                          Passo 1: Escolhe o Curso
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Seleciona o tipo e curso que pretendes frequentar.
                        </p>

                        <Form {...step1Form}>
                          <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                            <FormField
                              control={step1Form.control}
                              name="tipoCurso"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo de Curso *</FormLabel>
                                  <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    step1Form.setValue("cursoEscolhido", "");
                                  }} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Selecione o tipo de curso" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="medio">Curso Médio (2-3 Anos)</SelectItem>
                                      <SelectItem value="curto">Curso Curto (4 Meses)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={step1Form.control}
                              name="cursoEscolhido"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Curso Pretendido *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value} disabled={!tipoCurso}>
                                    <FormControl>
                                      <SelectTrigger className="h-12">
                                        <SelectValue placeholder={tipoCurso ? "Selecione o curso" : "Selecione primeiro o tipo"} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {tipoCurso === "medio" && cursosMedios.map(curso => (
                                        <SelectItem key={curso.value} value={curso.value}>
                                          {curso.label}
                                        </SelectItem>
                                      ))}
                                      {tipoCurso === "curto" && cursosCurtos.map(curso => (
                                        <SelectItem key={curso.value} value={curso.value}>
                                          {curso.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button 
                              type="submit" 
                              size="lg"
                              className="w-full bg-primary text-primary-foreground py-6 text-lg group"
                            >
                              Continuar
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </form>
                        </Form>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 2 - Personal Data */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="p-6 sm:p-8">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                          Passo 2: Dados Pessoais
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          Preenche os teus dados para completar a inscrição.
                        </p>

                        <Form {...step2Form}>
                          <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={step2Form.control}
                                name="nomeCompleto"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>Nome Completo *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="O teu nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={step2Form.control}
                                name="dataNascimento"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Data de Nascimento *</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={step2Form.control}
                                name="bilheteIdentidade"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nº Bilhete de Identidade *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ex: 123456789A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={step2Form.control}
                                name="telefone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefone/Celular *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ex: 84 123 4567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={step2Form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email (Opcional)</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="exemplo@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={step2Form.control}
                                name="morada"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>Morada *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Bairro, Rua, Casa nº" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={step2Form.control}
                                name="escolaridade"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel>Escolaridade Atual *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="9-classe">9ª Classe</SelectItem>
                                        <SelectItem value="10-classe">10ª Classe</SelectItem>
                                        <SelectItem value="11-classe">11ª Classe</SelectItem>
                                        <SelectItem value="12-classe">12ª Classe</SelectItem>
                                        <SelectItem value="outro">Outro</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={step2Form.control}
                              name="observacoes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Observações (Opcional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Alguma informação adicional..." 
                                      className="min-h-[80px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>Máximo 500 caracteres</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={step2Form.control}
                              name="aceitaTermos"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Aceito os termos e condições e autorizo o tratamento dos meus dados *
                                    </FormLabel>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />

                            <div className="flex gap-4">
                              <Button 
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 py-6"
                              >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Voltar
                              </Button>
                              <Button 
                                type="submit" 
                                size="lg"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary text-primary-foreground py-6 text-lg group"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <>
                                    Enviar Inscrição
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <Card className="bg-primary text-primary-foreground p-6">
                  <h3 className="font-heading text-xl font-bold mb-4">Informações de Contacto</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <a href="tel:+258875161111" className="text-primary-foreground/90 hover:text-secondary transition-colors">
                          +258 87 516 1111
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Localização</p>
                        <p className="text-primary-foreground/90">
                          Alto Maé, próximo à King Pie<br />Maputo, Moçambique
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Horário</p>
                        <p className="text-primary-foreground/90">
                          Segunda a Sexta: 08:00 - 17:00
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-primary-foreground/20">
                    <Button 
                      asChild 
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <a href="https://wa.me/258875161111" target="_blank" rel="noopener noreferrer">
                        Falar via WhatsApp
                      </a>
                    </Button>
                  </div>
                </Card>

                {/* Documents Required */}
                <Card className="p-6">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Documentos Necessários
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Bilhete de Identidade (original e cópia)",
                      "Certificado de Habilitações",
                      "2 Fotografias tipo passe",
                      "Declaração de compromisso (menores)"
                    ].map((doc, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Vocational Test CTA */}
                <Card className="p-6 border-primary/20 bg-primary/5">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                    Não sabes qual curso escolher?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faz o nosso teste vocacional e descobre qual curso combina melhor contigo!
                  </p>
                  <Button asChild variant="outline" className="w-full border-primary text-primary">
                    <Link to="/teste-vocacional">
                      Fazer Teste Vocacional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Inscricoes;
