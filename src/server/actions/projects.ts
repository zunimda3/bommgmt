import { canReadProject } from '@/lib/permissions';
import { listAggregateBomItems } from '@/lib/data/bom';
import { getProjectById, listVisibleProjectsForUser } from '@/lib/data/projects';
import { aggregateBomItems } from '@/lib/purchasing/aggregate';
import type { DemoRole } from '@/lib/demo-users';

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
