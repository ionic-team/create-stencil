import { get } from 'https';
import HttpsProxyAgentModule from 'https-proxy-agent';
import * as Url from 'url';
import { CliFlags } from './flags';
import { Starter } from './starters';

export function downloadStarter(starter: Starter, flags: CliFlags) {
  const url = `https://github.com/${starter.repo}/archive/master.zip`;
  return downloadFromURL(url, flags);
}

function downloadFromURL(url: string, flags: CliFlags, urlRequests?: Set<string>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      if (flags.debug) {
        console.log(`download: ${url}`);
      }

      if (!urlRequests) {
        urlRequests = new Set();
      }
      if (urlRequests.has(url)) {
        reject(`${url} already requested`);
        return;
      }

      urlRequests.add(url);

      const options = Url.parse(url);

      if (typeof flags.httpsProxy === 'string') {
        // @ts-ignore
        options.agent = new HttpsProxyAgentModule(flags.httpsProxy);
      }

      get(options, (res) => {
        if (flags.debug) {
          console.log(`${url} ${res.statusCode}`);
        }
        if (res.statusCode === 302) {
          downloadFromURL(res.headers.location!, flags, urlRequests)
            .then(resolve, reject)
            .catch(err => {
              reject(err);
            });
        } else {
          const data: any[] = [];

          res.on('data', chunk => data.push(chunk));
          res.on('end', () => {
            resolve(Buffer.concat(data));
          });
          res.on('error', reject);
        }
      });

    } catch (e) {
      reject(e);
    }
  });
}
