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

  const loading = new Spinner(tc.bold('Preparing starter'));
  loading.setSpinnerString(18);
  loading.start();

  const startT = Date.now();
  const moveTo = await prepareStarter(starter);
  moveTo(projectName);
  loading.stop(true);

  const time = printDuration(Date.now() - startT);
  console.log(`${tc.green('✔')} ${tc.bold('All setup')} ${onlyUnix('🎉')} ${tc.dim(time)}

  ${tc.dim('Next steps:')}
   ${tc.dim(terminalPrompt())} ${tc.green(`cd ${projectName}`)}
   ${tc.dim(terminalPrompt())} ${tc.green('npm start')}
${renderDocs(starter)}
`);

  if (autoRun) {
    await runStart(projectName);
  }
}

function renderDocs(starter: Starter) {
  const docs = starter.docs;
  if (!docs) {
    return '';
  }
  return `
  ${tc.dim('Further reading:')}
   ${tc.dim('-')} ${tc.cyan(docs)}`;
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

function onlyUnix(str: string) {
  return process.platform !== 'win32' ? str : '';
}

function printDuration(duration: number) {
  if (duration > 1000) {
    return `in ${(duration / 1000).toFixed(2)} s`;
  } else {
    const ms = parseFloat((duration).toFixed(3));
    return `in ${duration} ms`;
  }
}

function terminalPrompt() {
  return process.platform === 'win32' ? '>' : '$';
}
