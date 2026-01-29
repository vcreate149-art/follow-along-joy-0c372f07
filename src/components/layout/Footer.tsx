import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-impnat.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="IMPNAT Logo" className="h-14 w-auto" />
              <div>
                <h3 className="font-heading font-bold text-xl">IMPNAT</h3>
                <p className="text-xs opacity-80">Instituto Médio Politécnico</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Formando profissionais qualificados para o mercado de trabalho moçambicano desde a nossa fundação. Certificados pela ANEP.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/impnat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/impnat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-secondary">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Início", href: "/" },
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Cursos", href: "/cursos" },
                { name: "Inscrições", href: "/inscricoes" },
                { name: "Galeria", href: "/galeria" },
                { name: "Contactos", href: "/contactos" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-secondary">
              Nossos Cursos
            </h4>
            <ul className="space-y-3">
              {[
                "Contabilidade e Gestão",
                "Secretariado Executivo",
                "Gestão de Logística",
                "Gestão de RH",
                "Electricidade Industrial",
                "Redes de Computadores",
              ].map((course) => (
                <li key={course}>
                  <Link
                    to="/cursos"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-secondary">
              Contactos
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+258875161111"
                  className="flex items-start gap-3 text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>+258 87 516 1111</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@impnat.co.mz"
                  className="flex items-start gap-3 text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>info@impnat.co.mz</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm opacity-80">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Alto Maé, Maputo<br />Moçambique</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
            <p>© 2025 IMPNAT. Todos os direitos reservados.</p>
            <p>Certificado pela ANEP - Autoridade Nacional da Educação Profissional</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
