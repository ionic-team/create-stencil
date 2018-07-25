import { createApp } from './create-app';
import { runInteractive } from './interactive';
import { getStarterRepo } from './starters';

const USAGE_DOCS = `Usage:

npm init stencil [starter] [project-name]
`;

async function run() {
  const args = process.argv.slice(2);

  if (args.indexOf('--help') >= 0) {
    console.log(USAGE_DOCS);
    return 0;
  }
  try {
    if (args.length === 2) {
      await createApp(
        getStarterRepo(args[0]),
        args[1]
      );

    } else if (args.length < 2) {
      await runInteractive(args[0]);

    } else {
      throw new Error(USAGE_DOCS);
    }
  } catch (e) {
    console.error(`\n❌  ${e.message}\n`);
    return -1;
  }
}

run();
