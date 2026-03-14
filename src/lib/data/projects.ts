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

export async function createPersistedProject(input: {
  code: string;
  createdById: string;
  description: string;
  designerId?: string | null;
  name: string;
  purchaserId?: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
}) {
  return db.project.create({
    data: input,
  });
}

export async function createPersistedProjectModule(input: {
  name: string;
  projectId: string;
}) {
  const lastModule = await db.projectModule.findFirst({
    where: {
      projectId: input.projectId,
    },
    orderBy: {
      displayOrder: 'desc',
    },
  });

  return db.projectModule.create({
    data: {
      name: input.name,
      projectId: input.projectId,
      displayOrder: (lastModule?.displayOrder ?? 0) + 1,
    },
  });
}
