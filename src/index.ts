import tc from 'colorette';
import { createApp } from './create-app';
import { getFlags } from './flags';
import { runInteractive } from './interactive';
import { getStarterRepo } from './starters';
import { cleanup, nodeVersionWarning } from './utils';
import { getPkgVersion } from './version';

const USAGE_DOCS = `${tc.bold(tc.yellow('Usage:'))}

npm init stencil [starter] [project-name] [--proxy]

  ${tc.dim('To request the downloads using a proxy, use')}
  ${tc.dim('either the --proxy command line flag, or the')}
  ${tc.dim('https_proxy environment variable.')}

${tc.dim('Example:')}
  ${tc.dim('npm init stencil app my-project --proxy http://168.63.76.32:3128')}
`;

async function run() {
  const flags = getFlags(process.env, process.argv.slice(2));

  if (flags.info) {
    console.log('create-stencil:', getPkgVersion());
    console.log('nodejs:', process.version, '\n');
    return 0;
  }
  if (flags.version) {
    console.log(`v${getPkgVersion()}`);
    return 0;
  }
  if (flags.help) {
    console.log(USAGE_DOCS);
    return 0;
  }

  nodeVersionWarning();

  let didError = false;
  try {
    if (flags.args.length === 2) {
      await createApp(
        getStarterRepo(flags.args[0]),
        flags.args[1],
        flags
      );

    } else if (flags.args.length < 2) {
      await runInteractive(flags.args[0], flags);

    } else {
      throw new Error(USAGE_DOCS);
    }
  } catch (e) {
    didError = true;
    console.error(`\n${tc.red('✖')} ${e.message}\n`);
  }
  cleanup(didError);
}

run();

process.on('uncaughtException', e => {
  console.error(`\n${tc.red('✖')} ${e}\n`);
  cleanup(true);
});

process.on('unhandledRejection', e => {
  console.error(`\n${tc.red('✖')} ${e}\n`);
  cleanup(true);
});
