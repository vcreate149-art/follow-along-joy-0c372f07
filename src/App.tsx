import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cursos from "./pages/Cursos";
import Sobre from "./pages/Sobre";
import Inscricoes from "./pages/Inscricoes";
import Galeria from "./pages/Galeria";
import Contactos from "./pages/Contactos";
import TesteVocacional from "./pages/TesteVocacional";
import Blog from "./pages/Blog";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";

// Dashboard pages (Student)
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import AcademicModule from "./pages/dashboard/AcademicModule";
import FinancialModule from "./pages/dashboard/FinancialModule";
import SecretariaDigital from "./pages/dashboard/SecretariaDigital";
import Avisos from "./pages/dashboard/Avisos";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import FinancialControl from "./pages/admin/FinancialControl";
import ContentManagement from "./pages/admin/ContentManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRolesManagement from "./pages/admin/AdminRolesManagement";
import AuthorizedEmails from "./pages/admin/AuthorizedEmails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/inscricoes" element={<Inscricoes />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/teste-vocacional" element={<TesteVocacional />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/auth" element={<Auth />} />

          {/* Student Dashboard Routes */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard/academico" element={<AcademicModule />} />
          <Route path="/dashboard/financeiro" element={<FinancialModule />} />
          <Route path="/dashboard/secretaria" element={<SecretariaDigital />} />
          <Route path="/dashboard/avisos" element={<Avisos />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/utilizadores" element={<UserManagement />} />
          <Route path="/admin/emails-autorizados" element={<AuthorizedEmails />} />
          <Route path="/admin/administradores" element={<AdminRolesManagement />} />
          <Route path="/admin/financeiro" element={<FinancialControl />} />
          <Route path="/admin/conteudo" element={<ContentManagement />} />
          <Route path="/admin/configuracoes" element={<AdminSettings />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
