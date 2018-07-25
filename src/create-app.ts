import { exec } from 'child_process';
import { existsSync } from 'fs';
import { Starter } from './starters';

export async function createApp(starter: Starter, projectName: string) {
  if (existsSync(projectName)) {
    throw new Error(`Folder "./${projectName}" already exists, please choose a different project name.`);
  }

  await cloneApp(starter.repo, projectName);
  await cdIntoNewApp(projectName);
  await removeOrigin();
  await installPackages();
  console.log(`
 🎉  All done!

\tcd ./${projectName}
\tnpm start
`);

  if (starter.docs) {
    console.log(`Check out the docs: ${starter.docs}\n`);
  }
}


function cloneApp(repo: string, projectName: string) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`\n 💎  Cloning ${repo}...`);
      exec(`git clone "https://github.com/${repo}" "${projectName}" --branch master --single-branch --depth 1`, (error, stdout, stderr) => {
        if (error) {
          reject(`⚠️  Couldn't check out "${projectName}"`);
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(`⚠️  Couldn't check out Stencil ${repo} into "${projectName}"`);
    }
  });
}

function cdIntoNewApp(projectName: string) {
  return new Promise((resolve) => {
    console.log(' 🏃‍  Changing directories...');
    process.chdir(`${projectName}`);
    resolve();
  });
}

function removeOrigin() {
  return new Promise((resolve) => {
    console.log(' 🔨  Preparing repo...');
    exec(`rm -rf .git`, () => {
      resolve();
    });
  });
}

function installPackages() {
  return new Promise((resolve) => {
    console.log(' 📦  Installing packages...');
    exec(`npm ci`, () => {
      resolve();
    });
  });
}
