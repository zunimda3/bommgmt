'use server';

import { revalidatePath } from 'next/cache';
import { requireCurrentUser } from '@/lib/auth/current-user';
import { canManageModules, canManageProjects, canReadProject } from '@/lib/permissions';
import { listAggregateBomItems } from '@/lib/data/bom';
import {
  createPersistedProject,
  createPersistedProjectModule,
  getProjectById,
  listVisibleProjectsForUser,
} from '@/lib/data/projects';
import { aggregateBomItems } from '@/lib/purchasing/aggregate';
import type { DemoRole } from '@/lib/demo-users';
import { projectInputSchema, projectModuleInputSchema } from '@/lib/validators/projects';

type VisibleProjectsInput = {
  user: {
    id: string;
    role: DemoRole;
  };
};

export async function visibleProjectsForUser({ user }: VisibleProjectsInput) {
  const projects = await listVisibleProjectsForUser(user);

  return projects.filter((project) => {
    const isAssigned = project.designerId === user.id || project.purchaserId === user.id;
    return canReadProject({ role: user.role, isAssigned });
  });
}

export async function getProjectDetail(projectId: string) {
  return getProjectById(projectId);
}

export async function getProjectPurchasingRows(projectId: string) {
  const items = await listAggregateBomItems(projectId);
  return aggregateBomItems(items);
}

type CreateProjectInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    code: string;
    description: string;
    designerId?: string | null;
    name: string;
    purchaserId?: string | null;
    status: 'draft' | 'active' | 'completed' | 'archived';
  };
};

export async function createProject({ actor, input }: CreateProjectInput) {
  if (!canManageProjects(actor.role)) {
    throw new Error('Not authorized to manage projects');
  }

  const parsedInput = projectInputSchema.parse(input);

  return createPersistedProject({
    ...parsedInput,
    createdById: actor.id,
  });
}

type CreateProjectModuleInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    name: string;
  };
  projectId: string;
};

export async function createProjectModule({ actor, input, projectId }: CreateProjectModuleInput) {
  const project = await getProjectById(projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const isAssigned = project.designerId === actor.id || project.purchaserId === actor.id;

  if (!canManageModules({ role: actor.role, isAssigned })) {
    throw new Error('Not authorized to manage modules');
  }

  const parsedInput = projectModuleInputSchema.parse(input);

  return createPersistedProjectModule({
    name: parsedInput.name,
    projectId,
  });
}

export async function createProjectFromForm(formData: FormData) {
  const actor = await requireCurrentUser();

  await createProject({
    actor: {
      id: actor.userId,
      role: actor.role,
    },
    input: {
      code: String(formData.get('code') ?? ''),
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      status: String(formData.get('status') ?? 'draft') as CreateProjectInput['input']['status'],
      designerId: String(formData.get('designerId') ?? '') || null,
      purchaserId: String(formData.get('purchaserId') ?? '') || null,
    },
  });

  revalidatePath('/projects');
}

export async function createProjectModuleFromForm(projectId: string, formData: FormData) {
  const actor = await requireCurrentUser();

  await createProjectModule({
    actor: {
      id: actor.userId,
      role: actor.role,
    },
    input: {
      name: String(formData.get('name') ?? ''),
    },
    projectId,
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/bom`);
}
