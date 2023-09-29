import { get, request, type RequestOptions } from 'https';
import { format } from 'util';
import * as Url from 'url';
import { Starter } from './starters';
import { HttpsProxyAgent } from 'https-proxy-agent';

const STARTER_URL = 'https://github.com/%s/archive/main.zip';

function getRequestOptions(starter: string | Starter) {
  const url = typeof starter === 'string' ? starter : format(STARTER_URL, starter.repo);
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
