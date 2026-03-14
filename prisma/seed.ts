import { PrismaClient, PartCategory, ProjectStatus, PurchasingStatus, Role } from '@prisma/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEMO_USERS } from '../src/lib/demo-users';

const db = new PrismaClient();
const thisFile = fileURLToPath(import.meta.url);

const DEMO_ANNOUNCEMENTS = [
  {
    title: 'Quarter Kickoff',
    body: 'Prioritize BOM accuracy this week so purchasing can begin supplier outreach without delay.',
  },
] as const;

const DEMO_PROJECTS = [
  {
    code: 'PRJ-1001',
    name: 'Packaging Cell Upgrade',
    description: 'Upgrade the packaging cell with a revised conveyor assembly and new guarding.',
    status: ProjectStatus.active,
    assignDesigner: true,
    assignPurchaser: true,
    modules: [
      {
        name: 'Conveyor Frame',
        displayOrder: 1,
        items: [
          {
            itemCode: 1,
            partNumber: 'CF-100',
            partDescription: 'Frame rail',
            vendor: 'Acme Metals',
            partCategory: PartCategory.fabrication,
            quantity: 2,
            price: '140.00',
          },
          {
            itemCode: 2,
            partNumber: 'CF-200',
            partDescription: 'Leveling foot',
            vendor: 'Acme Metals',
            partCategory: PartCategory.standard_part,
            quantity: 4,
            price: '18.00',
          },
        ],
      },
      {
        name: 'Drive',
        displayOrder: 2,
        items: [
          {
            itemCode: 1,
            partNumber: 'DRV-510',
            partDescription: 'Servo motor',
            vendor: 'Motion House',
            partCategory: PartCategory.standard_part,
            quantity: 1,
            price: '485.00',
          },
        ],
      },
    ],
    purchasing: [
      {
        aggregateKey: 'PRJ-1001|CF-100|Frame rail|Acme Metals|fabrication',
        partNumber: 'CF-100',
        partDescription: 'Frame rail',
        vendor: 'Acme Metals',
        partCategory: PartCategory.fabrication,
        totalQuantity: 2,
        status: PurchasingStatus.pending,
      },
    ],
  },
  {
    code: 'PRJ-1002',
    name: 'Inspection Station Retrofit',
    description: 'Retrofit an existing station with updated sensor mounts and cable management.',
    status: ProjectStatus.draft,
    assignDesigner: false,
    assignPurchaser: false,
    modules: [],
    purchasing: [],
  },
] as const;

export function getSeedUserEmails() {
  return DEMO_USERS.map((user) => user.email);
}

export async function seedDatabase() {
  await db.purchasingItem.deleteMany();
  await db.bomItem.deleteMany();
  await db.projectModule.deleteMany();
  await db.project.deleteMany();
  await db.announcement.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  const createdUsers = await Promise.all(
    DEMO_USERS.map((user) =>
      db.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: Role[user.role],
        },
      }),
    ),
  );

  const owner = createdUsers.find((user) => user.role === Role.owner);
  const designer = createdUsers.find((user) => user.role === Role.designer);
  const purchaser = createdUsers.find((user) => user.role === Role.purchaser);

  if (!owner) {
    throw new Error('Owner seed user is required');
  }

  await Promise.all(
    DEMO_ANNOUNCEMENTS.map((announcement) =>
      db.announcement.create({
        data: {
          ...announcement,
          createdById: owner.id,
        },
      }),
    ),
  );

  for (const project of DEMO_PROJECTS) {
    const createdProject = await db.project.create({
      data: {
        code: project.code,
        name: project.name,
        description: project.description,
        status: project.status,
        createdById: owner.id,
        designerId: project.assignDesigner ? designer?.id : null,
        purchaserId: project.assignPurchaser ? purchaser?.id : null,
      },
    });

    for (const module of project.modules) {
      const createdModule = await db.projectModule.create({
        data: {
          projectId: createdProject.id,
          name: module.name,
          displayOrder: module.displayOrder,
        },
      });

      for (const item of module.items) {
        await db.bomItem.create({
          data: {
            projectModuleId: createdModule.id,
            itemCode: item.itemCode,
            partNumber: item.partNumber,
            partDescription: item.partDescription,
            vendor: item.vendor,
            partCategory: item.partCategory,
            quantity: item.quantity,
            price: item.price,
          },
        });
      }
    }

    for (const purchasingItem of project.purchasing) {
      await db.purchasingItem.create({
        data: {
          projectId: createdProject.id,
          aggregateKey: purchasingItem.aggregateKey,
          partNumber: purchasingItem.partNumber,
          partDescription: purchasingItem.partDescription,
          vendor: purchasingItem.vendor,
          partCategory: purchasingItem.partCategory,
          totalQuantity: purchasingItem.totalQuantity,
          status: purchasingItem.status,
        },
      });
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  seedDatabase()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
