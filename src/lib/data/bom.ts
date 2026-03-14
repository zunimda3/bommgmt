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
