// @ts-ignore
import prompts from 'prompts';
import tc from 'turbocolor';
import { createApp, prepareStarter } from './create-app';
import { STARTERS, Starter, getStarterRepo } from './starters';

export async function runInteractive(starterName: string | undefined, autoRun: boolean) {
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
  }
}

async function askStarterName(): Promise<string> {
  const { starterName } = await prompts([
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
    }
  ]);
  if (!starterName) {
    throw new Error(`No starter was provided, try again.`);
  }
  return starterName;
}

function getChoices() {
  const maxLength = Math.max(...STARTERS.map(s => s.name.length)) + 1;
  return [
    ...STARTERS
      .filter(s => s.hidden !== true)
      .map(s => {
        const description = s.description ? tc.dim(s.description) : '';
        return {
          title: `${padEnd(s.name, maxLength)} ${description}`,
          value: s.name
        };
      })
  ];
}

async function askProjectName() {
  const { projectName } = await prompts([{
    type: 'text',
    name: 'projectName',
    message: 'Project name',
  }]);
  if (!projectName) {
    throw new Error(`No project name was provided, try again.`);
  }
  return projectName;
}

async function askConfirm(starter: Starter, projectName: string) {
  const { confirm } = await prompts([{
    type: 'confirm',
    name: 'confirm',
    message: 'Confirm?'
  }]);
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
