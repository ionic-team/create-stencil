import { get, request, type RequestOptions } from 'https';
import * as Url from 'url';
import { Starter } from './starters';
import { HttpsProxyAgent } from 'https-proxy-agent';

/**
 * Build a URL to retrieve a starter template from a GitHub instance
 *
 * This function assumes that the starter will always be in a GitHub instance, as it returns a URL in string form that
 * is specific to GitHub.
 *
 * @param starter metadata for the starter template to build a URL for
 * @returns the generated URL to pull the template from
 */
export function getStarterUrl(starter: Starter): string {
  return new URL(`${starter.repo}/archive/main.zip`, getGitHubUrl()).toString();
}

/**
 * Retrieve the URL for the GitHub instance to pull the starter template from
 *
 * This function searches for the following environment variables (in order), using the first one that is found:
 * 1. stencil_self_hosted_url
 * 2. npm_config_stencil_self_hosted_url
 * 3. None - default to the publicly available GitHub instance
 *
 * @returns the URL for GitHub
 */
export function getGitHubUrl(): string {
  return (
    process.env['stencil_self_hosted_url'] ?? process.env['npm_config_stencil_self_hosted_url'] ?? 'https://github.com/'
  );
}

function getRequestOptions(starter: string | Starter) {
  const url = typeof starter === 'string' ? starter : getStarterUrl(starter);
  const options: RequestOptions = Url.parse(url);
  if (process.env['https_proxy']) {
    const agent = new HttpsProxyAgent(process.env['https_proxy']);
    options.agent = agent;
  }
  return options;
}

export function downloadStarter(starter: Starter | string) {
  return new Promise<Buffer>((resolve, reject) => {
    get(getRequestOptions(starter), (res) => {
      if (res.statusCode === 302) {
        downloadStarter(res.headers.location!).then(resolve, reject);
      } else {
        const data: any[] = [];

        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => {
          resolve(Buffer.concat(data));
        });
        res.on('error', reject);
      }
    });
  });
}

export function verifyStarterExists(starter: Starter | string) {
  const options = getRequestOptions(starter);
  options.method = 'HEAD';
  return new Promise<boolean>((resolve) => {
    const req = request(options, (res) => {
      res.destroy();
      if (res.statusCode === 404) {
        return resolve(false);
      }
      return resolve(true);
    });
    req.end();
  });
}
