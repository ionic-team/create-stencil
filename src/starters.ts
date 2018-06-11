

export const STARTERS: Starter[] = [
  {
    name: 'components',
    repo: 'ionic-team/stencil-component-starter',
    description: 'Collection of web components that can be used anywhere',
    docs: 'https://github.com/ionic-team/stencil-component-starter'
  },
  {
    name: 'app',
    repo: 'ionic-team/stencil-app-starter',
    description: 'Minimal starter for building an stencil app or website',
    docs: 'https://github.com/ionic-team/stencil-app-starter'
  },
  {
    name: 'ionic-pwa',
    repo: 'ionic-team/ionic-pwa-toolkit',
    description: 'Everything you need to build fast, production ready PWAs',
    docs: 'https://stenciljs.com/pwa/'
  }
];


export function getStarterRepo(starterName: string) {
  if (starterName.includes('/')) {
    return starterName;
  }
  const repo = STARTERS.find(starter => starter.name === starterName);
  return repo ? repo.repo : undefined;
}


export function getDocsRepo(starterName: string) {
  const repo = STARTERS.find(starter => starter.name === starterName);
  return repo ? repo.docs : undefined;
}


interface Starter {
  name: string;
  repo: string;
  description: string;
  docs: string;
}
