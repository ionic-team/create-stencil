import { Starter } from './starters';
import { getGitHubUrl, getStarterUrl, verifyStarterExists } from './download';

describe('download', () => {
  describe('verifyStarterExists', () => {
    it('returns false if starter does not exist', async () => {
      expect(
        await verifyStarterExists({
          repo: 'foo/bar',
          name: 'foo-bar-starter',
        }),
      ).toBe(false);
    });

    it('returns true if starter does exist', async () => {
      expect(
        await verifyStarterExists({
          repo: 'ionic-team/stencil',
          name: 'stencil',
        }),
      ).toBe(true);
    });
  });

  describe('getStarterUrl', () => {
    it('returns a well formed URL from the given starter', () => {
      const repo = 'ionic-team/mock-stencil-template';
      const starter: Starter = {
        name: 'test-starter',
        repo,
      };

      expect(getStarterUrl(starter)).toBe(`https://github.com/${repo}/archive/main.zip`);
    });
  });

  describe('getGitHubUrl', () => {
    it('returns the default GitHub host', () => {
      expect(getGitHubUrl()).toBe('https://github.com/');
    });
  });
});
