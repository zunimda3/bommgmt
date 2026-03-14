import type { DemoRole } from '@/lib/demo-users';

type ScopeInput = {
  isAssigned: boolean;
  role: DemoRole;
};

export function canManageUsers(role: DemoRole) {
  return role === 'owner';
}

export function canManageProjects(role: DemoRole) {
  return role === 'owner' || role === 'admin';
}

export function canReadProject({ role, isAssigned }: ScopeInput) {
  if (role === 'owner' || role === 'admin') {
    return true;
  }

  return isAssigned;
}

export function canEditBom({ role, isAssigned }: ScopeInput) {
  if (role === 'owner' || role === 'admin') {
    return true;
  }

  return role === 'designer' && isAssigned;
}

export function canManageModules({ role, isAssigned }: ScopeInput) {
  return canEditBom({ role, isAssigned });
}

export function canEditPurchasing({ role, isAssigned }: ScopeInput) {
  if (role === 'owner' || role === 'admin') {
    return true;
  }

  return role === 'purchaser' && isAssigned;
}
