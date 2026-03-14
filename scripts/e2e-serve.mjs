import { existsSync, readFileSync } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';
import path from 'node:path';

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const fileContents = readFileSync(filePath, 'utf8');
  const values = {};

  for (const line of fileContents.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    values[key] = rawValue.replace(/^"(.*)"$/, '$1');
  }

  return values;
}

const projectRoot = process.cwd();
const env = {
  ...process.env,
  ...loadEnvFile(path.join(projectRoot, '.env')),
  ...loadEnvFile(path.join(projectRoot, '.env.local')),
};

for (const command of [
  ['pnpm', ['db:push']],
  ['pnpm', ['db:seed']],
]) {
  const [bin, args] = command;
  const result = spawnSync(bin, args, {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const nextDev = spawn('pnpm', ['next', 'dev', '--port', '3100'], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
});

nextDev.on('exit', (code) => {
  process.exit(code ?? 0);
});
