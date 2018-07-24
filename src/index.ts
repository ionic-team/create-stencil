import { runFlags } from './flags';
import { runInteractive } from './interactive';


async function run() {
  const args = process.argv.slice(2);

  try {
    if (args.length > 2 || args[0] === '--help') {
      throw new Error(`Usage:

    npm init stencil [starter] [project-name]
    `);
    }
    const interactive = args.length < 2;
    if (interactive) {
      await runInteractive(args[0]);
    } else {
      await runFlags(args[0], args[1]);
    }
  } catch (e) {
    console.error(`\n❌  ${e.message}\n`);
  }
}

run();
