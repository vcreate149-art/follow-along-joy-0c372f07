import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { 
  GraduationCap, 
  Award, 
  Briefcase, 
  CheckCircle,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  User,
  Mail,
  Calendar,
  FileText
} from "lucide-react";

const cursosMedios = [
  { value: "suporte-informatico", label: "Suporte Informático (2 Anos - 3.500 MT/mês)" },
  { value: "electricidade-industrial", label: "Electricidade Industrial (3 Anos - 3.500 MT/mês)" },
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

const inscricaoSchema = z.object({
  nomeCompleto: z.string()
    .trim()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  dataNascimento: z.string()
    .min(1, { message: "A data de nascimento é obrigatória" }),
  bilheteIdentidade: z.string()
    .trim()
    .min(5, { message: "O número do BI deve ter pelo menos 5 caracteres" })
    .max(20, { message: "O número do BI deve ter no máximo 20 caracteres" }),
  telefone: z.string()
    .trim()
    .min(9, { message: "O telefone deve ter pelo menos 9 dígitos" })
    .max(15, { message: "O telefone deve ter no máximo 15 dígitos" })
    .regex(/^[0-9+\s-]+$/, { message: "Formato de telefone inválido" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "O email deve ter no máximo 255 caracteres" })
    .optional()
    .or(z.literal("")),
  morada: z.string()
    .trim()
    .min(5, { message: "A morada deve ter pelo menos 5 caracteres" })
    .max(200, { message: "A morada deve ter no máximo 200 caracteres" }),
  escolaridade: z.string()
    .min(1, { message: "Seleccione a escolaridade" }),
  tipoCurso: z.string()
    .min(1, { message: "Seleccione o tipo de curso" }),
  cursoEscolhido: z.string()
    .min(1, { message: "Seleccione o curso pretendido" }),
  observacoes: z.string()
    .max(500, { message: "As observações devem ter no máximo 500 caracteres" })
    .optional(),
  aceitaTermos: z.boolean()
    .refine(val => val === true, { message: "Deve aceitar os termos e condições" }),
});

type InscricaoFormData = z.infer<typeof inscricaoSchema>;

const Inscricoes = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: {
      nomeCompleto: "",
      dataNascimento: "",
      bilheteIdentidade: "",
      telefone: "",
      email: "",
      morada: "",
      escolaridade: "",
      tipoCurso: "",
      cursoEscolhido: "",
      observacoes: "",
      aceitaTermos: false,
    },
  });

  const tipoCurso = form.watch("tipoCurso");

  const onSubmit = async (data: InscricaoFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create WhatsApp message
    const cursoLabel = tipoCurso === "medio" 
      ? cursosMedios.find(c => c.value === data.cursoEscolhido)?.label 
      : cursosCurtos.find(c => c.value === data.cursoEscolhido)?.label;

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

    setIsSubmitting(false);
    setIsSubmitted(true);

    toast({
      title: "Pré-inscrição enviada!",
      description: "Entraremos em contacto em breve. Pode também enviar via WhatsApp.",
    });

    // Open WhatsApp with prefilled message
    window.open(`https://wa.me/258875161111?text=${message}`, "_blank");
  };

  const benefits = [
    { icon: GraduationCap, title: "Inscrição Grátis", description: "Sem taxas de inscrição" },
    { icon: Award, title: "Certificado ANEP", description: "Diploma reconhecido nacionalmente" },
    { icon: Briefcase, title: "Estágio Garantido", description: "Parcerias com empresas" },
  ];

  const steps = [
    { number: "1", title: "Preencha o formulário", description: "Complete todos os campos obrigatórios" },
    { number: "2", title: "Envie via WhatsApp", description: "Confirme os dados e envie a pré-inscrição" },
    { number: "3", title: "Aguarde contacto", description: "A nossa equipa entrará em contacto" },
    { number: "4", title: "Finalize presencialmente", description: "Entregue documentos e confirme matrícula" },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Pré-Inscrição Enviada!
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                A sua pré-inscrição foi recebida com sucesso. A nossa equipa entrará em contacto 
                nas próximas 24-48 horas para confirmar os dados e agendar a entrega de documentos.
              </p>
              
              <div className="bg-muted p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-foreground mb-4">Próximos Passos:</h3>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Aguarde o nosso contacto telefónico</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Prepare os documentos: BI, certificado de habilitações, 2 fotos tipo passe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Visite o nosso campus para finalizar a matrícula</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/">
                    Voltar ao Início
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="https://wa.me/258875161111" target="_blank" rel="noopener noreferrer">
                    Contactar via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
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
        <section className="bg-primary py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                Inscrições Abertas 2025
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Inscreve-te <span className="text-secondary">Agora</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Preenche o formulário de pré-inscrição e dá o primeiro passo para transformar o teu futuro. 
                A inscrição é 100% grátis!
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm p-4 rounded-lg opacity-0 animate-fade-in-up hover:bg-primary-foreground/15 transition-colors duration-300"
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

        {/* Steps Section */}
        <section className="bg-muted py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-center text-foreground mb-8">
              Como Funciona o Processo de Inscrição
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-background py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border border-border animate-fade-in">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                    Formulário de Pré-Inscrição
                  </h2>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Data */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Dados Pessoais
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="nomeCompleto"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>Nome Completo *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Digite o seu nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
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
                            control={form.control}
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
                        </div>
                      </div>

                      {/* Contact Data */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Phone className="h-5 w-5 text-primary" />
                          Contactos
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                        </div>
                      </div>

                      {/* Course Selection */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          Escolha do Curso
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="escolaridade"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Escolaridade Actual *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione" />
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
                          
                          <FormField
                            control={form.control}
                            name="tipoCurso"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Curso *</FormLabel>
                                <Select onValueChange={(value) => {
                                  field.onChange(value);
                                  form.setValue("cursoEscolhido", "");
                                }} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione" />
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
                            control={form.control}
                            name="cursoEscolhido"
                            render={({ field }) => (
                              <FormItem className="sm:col-span-2">
                                <FormLabel>Curso Pretendido *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!tipoCurso}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={tipoCurso ? "Seleccione o curso" : "Seleccione primeiro o tipo de curso"} />
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
                        </div>
                      </div>

                      {/* Observations */}
                      <FormField
                        control={form.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              Observações (Opcional)
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Alguma informação adicional que queira partilhar..." 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Máximo 500 caracteres
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Terms */}
                      <FormField
                        control={form.control}
                        name="aceitaTermos"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Aceito os termos e condições e autorizo o tratamento dos meus dados para fins de inscrição *
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-lg py-6 transition-all duration-300 hover:shadow-lg group"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-pulse">A enviar...</span>
                          </>
                        ) : (
                          <>
                            Enviar Pré-Inscrição
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-primary text-primary-foreground p-6 rounded-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
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
                        <p className="font-medium">Horário de Atendimento</p>
                        <p className="text-primary-foreground/90">
                          Segunda a Sexta<br />08:00 - 17:00
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
                </div>

                {/* Documents Required */}
                <div className="bg-muted p-6 rounded-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
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
                </div>

                {/* FAQ Preview */}
                <div className="bg-card border border-border p-6 rounded-lg animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Perguntas Frequentes
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-foreground">A inscrição é mesmo grátis?</p>
                      <p className="text-muted-foreground">Sim! A taxa de inscrição é 100% gratuita.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Quando começam as aulas?</p>
                      <p className="text-muted-foreground">As turmas iniciam mensalmente. Consulte as datas disponíveis.</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Qual o horário das aulas?</p>
                      <p className="text-muted-foreground">Oferecemos horários diurnos e pós-laboral.</p>
                    </div>
                  </div>
                </div>
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
