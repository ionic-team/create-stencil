// @ts-ignore
import prompts from 'prompts';
import { createApp } from './create-app';
import { STARTERS, Starter, getStarterRepo } from './starters';


export async function runInteractive(starterName?: string) {
  console.log('👋  Welcome to Stencil Create App!\n');

  // Get starter's repo
  if (!starterName) {
    starterName = await askStarterName();
  }
  const starter = getStarterRepo(starterName);

  // Get project name
  const projectName = await askProjectName();

  // Ask for confirmation
  const confirm = await askConfirm(starter, projectName);
  if (confirm) {
    await createApp(starter, projectName);
  } else {
    console.log('\n aborting, bye bye \n');
  }
}

async function askStarterName(): Promise<string> {
  console.log('   What kind of project do you want to create? \n');
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
      .map(s => ({
        title: `💎  ${padEnd(s.name, maxLength)} (${s.description})`,
        value: s.name
      })),
    { title: 'Other (specify)', value: null }
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
  console.log(`\nWe are about to clone "${starter.repo}" into "./${projectName}"`);
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
