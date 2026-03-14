import { db } from '@/lib/db';
import type { AggregateBomItem } from '@/lib/purchasing/aggregate';

export async function listProjectModules(projectId: string) {
  return db.projectModule.findMany({
    where: {
      projectId,
    },
    orderBy: {
      displayOrder: 'asc',
    },
    include: {
      bomItems: {
        orderBy: {
          itemCode: 'asc',
        },
      },
    },
  });
}

export async function listAggregateBomItems(projectId: string): Promise<AggregateBomItem[]> {
  const items = await db.bomItem.findMany({
    where: {
      projectModule: {
        projectId,
      },
    },
    include: {
      projectModule: {
        select: {
          projectId: true,
        },
      },
    },
    orderBy: [{ projectModuleId: 'asc' }, { itemCode: 'asc' }],
  });

  return items.map((item) => ({
    projectId: item.projectModule.projectId,
    partNumber: item.partNumber,
    partDescription: item.partDescription,
    vendor: item.vendor,
    partCategory: item.partCategory,
    quantity: item.quantity,
  }));
}

export async function createPersistedBomItem(input: {
  partCategory: 'fabrication' | 'standard_part' | 'modifications';
  partDescription: string;
  partNumber: string;
  price: number;
  projectModuleId: string;
  quantity: number;
  vendor: string;
}) {
  const lastItem = await db.bomItem.findFirst({
    where: {
      projectModuleId: input.projectModuleId,
    },
    orderBy: {
      itemCode: 'desc',
    },
  });

  return db.bomItem.create({
    data: {
      ...input,
      itemCode: (lastItem?.itemCode ?? 0) + 1,
    },
  });
}
