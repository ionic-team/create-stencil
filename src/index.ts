import { runFlags } from './flags';
import { runInteractive } from './interactive';


async function run() {
  const args = process.argv.slice(2);
  const interactive = args.length === 0;

  try {
    if (interactive) {
      await runInteractive();
    } else {
      await runFlags(args[0], args[1]);
    }
  } catch (e) {
    console.error(`\n❌  ${e.message}\n`);
  }
}

run();
