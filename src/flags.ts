
export interface CliFlags {
  args: string[];
  autoRun: boolean;
  debug: boolean;
  help: boolean;
  httpsProxy: string | null;
  info: boolean;
  version: boolean;
}

export function getFlags(env: { [key: string]: string | undefined }, args: string[]) {
  const flags: CliFlags = {
    args: args.filter(a => !a.startsWith('-')),
    autoRun: args.includes('--run'),
    debug: args.includes('--debug'),
    help: args.includes('--help') || args.includes('-h'),
    httpsProxy: null,
    info: args.includes('--info'),
    version: args.includes('--version') || args.includes('-v'),
  };

  let httpsProxy = args.find(a => a.startsWith('--proxy='));
  if (typeof httpsProxy === 'string') {
    httpsProxy = httpsProxy.substring(8);
  } else {
    const httpProxyArgIndex = args.indexOf('--proxy');
    if (httpProxyArgIndex > -1) {
      httpsProxy = args[httpProxyArgIndex + 1];
    } else {
      httpsProxy = env.https_proxy;
    }
  }

  if (typeof httpsProxy === 'string') {
    httpsProxy = httpsProxy.trim();
    if (httpsProxy.length > 0 && !httpsProxy.startsWith('-')) {
      flags.httpsProxy = httpsProxy;
    }
  }

  if (flags.debug) {
    console.log(JSON.stringify(flags, null, 2));
  }

  return flags;
}
