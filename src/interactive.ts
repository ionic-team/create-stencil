// @ts-ignore
import prompts from 'prompts';
import { createApp } from './create-app';
import { runFlags } from './flags';
import { STARTERS, getStarterRepo } from './starters';


export async function runInteractive(starter?: string) {
  console.log('👋  Welcome to Stencil Create App!\n');
  const starterName = starter || await askStarter();
  const repo = getStarterRepo(starterName);
  if (!repo) {
    throw new Error(`Starter "${starterName}" does not exist.`);
  }

  const projectName = await askProjectName();

  const confirm = await askConfirm(repo, projectName);
  if (confirm) {
    await runFlags(starterName, projectName);
  } else {
    console.log('\n aborting, bye bye \n');
  }
}

async function askStarter() {
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
    ...STARTERS.map(s => ({
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

async function askConfirm(repo: string, projectName: string) {
  console.log(`\nWe are about to clone "${repo}" into "./${projectName}"`);
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
