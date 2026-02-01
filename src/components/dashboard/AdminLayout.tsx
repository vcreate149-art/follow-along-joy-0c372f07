import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Upload,
  Settings,
  LogOut,
  Menu,
  Bell,
  Shield,
  Mail,
} from "lucide-react";
import logo from "@/assets/logo-impnat.png";
import { isAdminRole, getAdminLabel, hasPermission, type AdminRole } from "@/lib/admin-roles";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin menu items with required permission levels
const adminMenuItemsConfig = [
  { title: "Visão Geral", url: "/admin", icon: LayoutDashboard, permission: null },
  { title: "Gestão de Utilizadores", url: "/admin/utilizadores", icon: Users, permission: "users_view" },
  { title: "Emails Autorizados", url: "/admin/emails-autorizados", icon: Mail, permission: "users" },
  { title: "Administradores", url: "/admin/administradores", icon: Shield, permission: "users" },
  { title: "Controlo Financeiro", url: "/admin/financeiro", icon: BarChart3, permission: "finance_view" },
  { title: "Gestão de Conteúdo", url: "/admin/conteudo", icon: Upload, permission: "content_view" },
  { title: "Configurações", url: "/admin/configuracoes", icon: Settings, permission: "settings" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [adminRole, setAdminRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      const role = roleData?.role as string | null;
      
      // If not admin, redirect to student area
      if (!isAdminRole(role)) {
        navigate("/impnat-aluno");
        return;
      }

      setAdminRole(role);

      // Get profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Filter admin menu items based on permissions
  const getAdminMenuItems = () => {
    return adminMenuItemsConfig.filter(item => {
      if (!item.permission) return true;
      return hasPermission(adminRole, item.permission);
    });
  };

  const menuItems = getAdminMenuItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar className="border-r bg-background">
          <div className="p-4 border-b bg-primary/5">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="IMPNAT" className="h-10 w-auto" />
              <div>
                <h1 className="font-heading font-bold text-primary text-lg">IMPNAT</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Administração
                </p>
              </div>
            </Link>
          </div>

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase text-muted-foreground px-2 mb-2">
                Gestão
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.url}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            location.pathname === item.url
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || user?.email}
                </p>
                <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                  <Shield className="h-3 w-3" />
                  {getAdminLabel(adminRole)}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Terminar Sessão
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background flex items-center px-4 gap-4">
            <SidebarTrigger className="lg:hidden">
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <div className="flex-1">
              <h2 className="font-heading font-semibold text-lg">
                {menuItems.find((item) => item.url === location.pathname)?.title || "Administração"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
