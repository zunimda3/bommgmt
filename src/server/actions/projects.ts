import { canReadProject } from '@/lib/permissions';
import { DEMO_PROJECTS, findDemoProject } from '@/lib/demo-projects';
import { aggregateBomItems } from '@/lib/purchasing/aggregate';
import type { DemoRole } from '@/lib/demo-users';

type VisibleProjectsInput = {
  user: {
    id: string;
    role: DemoRole;
  };
};

export async function visibleProjectsForUser({ user }: VisibleProjectsInput) {
  return DEMO_PROJECTS.filter((project) => {
    const isAssigned = project.designerId === user.id || project.purchaserId === user.id;
    return canReadProject({ role: user.role, isAssigned });
  });
}

export async function getProjectDetail(projectId: string) {
  return findDemoProject(projectId) ?? null;
}

export async function getProjectPurchasingRows(projectId: string) {
  const project = findDemoProject(projectId);

  if (!project) {
    return [];
  }

  return aggregateBomItems(
    project.modules.flatMap((module) =>
      module.items.map((item) => ({
        projectId: project.id,
        partNumber: item.partNumber,
        partDescription: item.partDescription,
        vendor: item.vendor,
        partCategory: item.partCategory,
        quantity: item.quantity,
      })),
    ),
  );
}
