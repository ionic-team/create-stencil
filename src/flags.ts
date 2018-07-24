import { createApp } from './create-app';
import { getDocsRepo, getStarterRepo } from './starters';


export async function runFlags(
  starterName: string,
  projectName: string
) {
  const docs = getDocsRepo(starterName);
  const repo = getStarterRepo(starterName);

  if (!repo) {
    throw new Error(`starter ${starterName} does not exist`);
  }

  await createApp(repo, projectName, docs);
}
