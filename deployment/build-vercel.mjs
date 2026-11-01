import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function runVite(appName, outputDirectory) {
  const appRoot = resolve(root, appName);
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: appRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      ORANGE_CABS_BUILD_OUT_DIR: outputDirectory
    },
    shell: process.platform === 'win32'
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Vite build for ${appName} failed with exit code ${result.status}`);
  }
}

const outputRoot = resolve(root, 'deployment/vercel-output');
const publicOutput = resolve(outputRoot, 'client');
const adminOutput = resolve(outputRoot, 'admin');
const combinedAdminOutput = resolve(publicOutput, 'admin');

await rm(outputRoot, { recursive: true, force: true });
runVite('client', publicOutput);
runVite('admin', adminOutput);

await mkdir(publicOutput, { recursive: true });
await cp(adminOutput, combinedAdminOutput, { recursive: true });

console.log(`Combined public and admin builds in ${publicOutput}`);
