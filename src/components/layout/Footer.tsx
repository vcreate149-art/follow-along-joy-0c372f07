import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import logo from "@/assets/logo-impnat.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Logo & About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img src={logo} alt="IMPNAT Logo" className="h-12 sm:h-14 w-auto" />
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl">IMPNAT</h3>
                <p className="text-xs opacity-80">Instituto Médio Politécnico</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed mb-4 sm:mb-6">
              Formando profissionais qualificados para o mercado de trabalho moçambicano desde a nossa fundação. Certificados pela ANEP.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://facebook.com/impnat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/impnat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-secondary">
              Links Rápidos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
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
                    className="text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-secondary">
              Nossos Cursos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                "Contabilidade e Gestão",
                "Secretariado Executivo",
                "Gestão de Logística",
                "Gestão de RH",
                "Eletricidade Industrial",
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
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-secondary">
              Contactos
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <a
                  href="tel:+258875161111"
                  className="flex items-start gap-3 text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                >
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                  <span>+258 87 516 1111</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@impnat.co.mz"
                  className="flex items-start gap-3 text-sm opacity-80 hover:opacity-100 hover:text-secondary transition-colors"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                  <span>info@impnat.co.mz</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm opacity-80">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                  <span>Alto Maé, Maputo<br />Moçambique</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-70 text-center sm:text-left">
            <p>© {new Date().getFullYear()} IMPNAT. Todos os direitos reservados.</p>
            <p>Certificado pela ANEP - Autoridade Nacional da Educação Profissional</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
