import { canEditBom } from '@/lib/permissions';
import { createPersistedBomItem } from '@/lib/data/bom';
import { syncProjectPurchasingItems } from '@/lib/data/purchasing';
import { getProjectById } from '@/lib/data/projects';
import type { AggregatePartCategory } from '@/lib/purchasing/aggregate';
import type { DemoRole } from '@/lib/demo-users';
import { bomItemInputSchema } from '@/lib/validators/bom';

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
  const project = await getProjectById(projectId);

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

  const parsedInput = bomItemInputSchema.parse(input);
  const nextItem = await createPersistedBomItem({
    ...parsedInput,
    projectModuleId: moduleId,
  });

  await syncProjectPurchasingItems(projectId);

  return nextItem;
}
