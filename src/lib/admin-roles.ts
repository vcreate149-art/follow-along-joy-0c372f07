// Admin role hierarchy types and utilities

export type AdminRole = 'director_geral' | 'sub_director' | 'chefe_departamento' | 'assistente' | 'admin';

export interface AdminRoleInfo {
  role: AdminRole;
  label: string;
  level: number;
  permissions: string[];
}

export const ADMIN_ROLES: Record<AdminRole, AdminRoleInfo> = {
  director_geral: {
    role: 'director_geral',
    label: 'Director Geral',
    level: 4,
    permissions: ['all', 'users', 'finance', 'content', 'settings', 'reports', 'delete'],
  },
  admin: {
    role: 'admin',
    label: 'Administrador',
    level: 4,
    permissions: ['all', 'users', 'finance', 'content', 'settings', 'reports', 'delete'],
  },
  sub_director: {
    role: 'sub_director',
    label: 'Sub-Director',
    level: 3,
    permissions: ['users', 'finance', 'content', 'settings', 'reports'],
  },
  chefe_departamento: {
    role: 'chefe_departamento',
    label: 'Chefe de Departamento',
    level: 2,
    permissions: ['users_view', 'finance_view', 'content', 'reports_view'],
  },
  assistente: {
    role: 'assistente',
    label: 'Assistente',
    level: 1,
    permissions: ['users_view', 'content_view'],
  },
};

export const getAdminLevel = (role: string | null): number => {
  if (!role) return 0;
  return ADMIN_ROLES[role as AdminRole]?.level || 0;
};

export const getAdminLabel = (role: string | null): string => {
  if (!role) return 'Utilizador';
  return ADMIN_ROLES[role as AdminRole]?.label || 'Utilizador';
};

export const isAdminRole = (role: string | null): boolean => {
  if (!role) return false;
  return role in ADMIN_ROLES;
};

export const hasPermission = (role: string | null, permission: string): boolean => {
  if (!role) return false;
  const roleInfo = ADMIN_ROLES[role as AdminRole];
  if (!roleInfo) return false;
  return roleInfo.permissions.includes('all') || roleInfo.permissions.includes(permission);
};

export const canAccessFeature = (role: string | null, requiredLevel: number): boolean => {
  return getAdminLevel(role) >= requiredLevel;
};
