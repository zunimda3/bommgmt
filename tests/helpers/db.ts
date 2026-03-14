import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from '@/lib/db';
import { seedDatabase } from '../../prisma/seed';

const thisFile = fileURLToPath(import.meta.url);
const testsDir = path.dirname(thisFile);
const projectRoot = path.resolve(testsDir, '..', '..');

let databasePrepared = false;

function ensureDatabaseReady() {
  if (databasePrepared) {
    return;
  }

  execSync('pnpm prisma db push --skip-generate', {
    cwd: projectRoot,
    env: process.env,
    stdio: 'pipe',
  });

  databasePrepared = true;
}

export async function resetDatabaseForTest() {
  ensureDatabaseReady();
  await seedDatabase();

  const users = await db.user.findMany({
    orderBy: {
      email: 'asc',
    },
    select: {
      email: true,
    },
  });

  return {
    userEmails: users.map((user) => user.email),
  };
}
