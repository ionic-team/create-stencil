import { ChildProcess } from 'child_process';
// @ts-ignore
import spawn from 'cross-spawn';
import fs from 'fs';
import { join } from 'path';

const childrenProcesses: ChildProcess[] = [];
let tmpDirectory: string | null = null;

export function setTmpDirectory(dir: string | null) {
  tmpDirectory = dir;
  if (dir) {
    rimraf(dir);
    process.once('uncaughtException', cleanup);
    process.once('exit', cleanup);
    process.once('SIGINT', cleanup);
    process.once('SIGTERM', cleanup);
  }
}

export function cleanup() {
  if (tmpDirectory) {
    killChildren();
    setTimeout(() => {
      if (tmpDirectory) {
        rimraf(tmpDirectory);
        tmpDirectory = null;
      }
      process.exit();
    }, 200);
  }
}

export function killChildren() {
  childrenProcesses.forEach(p => p.kill('SIGINT'));
}

export function npm(command: string, projectPath: string, stdio: any = 'ignore') {
  return new Promise((resolve, reject) => {
    const p = spawn('npm', [command], {
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

