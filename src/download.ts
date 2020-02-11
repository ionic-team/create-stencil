import { get } from 'https';
import HttpsProxyAgentModule from 'https-proxy-agent';
import * as Url from 'url';
import { Starter } from './starters';

export function downloadStarter(starter: Starter) {
  const url = `https://github.com/${starter.repo}/archive/master.zip`;
  return downloadFromURL(url);
}

function downloadFromURL(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const options = Url.parse(url);

      const httpsProxyString = process.env.https_proxy;
      if (typeof httpsProxyString === 'string') {
        // @ts-ignore
        const agent = new HttpsProxyAgentModule(httpsProxyString);
        // @ts-ignore
        options.agent = agent;
      }

      get(options, (res) => {
        if (res.statusCode === 302) {
          downloadFromURL(res.headers.location!)
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
