import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import tc from 'turbocolor';
import { promisify } from 'util';

const childrenProcesses: ChildProcess[] = [];
let tmpDirectory: string | null = null;

export function setTmpDirectory(dir: string | null) {
  tmpDirectory = dir;
  if (dir) {
    rimraf(dir);
    process.once('uncaughtException', () => cleanup(true));
    process.once('exit', () => cleanup());
    process.once('SIGINT', () => cleanup());
    process.once('SIGTERM', () => cleanup());
  }
}

export function cleanup(didError = false) {
  if (tmpDirectory) {
    killChildren();
  }
  setTimeout(() => {
    if (tmpDirectory) {
      rimraf(tmpDirectory);
      tmpDirectory = null;
    }
    process.exit(didError ? 1 : 0);
  }, 200);
}

export function killChildren() {
  childrenProcesses.forEach(p => p.kill('SIGINT'));
}

export function npm(command: string, projectPath: string, stdio: any = 'ignore') {
  return new Promise((resolve, reject) => {
    const p = spawn('npm', [command], {
      shell: true,
      stdio,
      cwd: projectPath
    });
    p.once('exit', () => resolve());
    p.once('error', reject);
    childrenProcesses.push(p);
  });
}

export function rimraf(dir_path: string) {
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

export function onlyUnix(str: string) {
  return isWin() ? str : '';
}

export function printDuration(duration: number) {
  if (duration > 1000) {
    return `in ${(duration / 1000).toFixed(2)} s`;
  } else {
    const ms = parseFloat((duration).toFixed(3));
    return `in ${ms} ms`;
  }
}

export function isWin() {
  return process.platform === 'win32';
}

export function terminalPrompt() {
  return isWin() ? '>' : '$';
}

export const renameAsync = promisify(fs.rename);

export function nodeVersionWarning() {
  try {
    const v = process.version.replace('v', '').split('.');
    const major = parseInt(v[0], 10);
    const minor = parseInt(v[1], 10);
    if (major < 8 || (major === 8 && minor < 9)) {
      console.log(tc.yellow(`Your current version of Node is ${process.version}, however the recommendation is a minimum of Node 8.x LTS. Note that future versions of Stencil will eventually remove support for non-LTS Node versions.`));
    }
  } catch (e) { return; }
}
