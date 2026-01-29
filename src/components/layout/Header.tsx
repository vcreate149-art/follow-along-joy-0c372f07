import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo-impnat.webp";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Sobre Nós", href: "/sobre" },
  { name: "Cursos", href: "/cursos" },
  { name: "Inscrições", href: "/inscricoes" },
  { name: "Galeria", href: "/galeria" },
  { name: "Contactos", href: "/contactos" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+258875161111" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="h-4 w-4" />
              <span>+258 87 516 1111</span>
            </a>
            <a href="mailto:info@impnat.co.mz" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@impnat.co.mz</span>
            </a>
          </div>
          <div className="text-secondary font-medium">
            Inscrições Abertas 2025!
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg"
            : "bg-background"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="IMPNAT Logo" className="h-14 w-auto" />
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-primary text-lg leading-tight">
                  IMPNAT
                </h1>
                <p className="text-xs text-muted-foreground">
                  Instituto Médio Politécnico
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-gold">
                <Link to="/inscricoes">
                  Inscrever-se Agora
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-primary text-primary-foreground">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8 pt-4">
                    <img src={logo} alt="IMPNAT Logo" className="h-12 w-auto" />
                    <div>
                      <h2 className="font-heading font-bold text-lg">IMPNAT</h2>
                      <p className="text-xs opacity-80">Instituto Médio Politécnico</p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-3 text-lg font-medium hover:bg-primary-foreground/10 rounded-md transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto pb-8">
                    <Button
                      asChild
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                    >
                      <Link to="/inscricoes" onClick={() => setIsOpen(false)}>
                        Inscrever-se Agora
                      </Link>
                    </Button>
                    <div className="mt-6 space-y-3 text-sm opacity-80">
                      <a href="tel:+258875161111" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>+258 87 516 1111</span>
                      </a>
                      <a href="mailto:info@impnat.co.mz" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>info@impnat.co.mz</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
