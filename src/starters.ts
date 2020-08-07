export interface Starter {
  name: string;
  repo: string;
  description?: string;
  docs?: string;
  hidden?: boolean;
}

export const STARTERS: Starter[] = [
  {
    name: 'ionic-pwa',
    repo: 'ionic-team/ionic-pwa-toolkit',
    description: 'Everything you need to build fast, production ready PWAs',
    docs: 'https://ionicframework.com/docs',
  },
  {
    name: 'app',
    repo: 'ionic-team/stencil-app-starter',
    description: 'Minimal starter for building a Stencil app or website',
    docs: 'https://github.com/ionic-team/stencil-app-starter',
  },
  {
    name: 'component',
    repo: 'ionic-team/stencil-component-starter',
    description: 'Collection of web components that can be used anywhere',
    docs: 'https://github.com/ionic-team/stencil-component-starter',
  },
  {
    name: 'components',
    repo: 'ionic-team/stencil-component-starter',
    description: 'Collection of web components that can be used anywhere',
    docs: 'https://github.com/ionic-team/stencil-component-starter',
    hidden: true,
  },
];

export function getStarterRepo(starterName: string): Starter {
  if (starterName.includes('/')) {
    return {
      name: starterName,
      repo: starterName,
    };
  }
  const repo = STARTERS.find(starter => starter.name === starterName);
  if (!repo) {
    throw new Error(`Starter "${starterName}" does not exist.`);
  }
  return repo;
}
