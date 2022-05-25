import { prompt } from 'prompts';
import { cursor, erase } from 'sisteransi';
import { dim } from 'colorette';
import { createApp, prepareStarter } from './create-app';
import { STARTERS, Starter, getStarterRepo } from './starters';

/**
 * A prefix for community-driven projects
 */
const COMMUNITY_PREFIX = '[community]';

export async function runInteractive(starterName: string | undefined, autoRun: boolean) {
  process.stdout.write(erase.screen);
  process.stdout.write(cursor.to(0, 1));

  // Get starter's repo
  if (!starterName) {
    starterName = await askStarterName();
  }
  const starter = getStarterRepo(starterName);

  // start downloading in the background
  prepareStarter(starter);

  // Get project name
  const projectName = await askProjectName();

  // Ask for confirmation
  const confirm = await askConfirm(starter, projectName);
  if (confirm) {
    await createApp(starter, projectName, autoRun);
  } else {
    console.log('\n  aborting...');
  }
}

/**
 * Prompt the user for the name of a starter project to bootstrap with
 * @returns the name of the starter project to use
 */
async function askStarterName(): Promise<string> {
  const { starterName }: any = await prompt([
    {
      type: 'select',
      name: 'starterName',
      /**
       * the width of this message is intentionally kept to ~80 characters. this is a slightly arbitrary decision to
       * prevent one long single line message in wide terminal windows. this _should_ be changeable without any
       * negative impact on the code.
       */
      message: `Select a starter project.

Starters marked as ${COMMUNITY_PREFIX} are developed by the Stencil Community,
rather than Ionic. For more information on the Stencil Community, please see
https://github.com/stencil-community`,
      choices: getChoices(),
    },
    {
      type: (prev: any) => (prev === null ? 'text' : null),
      name: 'starterName',
      message: 'Type a custom starter',
    },
  ]);
  if (!starterName) {
    throw new Error(`No starter was provided, try again.`);
  }
  return starterName;
}

/**
 * Generate a terminal-friendly list of options for the user to select from
 * @returns a formatted list of starter options
 */
function getChoices(): ReadonlyArray<{ title: string; value: string }> {
  const maxLength = Math.max(...STARTERS.map((s) => generateStarterName(s).length)) + 1;
  return [
    ...STARTERS.filter((s) => s.hidden !== true).map((s) => {
      const description = s.description ? dim(s.description) : '';
      return {
        title: `${padEnd(generateStarterName(s), maxLength)}   ${description}`,
        value: s.name,
      };
    }),
  ];
}

/**
 * Generate the user-displayed name of the starter project
 * @param starter the starter project to format
 * @returns the formatted name
 */
function generateStarterName(starter: Starter): string {
  // ensure that community packages are differentiated from those supported by Ionic/the Stencil team
  return starter.isCommunity ? `${starter.name} ${COMMUNITY_PREFIX}` : starter.name;
}

async function askProjectName() {
  const { projectName }: any = await prompt([
    {
      type: 'text',
      name: 'projectName',
      message: 'Project name',
    },
  ]);
  if (!projectName) {
    throw new Error(`No project name was provided, try again.`);
  }
  return projectName;
}

async function askConfirm(starter: Starter, projectName: string) {
  const { confirm }: any = await prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Confirm?',
      initial: true,
    },
  ]);
  return confirm;
}

function padEnd(str: string, targetLength: number, padString = ' ') {
  targetLength = targetLength >> 0;
  if (str.length > targetLength) {
    return str;
  }

  targetLength = targetLength - str.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }

  return String(str) + padString.slice(0, targetLength);
}
