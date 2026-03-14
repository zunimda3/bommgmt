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
