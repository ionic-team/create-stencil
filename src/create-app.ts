import { Spinner } from 'cli-spinner';
import fs from 'fs';
import { join } from 'path';
import tc from 'turbocolor';
import { downloadStarter } from './download';
import { Starter } from './starters';
import { unZipBuffer } from './unzip';
import { cleanup, npm, onlyUnix, printDuration, renameAsync, setTmpDirectory, terminalPrompt } from './utils';

// @ts-ignore
import replace from 'replace-in-file';

const starterCache = new Map<Starter, Promise<undefined | ((name: string) => Promise<void>)>>();

export async function createApp(starter: Starter, projectName: string, autoRun: boolean) {
  if (fs.existsSync(projectName)) {
    throw new Error(`Folder "./${projectName}" already exists, please choose a different project name.`);
  }

  projectName = projectName.toLowerCase().trim();

  if (!validateProjectName(projectName)) {
    throw new Error(`Project name "${projectName}" is not valid. It must be a snake-case name without spaces.`);
  }

  const loading = new Spinner(tc.bold('Preparing starter'));
  loading.setSpinnerString(18);
  loading.start();

  const startT = Date.now();
  const moveTo = await prepareStarter(starter);
  if (!moveTo) {
    throw new Error('starter install failed');
  }
  await moveTo(projectName);
  loading.stop(true);

  const time = printDuration(Date.now() - startT);
  console.log(`${tc.green('✔')} ${tc.bold('All setup')} ${onlyUnix('🎉')} ${tc.dim(time)}

  ${tc.dim(terminalPrompt())} ${tc.green('npm start')}
    Starts the development server.

  ${tc.dim(terminalPrompt())} ${tc.green('npm run build')}
    Builds your components/app in production mode.

  ${tc.dim(terminalPrompt())} ${tc.green('npm test')}
    Starts the test runner.


  ${tc.dim('We suggest that you begin by typing:')}

   ${tc.dim(terminalPrompt())} ${tc.green('cd')} ${projectName}
   ${tc.dim(terminalPrompt())} ${tc.green('npm start')}
${renderDocs(starter)}

  Happy coding! 🎈
`);

  if (autoRun) {
    await npm('start', projectName, 'inherit');
  }
}

function renderDocs(starter: Starter) {
  const docs = starter.docs;
  if (!docs) {
    return '';
  }
  return `
  ${tc.dim('Further reading:')}

   ${tc.dim('-')} ${tc.cyan(docs)}`;
}

export function prepareStarter(starter: Starter) {
  let promise = starterCache.get(starter);
  if (!promise) {
    promise = prepare(starter);
     // silent crash, we will handle later
    promise.catch(() => { return; });
    starterCache.set(starter, promise);
  }
  return promise;
}

async function prepare(starter: Starter) {
  const baseDir = process.cwd();
  const tmpPath = join(baseDir, '.tmp-stencil-starter');
  const buffer = await downloadStarter(starter);
  setTmpDirectory(tmpPath);

  await unZipBuffer(buffer, tmpPath);
  await npm('ci', tmpPath);

  return async (projectName: string) => {
    const filePath = join(baseDir, projectName);
    await renameAsync(tmpPath, filePath);
    await replace({
      files: [join(filePath, '*'), join(filePath, 'src/*')],
      from: /stencil-starter-project-name/g,
      to: projectName,
    });
    setTmpDirectory(null);
  };
}

function validateProjectName(projectName: string) {
  return !/[^a-zA-Z0-9-]/.test(projectName);
}
