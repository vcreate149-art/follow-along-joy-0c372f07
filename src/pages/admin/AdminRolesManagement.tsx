import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/dashboard/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Search,
  Plus,
  Trash2,
  Users,
  Crown,
  UserCog,
  Briefcase,
  User,
  Loader2,
} from "lucide-react";
import { ADMIN_ROLES, getAdminLabel, getAdminLevel, hasPermission, type AdminRole } from "@/lib/admin-roles";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
  };
}

const roleIcons: Record<string, any> = {
  director_geral: Crown,
  admin: Crown,
  sub_director: UserCog,
  chefe_departamento: Briefcase,
  assistente: User,
};

const AdminRolesManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [newAdminForm, setNewAdminForm] = useState({
    user_id: "",
    role: "assistente" as AdminRole,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    checkPermissionsAndFetch();
  }, []);

  const checkPermissionsAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setCurrentUserId(session.user.id);

    // Get current user's role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    setCurrentUserRole(roleData?.role || null);
    
    await fetchData();
  };

  const fetchData = async () => {
    // Fetch all admin users with their profiles
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (rolesData) {
      // Get profiles for each role
      const userIds = rolesData.map(r => r.user_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      const adminsWithProfiles = rolesData.map(role => ({
        ...role,
        profile: profilesData?.find(p => p.user_id === role.user_id),
      }));

      setAdminUsers(adminsWithProfiles);
    }

    // Fetch all profiles for the add dialog
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, email")
      .order("full_name");

    setAllProfiles(profiles || []);
    setLoading(false);
  };

  const canManageRole = (targetRole: string): boolean => {
    if (!currentUserRole) return false;
    const currentLevel = getAdminLevel(currentUserRole);
    const targetLevel = getAdminLevel(targetRole);
    // Can only manage roles below your level (Director Geral can manage all)
    return currentLevel > targetLevel || currentLevel === 4;
  };

  const getAvailableRoles = (): AdminRole[] => {
    const currentLevel = getAdminLevel(currentUserRole);
    return Object.entries(ADMIN_ROLES)
      .filter(([_, info]) => info.level < currentLevel || currentLevel === 4)
      .filter(([key]) => key !== 'admin') // Hide legacy admin
      .map(([key]) => key as AdminRole);
  };

  const handleAddAdmin = async () => {
    if (!newAdminForm.user_id || !newAdminForm.role) {
      toast({
        title: "Erro",
        description: "Por favor selecione um utilizador e um cargo.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: newAdminForm.user_id,
          role: newAdminForm.role,
        });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Este utilizador já tem um cargo atribuído.");
        }
        throw error;
      }

      toast({
        title: "Sucesso",
        description: `Cargo de ${getAdminLabel(newAdminForm.role)} atribuído com sucesso.`,
      });

      setDialogOpen(false);
      setNewAdminForm({ user_id: "", role: "assistente" });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atribuir o cargo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (id: string, role: string, userId: string) => {
    if (userId === currentUserId) {
      toast({
        title: "Erro",
        description: "Não pode remover o seu próprio cargo.",
        variant: "destructive",
      });
      return;
    }

    if (!canManageRole(role)) {
      toast({
        title: "Erro",
        description: "Não tem permissão para remover este cargo.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Tem certeza que deseja remover o cargo de ${getAdminLabel(role)}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cargo removido com sucesso.",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o cargo.",
        variant: "destructive",
      });
    }
  };

  const filteredAdmins = adminUsers.filter(a =>
    a.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.profile?.email?.toLowerCase().includes(search.toLowerCase()) ||
    getAdminLabel(a.role).toLowerCase().includes(search.toLowerCase())
  );

  // Profiles that don't have an admin role yet
  const availableProfiles = allProfiles.filter(
    p => !adminUsers.some(a => a.user_id === p.user_id)
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Check if user has permission to manage admins
  if (!hasPermission(currentUserRole, "users")) {
    return (
      <AdminLayout>
        <Card className="border-destructive/50">
          <CardContent className="py-12 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Não tem permissão para gerir administradores.
            </p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Gestão de Administradores
          </h1>
          <p className="text-muted-foreground">
            Atribua e gira cargos administrativos na hierarquia do IMPNAT.
          </p>
        </div>

        {/* Hierarchy Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(ADMIN_ROLES)
            .filter(([key]) => key !== 'admin')
            .sort((a, b) => b[1].level - a[1].level)
            .map(([key, info]) => {
              const Icon = roleIcons[key] || Shield;
              const count = adminUsers.filter(a => a.role === key).length;
              return (
                <Card key={key} className={count > 0 ? "border-primary/30" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${count > 0 ? "bg-primary/10" : "bg-muted"}`}>
                        <Icon className={`h-5 w-5 ${count > 0 ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{info.label}</p>
                        <p className="text-2xl font-bold">{count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar administradores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Administrador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Administrador</DialogTitle>
                <DialogDescription>
                  Selecione um utilizador e atribua um cargo na hierarquia.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Utilizador</Label>
                  <Select
                    value={newAdminForm.user_id}
                    onValueChange={(value) => setNewAdminForm({ ...newAdminForm, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar utilizador" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProfiles.map((profile) => (
                        <SelectItem key={profile.user_id} value={profile.user_id}>
                          {profile.full_name} ({profile.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableProfiles.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Todos os utilizadores já têm cargos atribuídos.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Select
                    value={newAdminForm.role}
                    onValueChange={(value) => setNewAdminForm({ ...newAdminForm, role: value as AdminRole })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => {
                        const Icon = roleIcons[role] || Shield;
                        return (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {ADMIN_ROLES[role].label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddAdmin}
                    disabled={submitting || !newAdminForm.user_id}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Atribuir Cargo"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admins List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administradores Ativos
            </CardTitle>
            <CardDescription>
              Lista de todos os utilizadores com cargos administrativos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAdmins.length === 0 ? (
              <div className="py-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum administrador encontrado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAdmins
                  .sort((a, b) => getAdminLevel(b.role) - getAdminLevel(a.role))
                  .map((admin) => {
                    const Icon = roleIcons[admin.role] || Shield;
                    const isCurrentUser = admin.user_id === currentUserId;
                    const canManage = canManageRole(admin.role) && !isCurrentUser;
                    
                    return (
                      <div
                        key={admin.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          isCurrentUser ? "border-primary/50 bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {admin.profile?.full_name || "Utilizador"}
                              </p>
                              {isCurrentUser && (
                                <Badge variant="outline" className="text-xs">Você</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {admin.profile?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="gap-1">
                            <Icon className="h-3 w-3" />
                            {getAdminLabel(admin.role)}
                          </Badge>
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveAdmin(admin.id, admin.role, admin.user_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Referência de Permissões</CardTitle>
            <CardDescription>
              Cada nível hierárquico tem acesso a diferentes funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(ADMIN_ROLES)
                .filter(([key]) => key !== 'admin')
                .sort((a, b) => b[1].level - a[1].level)
                .map(([key, info]) => {
                  const Icon = roleIcons[key] || Shield;
                  return (
                    <div key={key} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">{info.label}</h4>
                        <Badge variant="outline" className="ml-auto">
                          Nível {info.level}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {info.permissions.map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {perm.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRolesManagement;
