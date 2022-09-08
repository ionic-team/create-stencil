/**
 * Pull the current version of the CLI from the project's `package.json` file.
 *
 * @returns the current version of this CLI
 */
import { getPackageJson } from './utils';

export function getPkgVersion(): string {
  let packageJson: any = null;

  try {
    packageJson = getPackageJson();
  } catch (e) {
    // do nothing, we'll check that the package.json file could be found
    // and that it has a version field in the same check
  }

  if (!packageJson || !packageJson.version) {
    throw 'the version of this package could not be determined';
  }

  return packageJson.version;
}
