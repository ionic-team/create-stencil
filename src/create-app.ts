import { Spinner } from 'cli-spinner';
import fs from 'fs';
import { join } from 'path';
import tc from 'turbocolor';
import { downloadStarter } from './download';
import { Starter } from './starters';
import { unZipBuffer } from './unzip';
import { cleanup, npm, onlyUnix, printDuration, setTmpDirectory, terminalPrompt } from './utils';

const starterCache = new Map<Starter, Promise<undefined | ((name: string) => void)>>();

export async function createApp(starter: Starter, projectName: string, autoRun: boolean) {
  if (fs.existsSync(projectName)) {
    throw new Error(`Folder "./${projectName}" already exists, please choose a different project name.`);
  }

  const loading = new Spinner(tc.bold('Preparing starter'));
  loading.setSpinnerString(18);
  loading.start();

  const startT = Date.now();
  const moveTo = await prepareStarter(starter);
  if (!moveTo) {
    throw new Error('starter install failed');
  }
  moveTo(projectName);
  loading.stop(true);

  const time = printDuration(Date.now() - startT);
  console.log(`${tc.green('✔')} ${tc.bold('All setup')} ${onlyUnix('🎉')} ${tc.dim(time)}

  ${tc.dim('Next steps:')}
   ${tc.dim(terminalPrompt())} ${tc.green(`cd ${projectName}`)}
   ${tc.dim(terminalPrompt())} ${tc.green('npm start')}
${renderDocs(starter)}
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
    starterCache.set(starter, promise);
  }
  return promise;
}

async function prepare(starter: Starter) {
  const baseDir = process.cwd();
  const tmpPath = join(baseDir, '.tmp-stencil-starter');
  try {
    const buffer = await downloadStarter(starter);
    setTmpDirectory(tmpPath);

    await unZipBuffer(buffer, tmpPath);
    await npm('ci', tmpPath);

    return (projectName: string) => {
      fs.renameSync(tmpPath, join(baseDir, projectName));
      setTmpDirectory(null);
    };
  } catch (e) {
    console.log(e);
    cleanup();
  }
}
