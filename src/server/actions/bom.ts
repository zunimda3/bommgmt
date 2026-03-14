'use server';

import { revalidatePath } from 'next/cache';
import { requireCurrentUser } from '@/lib/auth/current-user';
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

export async function createBomItemFromForm(projectId: string, formData: FormData) {
  const actor = await requireCurrentUser();

  await createBomItem({
    actor: {
      id: actor.userId,
      role: actor.role,
    },
    projectId,
    moduleId: String(formData.get('moduleId') ?? ''),
    input: {
      partNumber: String(formData.get('partNumber') ?? ''),
      partDescription: String(formData.get('partDescription') ?? ''),
      vendor: String(formData.get('vendor') ?? ''),
      partCategory: String(formData.get('partCategory') ?? 'fabrication') as AggregatePartCategory,
      quantity: Number(formData.get('quantity') ?? 0),
      price: Number(formData.get('price') ?? 0),
    },
  });

  revalidatePath(`/projects/${projectId}/bom`);
  revalidatePath(`/projects/${projectId}/purchasing`);
}
