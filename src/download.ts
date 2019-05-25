
import { get } from 'https';
import { Starter } from './starters';


export function downloadStarter(starter: Starter) {
  return downloadFromURL(`https://github.com/${starter.repo}/archive/master.zip`);
}

function downloadFromURL(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const request = get(url, (res) => {
      if (res.statusCode === 302) {
        downloadFromURL(res.headers.location!).then(resolve, reject);
      } else {
        const data: any[] = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          resolve(Buffer.concat(data));
        });
      }
    });
    request.on('error', (e) => {
      reject(new Error(`Cannot download "${url}"\n  Check your internet connection\n\n  ${e}"`));
    });
  });
}
