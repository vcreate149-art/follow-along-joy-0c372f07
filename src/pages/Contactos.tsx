import { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram,
  Send,
  MessageCircle
} from "lucide-react";

const contactSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "O email deve ter no máximo 255 caracteres" }),
  telefone: z.string()
    .trim()
    .min(9, { message: "O telefone deve ter pelo menos 9 dígitos" })
    .max(15, { message: "O telefone deve ter no máximo 15 dígitos" })
    .regex(/^[0-9+\s-]+$/, { message: "Formato de telefone inválido" })
    .optional()
    .or(z.literal("")),
  assunto: z.string()
    .trim()
    .min(3, { message: "O assunto deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O assunto deve ter no máximo 100 caracteres" }),
  mensagem: z.string()
    .trim()
    .min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" })
    .max(1000, { message: "A mensagem deve ter no máximo 1000 caracteres" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contactos = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create WhatsApp message
    const message = encodeURIComponent(
      `*Nova Mensagem - Website IMPNAT*\n\n` +
      `*Nome:* ${data.nome}\n` +
      `*Email:* ${data.email}\n` +
      `${data.telefone ? `*Telefone:* ${data.telefone}\n` : ""}` +
      `*Assunto:* ${data.assunto}\n\n` +
      `*Mensagem:*\n${data.mensagem}`
    );

    setIsSubmitting(false);
    form.reset();

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contacto em breve.",
    });

    // Open WhatsApp
    window.open(`https://wa.me/258875161111?text=${message}`, "_blank");
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      content: "+258 87 516 1111",
      link: "tel:+258875161111",
      description: "Ligue-nos directamente"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "+258 87 516 1111",
      link: "https://wa.me/258875161111",
      description: "Resposta rápida"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@impnat.co.mz",
      link: "mailto:info@impnat.co.mz",
      description: "Envie-nos um email"
    },
    {
      icon: MapPin,
      title: "Localização",
      content: "Alto Maé, próximo à King Pie",
      link: "https://maps.google.com",
      description: "Maputo, Moçambique"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="bg-secondary text-secondary-foreground mb-4 animate-fade-in">
                Fale Connosco
              </Badge>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Entre em <span className="text-secondary">Contacto</span>
              </h1>
              <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Tem alguma dúvida sobre os nossos cursos? Quer saber mais sobre o processo de inscrição? 
                Estamos aqui para ajudar!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="bg-background py-12 sm:py-16 -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="bg-card border border-border p-6 rounded-lg text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300 opacity-0 animate-fade-in-up hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                  <p className="text-primary font-medium text-sm">{info.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{info.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Form + Info Section */}
        <section className="bg-muted py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <div className="bg-card p-6 sm:p-8 rounded-lg shadow-sm border border-border animate-fade-in">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  Envie-nos uma Mensagem
                </h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                              <Input placeholder="O seu nome" {...field} />
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
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="exemplo@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone (Opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="84 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="assunto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assunto *</FormLabel>
                            <FormControl>
                              <Input placeholder="Sobre o que deseja falar?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="mensagem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensagem *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Escreva a sua mensagem aqui..."
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none transition-all duration-300 hover:shadow-lg group"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">A enviar...</span>
                      ) : (
                        <>
                          Enviar Mensagem
                          <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Info Section */}
              <div className="space-y-6">
                {/* Opening Hours */}
                <div className="bg-card p-6 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Horário de Atendimento
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Segunda a Sexta</span>
                      <span className="font-medium text-foreground">08:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábado</span>
                      <span className="font-medium text-foreground">08:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingo</span>
                      <span className="font-medium text-foreground">Fechado</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-card p-6 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Siga-nos nas Redes Sociais
                  </h3>
                  
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com/institutoimpnat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-primary/10 transition-colors flex-1"
                    >
                      <Facebook className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground text-sm">Facebook</span>
                    </a>
                    <a
                      href="https://instagram.com/institutoimpnat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-primary/10 transition-colors flex-1"
                    >
                      <Instagram className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground text-sm">Instagram</span>
                    </a>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-card p-6 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                    Como Chegar
                  </h3>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary/50 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">Alto Maé, próximo à King Pie</p>
                      <p className="text-muted-foreground text-xs">Maputo, Moçambique</p>
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

export default Contactos;
