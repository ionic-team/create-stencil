// @ts-ignore
import prompts from 'prompts';
import { createApp } from './create-app';
import { runFlags } from './flags';
import { STARTERS, getStarterRepo } from './starters';


export async function runInteractive() {
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

  const repo = getStarterRepo(starterName);
  console.log(`\nWe are about to clone "${repo}" into "./${projectName}"`);
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
