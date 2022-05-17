export interface Starter {
  name: string;
  repo: string;
  description?: string;
  docs?: string;
  hidden?: boolean;
  isCommunity?: boolean;
}

export const STARTERS: Starter[] = [
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
  {
    name: 'app',
    repo: 'ionic-team/stencil-app-starter',
    description: 'Minimal starter for building a Stencil app or website',
    docs: 'https://github.com/ionic-team/stencil-app-starter',
    isCommunity: true,
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
