import { spawn } from 'child_process';
import { Spinner } from 'cli-spinner';
import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import tc from 'turbocolor';
import { downloadStarter } from './download';
import { Starter } from './starters';
import { unZipBuffer } from './unzip';

export async function createApp(starter: Starter, projectName: string, autoRun: boolean) {
  if (fs.existsSync(projectName)) {
    throw new Error(`Folder "./${projectName}" already exists, please choose a different project name.`);
  }

  // Line break
  console.log('');

  const loading = new Spinner(tc.bold('Preparing starter'));
  loading.setSpinnerString(18);
  loading.start();
  const moveTo = await prepareStarter(starter);
  moveTo(projectName);
  loading.stop();

  const docs = starter.docs ? `Check out the docs: ${tc.underline(starter.docs)}\n` : '';

  console.log(`\n\n\n  ${tc.bold('All setup!')} 🎊 🎉
  ${docs}
  ${tc.dim('$')}  ${tc.green(`cd ./${projectName}`)}
  ${tc.dim('$')}  ${tc.green('npm start')}
`);

  if (autoRun) {
    await runStart(projectName);
  }
}

const starterCache = new Map<Starter, Promise<(name: string) => void>>();

export function prepareStarter(starter: Starter) {
  let promise = starterCache.get(starter);
  if (!promise) {
    promise = prepare(starter);
    starterCache.set(starter, promise);
  }
  return promise;
}

async function prepare(starter: Starter) {
  const buffer = await downloadStarter(starter);
  const tmpPath = join(tmpdir(), `stencil-starter-${Date.now()}`);
  const baseDir = process.cwd();
  const onExit = () => {
    rimraf(tmpPath);
    process.exit();
  };
  process.on('uncaughtException', onExit);
  process.on('exit', onExit);
  process.on('SIGINT', onExit);
  process.on('SIGTERM', onExit);

  await unZipBuffer(buffer, tmpPath);
  await installPackages(tmpPath);

  return (projectName: string) => {
    fs.renameSync(tmpPath, join(baseDir, projectName));
  };
}

function cd(path: string) {
  return new Promise((resolve) => {
    process.chdir(path);
    resolve();
  });
}

function installPackages(projectPath: string) {
  return new Promise((resolve, reject) => {
    const p = spawn('npm', ['ci'], {
      stdio: 'ignore',
      cwd: projectPath
    });
    p.once('exit', () => resolve());
    p.once('error', reject);
  });
}

function runStart(projectPath: string) {
  return new Promise((resolve) => {
    const p = spawn('npm', ['start'], {
      stdio: 'inherit',
      cwd: projectPath
    });
    p.once('exit', () => resolve());
  });
}

function rimraf(dir_path: string) {
  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach((entry) => {
      const entry_path = join(dir_path, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dir_path);
  }
}
