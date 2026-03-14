export type DemoRole = 'owner' | 'admin' | 'designer' | 'purchaser';

export type DemoUser = {
  email: string;
  id: string;
  name: string;
  role: DemoRole;
};

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'owner@demo.local',
    id: 'owner-demo-user',
    name: 'Olivia Owner',
    role: 'owner',
  },
  {
    email: 'admin@demo.local',
    id: 'admin-demo-user',
    name: 'Aria Admin',
    role: 'admin',
  },
  {
    email: 'designer@demo.local',
    id: 'designer-demo-user',
    name: 'Daniel Designer',
    role: 'designer',
  },
  {
    email: 'purchaser@demo.local',
    id: 'purchaser-demo-user',
    name: 'Priya Purchaser',
    role: 'purchaser',
  },
];

export function findDemoUserByEmail(email: string) {
  return DEMO_USERS.find((user) => user.email === email);
}
