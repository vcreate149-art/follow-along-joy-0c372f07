import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo-impnat.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Sobre nós", href: "/sobre" },
  { name: "Cursos", href: "/cursos" },
  { name: "Galeria", href: "/galeria" },
  { name: "Contacto", href: "/contactos" },
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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="IMPNAT Logo" className="h-10 sm:h-12 w-auto" />
            <div>
              <h1 className="font-heading font-bold text-primary text-sm sm:text-lg leading-tight">
                IMPNAT
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight max-w-[120px] sm:max-w-none">
                Instituto Médio Politécnico
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social + WhatsApp */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://facebook.com/impnat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/impnat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium"
            >
              <a href="https://wa.me/258875161111" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
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
            <SheetContent side="right" className="w-[300px] bg-background">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8 pt-4">
                  <img src={logo} alt="IMPNAT Logo" className="h-12 w-auto" />
                  <div>
                    <h2 className="font-heading font-bold text-lg text-primary">IMPNAT</h2>
                    <p className="text-xs text-muted-foreground">Cursos Profissionais</p>
                  </div>
                </div>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-3 text-lg font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pb-8">
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    <a href="https://wa.me/258875161111" target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                      Contactar via WhatsApp
                    </a>
                  </Button>
                  <div className="flex gap-4 justify-center mt-6">
                    <a
                      href="https://facebook.com/impnat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a
                      href="https://instagram.com/impnat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
