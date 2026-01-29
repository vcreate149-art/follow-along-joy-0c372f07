import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "258875161111";
  const message = encodeURIComponent(
    "Olá! Gostaria de obter mais informações sobre os cursos do IMPNAT."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
      aria-label="Contactar via WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative flex items-center gap-2 sm:gap-3 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="font-semibold text-sm sm:text-base hidden xs:inline sm:inline">
            Fale Connosco
          </span>
        </div>

        {/* Tooltip on mobile */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-foreground text-background text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap xs:hidden">
          WhatsApp
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
