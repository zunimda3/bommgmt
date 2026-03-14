import { db } from '@/lib/db';

export async function listVisibleProjectsForUser(user: { id: string; role: 'owner' | 'admin' | 'designer' | 'purchaser' }) {
  if (user.role === 'owner' || user.role === 'admin') {
    return db.project.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  return db.project.findMany({
    where: {
      OR: [{ designerId: user.id }, { purchaserId: user.id }],
    },
    orderBy: {
      code: 'asc',
    },
  });
}

export async function getProjectById(projectId: string) {
  return db.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      designer: true,
      purchaser: true,
      modules: {
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
      },
    },
  });
}

export async function getProjectSummaries() {
  const [projectCount, activeProjectCount] = await Promise.all([
    db.project.count(),
    db.project.count({
      where: {
        status: 'active',
      },
    }),
  ]);

  return {
    projectCount,
    activeProjectCount,
  };
}
