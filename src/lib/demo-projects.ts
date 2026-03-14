import type { AggregatePartCategory } from '@/lib/purchasing/aggregate';

export type DemoBomItem = {
  id: string;
  itemCode: number;
  partCategory: AggregatePartCategory;
  partDescription: string;
  partNumber: string;
  price: number;
  quantity: number;
  vendor: string;
};

export type DemoProjectModule = {
  id: string;
  items: DemoBomItem[];
  name: string;
};

export type DemoProject = {
  code: string;
  description: string;
  designerId: string | null;
  id: string;
  modules: DemoProjectModule[];
  name: string;
  purchaserId: string | null;
  status: 'draft' | 'active';
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    code: 'PRJ-1001',
    description: 'Upgrade the packaging cell with a revised conveyor assembly and new guarding.',
    designerId: 'designer-demo-user',
    id: 'project-1',
    modules: [
      {
        id: 'module-1',
        name: 'Conveyor Frame',
        items: [
          {
            id: 'bom-1',
            itemCode: 1,
            partCategory: 'fabrication',
            partDescription: 'Frame rail',
            partNumber: 'CF-100',
            price: 140,
            quantity: 2,
            vendor: 'Acme Metals',
          },
          {
            id: 'bom-2',
            itemCode: 2,
            partCategory: 'standard_part',
            partDescription: 'Leveling foot',
            partNumber: 'CF-200',
            price: 18,
            quantity: 4,
            vendor: 'Acme Metals',
          },
        ],
      },
      {
        id: 'module-2',
        name: 'Drive',
        items: [
          {
            id: 'bom-3',
            itemCode: 1,
            partCategory: 'standard_part',
            partDescription: 'Servo motor',
            partNumber: 'DRV-510',
            price: 485,
            quantity: 1,
            vendor: 'Motion House',
          },
        ],
      },
    ],
    name: 'Packaging Cell Upgrade',
    purchaserId: 'purchaser-demo-user',
    status: 'active',
  },
  {
    code: 'PRJ-1002',
    description: 'Retrofit an existing station with updated sensor mounts and cable management.',
    designerId: null,
    id: 'project-2',
    modules: [],
    name: 'Inspection Station Retrofit',
    purchaserId: null,
    status: 'draft',
  },
];

export function findDemoProject(projectId: string) {
  return DEMO_PROJECTS.find((project) => project.id === projectId);
}
