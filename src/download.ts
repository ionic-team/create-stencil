import { get } from 'https';
import * as Url from 'url';
import { Starter } from './starters';

// tslint:disable-next-line:no-var-requires
const HttpsProxyAgent = require('https-proxy-agent');

export function downloadStarter(starter: Starter) {
    return downloadFromURL(`https://github.com/${starter.repo}/archive/master.zip`);
}

function downloadFromURL(url: string): Promise<Buffer> {

    const options = Url.parse(url);
    const agent = new HttpsProxyAgent(process.env.https_proxy);

    // @ts-ignore
    options.agent = agent;

    return new Promise((resolve, reject) => {
        get(options, (res) => {
            if (res.statusCode === 302) {
                downloadFromURL(res.headers.location!).then(resolve, reject);
            } else {
                const data: any[] = [];

                res.on('data', chunk => data.push(chunk));
                res.on('end', () => {
                    resolve(Buffer.concat(data));
                });
                res.on('error', reject);
            }
        });
    });
}
