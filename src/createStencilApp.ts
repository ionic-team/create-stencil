import { exec } from 'child_process';
// @ts-ignore
import prompts from 'prompts';

const STARTERS = [
  {
    name: 'components',
    repo: 'ionic-team/stencil-component-starter'
  },
  {
    name: 'app',
    repo: 'ionic-team/stencil-app-starter'
  },
  {
    name: 'ionic-pwa',
    repo: 'ionic-team/ionic-pwa-toolkit'
  }
];

function getChoices() {
  return [
    ...STARTERS.map(s => ({
        title: `💎   ${s.name}`,
        value: s.repo
      })),
    { title: 'Other', value: null }
  ];
}


async function run() {
  const args = process.argv.slice(2);
  const interactive = args.length === 0;

  try {
    if (interactive) {
      await runInteractive();
    } else {
      await runFlags(args[0], args[1]);
    }
  } catch (e) {
    console.error(`\n❌  ${e.message}\n`);
  }
}

async function runInteractive() {
  console.log('👋  Welcome to Stencil Create App!\n');
  console.log('   What kind of project do you want to create? \n');

  const questions = [
    {
      type: 'select',
      name: 'starterName',
      message: 'Pick a starter',
      choices: getChoices(),
    },
    {
      type: (prev: any) => prev === null ? 'text' : null,
      name: 'starterName',
      message: 'Type a custom starter',
    },
    {
      type: (prev: any) => prev ? 'text' : null,
      name: 'projectName',
      message: 'Project name',
    }
  ];

  const { starterName, projectName } = await prompts(questions);
  if (!starterName) {
    throw new Error(`No starter was provided, try again.`);
  }
  if (!projectName) {
    throw new Error(`No project name was provided, try again.`);
  }


  console.log(`\nWe are about to clone "${starterName}" into "./${projectName}"`);
  const { confirm } = await prompts([{
    type: 'confirm',
    name: 'confirm',
    message: 'Confirm?'
  }]);

  if (confirm) {
    await runFlags(starterName, projectName);
  } else {
    console.log('\n aborting, bye bye \n');
  }
}

async function runFlags(
  starterName: string | undefined,
  projectName: string | undefined
) {
  if (!starterName || !projectName) {
    throw new Error(`Missing project-name

Usage:

  npm init stencil <starter> <project-name>
`);
  }

  const repo = getStarterRepo(starterName);
  if (!repo) {
    throw new Error(`starter ${starterName} does not exist`);
  }

  await createStencilApp(repo, projectName);
}

function getStarterRepo(starterName: string) {
  if (starterName.includes('/')) {
    return starterName;
  }
  const repo = STARTERS.find(starter => starter.name === starterName);
  return repo ? repo.repo : undefined;
}


async function createStencilApp(repo: string, projectName: string) {
  await cloneApp(repo, projectName);
  await cdIntoNewApp(projectName);
  await removeOrigin();
  await installPackages();
  console.log(`
🎉  All done!

\tcd ./${projectName}
\tnpm start
`);
}

function cloneApp(repo: string, projectName: string) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`\n💎  Cloning ${repo}`);
      exec(`git clone https://github.com/${repo} "${projectName}" --branch master --single-branch --depth 1`, (error, stdout, stderr) => {
        if (error) {
          reject(`⚠️  Couldn't check out "${projectName}"`);
        } else {
          resolve(true);
        }
      });
    } catch (e) {
      reject(`⚠️  Couldn't check out Stencil ${repo} into "${projectName}"`);
    }
  });
}

function cdIntoNewApp(projectName: string) {
  return new Promise((resolve) => {
    console.log('🏃‍  Changing Directories...');
    process.chdir(`${projectName}`);
    resolve();
  });
}

function removeOrigin() {
  return new Promise((resolve) => {
    console.log('✂️  Removing remotes in Git...');
    exec(`git remote rm origin`, () => {
      resolve();
    });
  });
}

function installPackages() {
  return new Promise((resolve) => {
    console.log('📦  Installing packages...');
    exec(`npm ci`, () => {
      resolve();
    });
  });
}

run();
