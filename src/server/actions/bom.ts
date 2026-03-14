import { canEditBom } from '@/lib/permissions';
import { DEMO_PROJECTS } from '@/lib/demo-projects';
import type { AggregatePartCategory } from '@/lib/purchasing/aggregate';
import type { DemoRole } from '@/lib/demo-users';

type CreateBomItemInput = {
  actor: {
    id: string;
    role: DemoRole;
  };
  input: {
    partCategory: AggregatePartCategory;
    partDescription: string;
    partNumber: string;
    price: number;
    quantity: number;
    vendor: string;
  };
  moduleId: string;
  projectId: string;
};

export async function createBomItem({ actor, input, moduleId, projectId }: CreateBomItemInput) {
  const project = DEMO_PROJECTS.find((entry) => entry.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const isAssigned = project.designerId === actor.id || project.purchaserId === actor.id;

  if (!canEditBom({ role: actor.role, isAssigned })) {
    throw new Error('Not authorized to edit BOM items');
  }

  const module = project.modules.find((entry) => entry.id === moduleId);

  if (!module) {
    throw new Error('Module not found');
  }

  const nextItemCode = module.items.length + 1;
  const nextItem = {
    id: `${moduleId}-item-${nextItemCode}`,
    itemCode: nextItemCode,
    ...input,
  };

  module.items.push(nextItem);

  return nextItem;
}
