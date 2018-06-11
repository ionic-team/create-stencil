import { createApp } from './create-app';
import { getDocsRepo, getStarterRepo } from './starters';


export async function runFlags(
  starterName: string | undefined,
  projectName: string | undefined
) {
  if (!starterName || !projectName) {
    throw new Error(`Missing project-name

Usage:

  npm init stencil <starter> <project-name>
`);
  }

  const docs = getDocsRepo(starterName);
  const repo = getStarterRepo(starterName);

  if (!repo) {
    throw new Error(`starter ${starterName} does not exist`);
  }

  await createApp(repo, projectName, docs);
}
